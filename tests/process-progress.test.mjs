import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getHorizontalProcessStep, getStepFromProgress, getTrackProgress, getVerticalProcessStep, getVerticalProgress } from '../src/lib/process-progress.ts';

test('desktop activates all five steps as the row crosses the viewport', () => {
  for (const height of [480, 800, 1200]) {
    const tops = Array.from({ length: 5 }, (_, index) => height * (0.78 - 0.56 * ((index + 0.5) / 5)));
    assert.deepEqual(tops.map(top => getHorizontalProcessStep(top, height, 5)), [0, 1, 2, 3, 4]);
    assert.deepEqual(tops.reverse().map(top => getHorizontalProcessStep(top, height, 5)), [4, 3, 2, 1, 0]);
  }
});

test('desktop holds the first and final stages before and after the timeline', () => {
  assert.equal(getHorizontalProcessStep(2000, 800, 5), 0);
  assert.equal(getHorizontalProcessStep(-2000, 800, 5), 4);
  assert.equal(getHorizontalProcessStep(0, 0, 5), 0);
  assert.equal(getHorizontalProcessStep(0, 800, 1), 0);
});

test('mobile follows the actual step positions in both scroll directions', () => {
  const positions = [0, 180, 420, 580, 900];
  const topForStep = index => 800 * 0.45 - positions[index] - 24;
  const stageAt = top => getVerticalProcessStep(positions.map(position => position + top), 800);
  assert.deepEqual(positions.map((_, i) => stageAt(topForStep(i))), [0, 1, 2, 3, 4]);
  assert.deepEqual([4, 3, 2, 1, 0].map(i => stageAt(topForStep(i))), [4, 3, 2, 1, 0]);
});

test('mobile waits for the next number to reach the reading line', () => {
  assert.equal(getVerticalProcessStep([100, 337, 580, 760, 900], 800), 0);
  assert.equal(getVerticalProcessStep([99, 336, 579, 759, 899], 800), 1);
  assert.equal(getVerticalProcessStep([900, 1080, 1260, 1440, 1620], 800), 0);
  assert.equal(getVerticalProcessStep([-1500, -1320, -1140, -960, -780], 800), 4);
});

test('pinned track spreads the stages over the distance scrolled while stuck', () => {
  const pinTop = 200, pinHeight = 500, runway = 1260, height = pinHeight + runway;
  assert.equal(getTrackProgress(600, height, pinTop, pinHeight), 0);
  assert.equal(getTrackProgress(pinTop, height, pinTop, pinHeight), 0);
  assert.equal(getTrackProgress(pinTop - runway / 2, height, pinTop, pinHeight), 0.5);
  assert.equal(getTrackProgress(pinTop - runway - 50, height, pinTop, pinHeight), 1);
  assert.deepEqual([0.1, 0.3, 0.5, 0.7, 0.9].map(f => getStepFromProgress(getTrackProgress(pinTop - runway * f, height, pinTop, pinHeight), 5)), [0, 1, 2, 3, 4]);
  // Without a runway the block cannot stay stuck, so it is either before or past.
  assert.equal(getTrackProgress(210, pinHeight, pinTop, pinHeight), 0);
  assert.equal(getTrackProgress(190, pinHeight, pinTop, pinHeight), 1);
});

test('step index stays within bounds at the ends of the progress', () => {
  assert.equal(getStepFromProgress(0, 5), 0);
  assert.equal(getStepFromProgress(1, 5), 4);
  assert.equal(getStepFromProgress(-1, 5), 0);
  assert.equal(getStepFromProgress(0.5, 1), 0);
});

test('mobile fill runs from the first to the last number', () => {
  const tops = [100, 300, 500];
  const at = shift => getVerticalProgress(tops.map(top => top + shift), 800);
  assert.equal(at(800 * 0.45 - 124), 0);
  assert.equal(at(800 * 0.45 - 324), 0.5);
  assert.equal(at(800 * 0.45 - 524), 1);
  assert.equal(at(-2000), 1);
  assert.equal(at(2000), 0);
});
