type Props = {
  number: string;
  title: string;
  description: string;
  active: boolean;
  done?: boolean;
};

export default function ProcessStep({ number, title, description, active, done = false }: Props) {
  const box = active
    ? 'border-brand bg-brand text-white shadow-[0_0_0_4px_rgba(82,113,255,0.18)]'
    : done ? 'border-electric bg-night text-periwinkle' : 'border-line-strong-dark bg-night text-cloud';
  // Keep the whole step above the progress fill, which follows the list in the DOM.
  return <li data-process-step aria-current={active ? 'step' : undefined} class="relative z-10 grid grid-cols-[48px_1fr] gap-x-5 lg:flex lg:flex-col lg:gap-3.5">
    <span class={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-md border font-mono text-[0.9375rem] transition-[color,background-color,border-color,box-shadow] duration-[250ms] ease-out ${box}`}>
      {number}
    </span>
    <div class={`transition-[translate] duration-[250ms] ease-out ${active ? 'lg:-translate-y-1' : ''}`}>
      <h3 class={`mb-3.5 pt-2 text-xl leading-[1.625rem] font-semibold transition-colors duration-300 lg:pt-2.5 ${active ? 'text-periwinkle' : 'text-cloud'}`}>{title}</h3>
      <p class={`text-[0.9375rem] leading-6 transition-colors duration-300 ${active ? 'text-cloud' : 'text-muted-dark'}`}>{description}</p>
    </div>
  </li>;
}
