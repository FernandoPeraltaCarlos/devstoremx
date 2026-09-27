const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));

/** Map continuous progress (0–1) onto the index of the stage being worked on. */
export function getStepFromProgress(progress: number, count: number): number {
  if (count <= 1) return 0;
  return Math.max(0, Math.min(count - 1, Math.floor(clamp(progress) * count)));
}

/** Pinned timeline: progress follows the distance scrolled while the sticky block is stuck. */
export function getTrackProgress(trackTop: number, trackHeight: number, pinTop: number, pinHeight: number): number {
  const runway = trackHeight - pinHeight;
  const scrolled = pinTop - trackTop;
  if (runway <= 0) return scrolled >= 0 ? 1 : 0;
  return clamp(scrolled / runway);
}

/** Unpinned horizontal row: progress follows its passage through the viewport. */
export function getRowProgress(top: number, viewportHeight: number): number {
  if (viewportHeight <= 0) return 0;
  return clamp((viewportHeight * 0.78 - top) / (viewportHeight * 0.56));
}

export function getHorizontalProcessStep(top: number, viewportHeight: number, count: number): number {
  if (viewportHeight <= 0) return 0;
  return getStepFromProgress(getRowProgress(top, viewportHeight), count);
}

/** On mobile, activate each step when its number reaches the reading area. */
export function getVerticalProcessStep(tops: readonly number[], viewportHeight: number): number {
  const readingLine = viewportHeight * 0.45;
  let active = 0;
  tops.forEach((top, index) => {
    if (top + 24 <= readingLine) active = index;
  });
  return active;
}

/** Vertical fill: how far the reading line has travelled from the first to the last number. */
export function getVerticalProgress(tops: readonly number[], viewportHeight: number): number {
  if (tops.length < 2) return tops.length && tops[0] + 24 <= viewportHeight * 0.45 ? 1 : 0;
  const readingLine = viewportHeight * 0.45;
  const first = tops[0] + 24;
  const last = tops[tops.length - 1] + 24;
  return clamp((readingLine - first) / (last - first));
}
