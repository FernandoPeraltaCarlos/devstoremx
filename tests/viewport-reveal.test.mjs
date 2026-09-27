import assert from 'node:assert/strict';
import { test } from 'node:test';
import { setupViewportReveals } from '../src/scripts/viewport-reveal.ts';

// Exercise viewport events without launching or controlling a browser.
function environment({ reduced = false, supported = true, delays = ['0'] } = {}) {
  const observers = [];
  const listeners = new Set();
  const elements = delays.map(delay => {
    const classes = new Set();
    const properties = new Map();
    return {
      dataset: { revealDelay: delay },
      classList: {
        add: name => classes.add(name),
        remove: name => classes.delete(name),
        contains: name => classes.has(name),
      },
      style: { setProperty: (name, value) => properties.set(name, value) },
      properties,
    };
  });
  const motion = {
    matches: reduced,
    addEventListener: (_, listener) => listeners.add(listener),
    removeEventListener: (_, listener) => listeners.delete(listener),
  };
  class Observer {
    observed = [];
    disconnected = false;
    constructor(callback, options) {
      this.callback = callback;
      this.options = options;
      observers.push(this);
    }
    observe(element) { this.observed.push(element); }
    disconnect() { this.disconnected = true; }
    emit({ target = elements[0], visible = true, ratio = 0.2, height = 50, top = 600 } = {}) {
      this.callback([{
        target,
        isIntersecting: visible,
        intersectionRatio: ratio,
        intersectionRect: { height },
        boundingClientRect: { top },
      }]);
    }
  }
  const previousWindow = globalThis.window;
  globalThis.window = { matchMedia: () => motion, ...(supported ? { IntersectionObserver: Observer } : {}) };
  const cleanup = setupViewportReveals({ querySelectorAll: () => elements });
  return {
    observers, elements, listeners,
    setReduced(value) { motion.matches = value; listeners.forEach(listener => listener()); },
    cleanup() { cleanup(); globalThis.window = previousWindow; },
  };
}

test('replays after leaving and entering from either viewport edge', () => {
  const env = environment();
  try {
    const observer = env.observers[0];
    const element = env.elements[0];
    assert.deepEqual(observer.observed, [element]);
    observer.emit();
    assert.ok(element.classList.contains('reveal-visible'));
    assert.equal(element.properties.get('--reveal-dir'), '1');
    // Leaving through the top prepares an entrance from above before it is visible again.
    observer.emit({ visible: false, ratio: 0, height: 0, top: -400 });
    assert.equal(element.classList.contains('reveal-visible'), false);
    assert.equal(element.properties.get('--reveal-dir'), '-1');
    observer.emit({ top: -100 });
    assert.ok(element.classList.contains('reveal-visible'));
    assert.equal(element.properties.get('--reveal-dir'), '-1');
    observer.emit({ visible: false, ratio: 0, height: 0, top: 1200 });
    assert.equal(element.properties.get('--reveal-dir'), '1');
    observer.emit();
    assert.equal(element.properties.get('--reveal-dir'), '1');
    assert.equal(observer.disconnected, false);
  } finally { env.cleanup(); }
});

test('waits for enough visibility and does not reset during partial exits', () => {
  const env = environment();
  try {
    const observer = env.observers[0];
    const element = env.elements[0];
    observer.emit({ ratio: 0.01, height: 2 });
    assert.equal(element.classList.contains('reveal-visible'), false);
    observer.emit();
    observer.emit({ ratio: 0.01, height: 2, top: -100 });
    assert.ok(element.classList.contains('reveal-visible'));
    assert.equal(element.properties.get('--reveal-dir'), '1');
  } finally { env.cleanup(); }
});

test('can activate tall elements by visible height', () => {
  const env = environment();
  try {
    env.observers[0].emit({ ratio: 0.05, height: 50 });
    assert.ok(env.elements[0].classList.contains('reveal-visible'));
  } finally { env.cleanup(); }
});

test('disables and restores observers when motion preferences change', () => {
  const env = environment({ reduced: true });
  try {
    assert.equal(env.observers.length, 0);
    env.setReduced(false);
    const observer = env.observers[0];
    observer.emit();
    env.setReduced(true);
    assert.ok(observer.disconnected);
    assert.equal(env.elements[0].classList.contains('reveal-visible'), false);
    env.setReduced(false);
    assert.equal(env.observers.length, 2);
  } finally { env.cleanup(); }
  assert.equal(env.listeners.size, 0);
  assert.ok(env.observers[1].disconnected);
});

test('leaves content alone when IntersectionObserver is unavailable', () => {
  const env = environment({ supported: false });
  try {
    assert.equal(env.observers.length, 0);
    assert.equal(env.elements[0].classList.contains('reveal-visible'), false);
  } finally { env.cleanup(); }
});

test('bounds stagger delays so sequences stay short', () => {
  const env = environment({ delays: ['45', '-20', '999', 'invalid'] });
  try {
    assert.deepEqual(env.elements.map(element => element.properties.get('--reveal-delay')), ['45ms', '0ms', '600ms', '0ms']);
  } finally { env.cleanup(); }
});
