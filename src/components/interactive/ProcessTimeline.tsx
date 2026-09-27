import { useEffect, useRef, useState } from 'preact/hooks';
import ProcessStep from './ProcessStep';
import { getRowProgress, getStepFromProgress, getTrackProgress, getVerticalProcessStep, getVerticalProgress } from '../../lib/process-progress';

type Step = { number: string; title: string; description: string; };
type Props = { steps: readonly Step[]; };

// Keep in sync with the `.process-track` media query in global.css.
const PINNED_QUERY = '(min-width: 1024px) and (min-height: 780px)';

export default function ProcessTimeline({ steps }: Props) {
  const timeline = useRef<HTMLOListElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const element = timeline.current;
    const bar = fill.current;
    if (!element || !bar) return;
    const items = Array.from(element.querySelectorAll<HTMLElement>('[data-process-step]'));
    const track = element.closest<HTMLElement>('[data-process-track]');
    const pin = track?.querySelector<HTMLElement>('[data-process-pin]');
    const pinned = window.matchMedia(PINNED_QUERY);
    let frame = 0;

    const update = () => {
      frame = 0;
      const viewportHeight = window.innerHeight;
      const top = element.getBoundingClientRect().top;
      let progress: number;
      let next: number;

      if (window.innerWidth >= 1024) {
        const rect = track?.getBoundingClientRect();
        if (pinned.matches && rect && pin) {
          // Centre the pinned block; its height changes with the layout, so CSS alone cannot.
          const pinTop = Math.max(16, (viewportHeight - pin.offsetHeight) / 2);
          pin.style.top = `${pinTop}px`;
          progress = getTrackProgress(rect.top, rect.height, pinTop, pin.offsetHeight);
        } else {
          pin?.style.removeProperty('top');
          progress = getRowProgress(top, viewportHeight);
        }
        next = getStepFromProgress(progress, steps.length);
        // Reach the active number's box and keep growing towards the next one.
        bar.style.removeProperty('height');
        bar.style.transform = `scaleX(${progress})`;
      } else {
        // Layout offsets ignore the entrance animations' temporary translations.
        const tops = items.map(item => top + item.offsetTop);
        progress = getVerticalProgress(tops, viewportHeight);
        next = getVerticalProcessStep(tops, viewportHeight);
        const span = items.length > 1 ? items[items.length - 1].offsetTop - items[0].offsetTop : 0;
        bar.style.height = `${span}px`;
        bar.style.transform = `scaleY(${progress})`;
      }
      // Lets the section's CSS react to the stage, e.g. revealing "Durante el desarrollo".
      if (track) track.dataset.step = String(next);
      setActive(current => current === next ? current : next);
    };

    // Coalesce scroll/resize events into one calculation per rendering frame.
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    pinned.addEventListener('change', schedule);
    const resizeObserver = 'ResizeObserver' in window ? new ResizeObserver(schedule) : undefined;
    resizeObserver?.observe(element);
    schedule();

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      pinned.removeEventListener('change', schedule);
      resizeObserver?.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [steps]);

  // Line, fill and steps reveal as one block so the line never shows through half-faded numbers.
  return <div data-reveal="blur" data-reveal-delay="150" class="relative mt-10 lg:mt-16">
    <ol ref={timeline} aria-label="Etapas del desarrollo" class="relative grid gap-8 before:absolute before:top-0 before:bottom-0 before:left-6 before:w-px before:bg-line-dark lg:grid-cols-5 lg:before:top-6 lg:before:right-0 lg:before:bottom-auto lg:before:left-0 lg:before:h-px lg:before:w-auto">
      {steps.map((step, i) => <ProcessStep key={step.number} {...step} active={i === active} done={i < active} />)}
    </ol>
    <span ref={fill} aria-hidden="true" style={{ transform: 'scale(0)' }} class="pointer-events-none absolute top-6 left-[23px] w-[3px] origin-top rounded-full bg-gradient-to-b from-electric to-sky lg:top-[23px] lg:right-0 lg:left-0 lg:h-[3px] lg:w-auto lg:origin-left lg:bg-gradient-to-r" />
  </div>;
}
