import { useState } from 'preact/hooks';

type Props = { src?: string; poster?: string; };
export default function VideoPlayer({ src, poster }: Props) {
  const [playing, setPlaying] = useState(false);
  const [message, setMessage] = useState('');
  const play = () => {
    if (src) { setPlaying(true); setMessage(''); }
    else setMessage('El video estará disponible próximamente. Mientras tanto, conoce nuestro proceso en la sección anterior.');
  };
  return <div class="relative">
    <div class="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-[10px] border border-line-dark bg-panel">
      {playing && src
        ? <video class="h-full w-full" controls autoPlay playsInline poster={poster || undefined} onError={() => { setPlaying(false); setMessage('No se pudo cargar el video. Intenta de nuevo más tarde.'); }}><source src={src} /><track kind="captions" />Tu navegador no admite este video.</video>
        : <>
          {poster ? <img src={poster} alt="Vista previa del video del equipo" loading="lazy" class="absolute inset-0 h-full w-full object-cover" /> : <div aria-hidden="true" class="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#1f2a3d 1px, transparent 1px), linear-gradient(90deg, #1f2a3d 1px, transparent 1px)', backgroundSize: '25% 25%' }} />}
          <button type="button" onClick={play} aria-label="Reproducir video" class="relative flex h-16 w-16 items-center justify-center rounded-full bg-periwinkle text-night transition duration-150 ease-out hover:bg-[#9ab0ff] sm:h-24 sm:w-24">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m8 4 13 8-13 8z" /></svg>
          </button>
        </>}
    </div>
    <p role="status" aria-live="polite" class={message ? 'mt-4 text-center text-sm leading-6 text-muted-dark' : 'sr-only'}>{message}</p>
  </div>;
}
