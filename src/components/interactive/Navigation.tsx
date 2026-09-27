import { useEffect, useRef, useState } from 'preact/hooks';
import { navigation } from '../../data/landing';

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); }
    };
    const onOutside = (event: PointerEvent) => {
      if (!menu.current?.contains(event.target as Node) && !toggle.current?.contains(event.target as Node)) setOpen(false);
    };
    const desktop = window.matchMedia('(min-width: 1024px)');
    const onResize = () => { if (desktop.matches) setOpen(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onOutside);
    desktop.addEventListener('change', onResize);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onOutside);
      desktop.removeEventListener('change', onResize);
    };
  }, [open]);

  return <>
    <nav aria-label="Navegación principal" class="hidden items-center gap-7 lg:flex xl:gap-10">
      {navigation.map(item => <a key={item.href} href={item.href} class="text-[15px] font-medium text-cloud hover:text-periwinkle">{item.label}</a>)}
      <a href="/#contacto" class="button button-dark-outline min-h-11 px-5 text-[15px]">Escríbenos</a>
    </nav>
    <button ref={toggle} type="button" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)} class="flex h-11 w-11 items-center justify-center rounded-md border border-[#56627a] text-cloud hover:border-periwinkle lg:hidden">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
        {open ? <path d="m6 6 12 12M6 18 18 6" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
      </svg>
    </button>
    <nav ref={menu} id="mobile-menu" aria-label="Navegación móvil" hidden={!open} class={`absolute top-[88px] right-6 left-6 rounded-lg border border-line-dark bg-panel p-4 shadow-xl sm:right-10 sm:left-10 lg:hidden ${open ? 'hero-enter' : ''}`}>
      {navigation.map(item => <a key={item.href} href={item.href} onClick={() => setOpen(false)} class="block rounded-md px-4 py-3 text-base font-medium text-cloud hover:bg-night hover:text-periwinkle">{item.label}</a>)}
      <a href="/#contacto" onClick={() => setOpen(false)} class="button button-hero mt-3 w-full">Escríbenos</a>
    </nav>
  </>;
}
