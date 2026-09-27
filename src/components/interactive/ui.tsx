import type { ComponentChildren, JSX } from 'preact';

export function ArrowIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>;
}

type ButtonProps = JSX.IntrinsicElements['button'] & {
  children: ComponentChildren;
  variant?: 'primary' | 'outline' | 'hero';
};
export function Button({ children, variant = 'primary', class: className = '', ...props }: ButtonProps) {
  return <button {...props} class={`button button-${variant} ${className}`}>{children}</button>;
}

type FieldProps = {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  type?: 'text' | 'email' | 'tel';
  autoComplete?: string;
  multiline?: boolean;
  required?: boolean;
};
export function Field({ id, name, label, placeholder, type = 'text', autoComplete, multiline, required = false }: FieldProps) {
  return <div class="flex min-w-0 flex-col gap-2">
    <label for={id} class="text-[13px] leading-4 font-medium tracking-[0.01em]">{label}</label>
    {multiline
      ? <textarea id={id} name={name} placeholder={placeholder} required={required} maxLength={5000} rows={4} class="field min-h-[120px] resize-y py-3" />
      : <input id={id} name={name} type={type} placeholder={placeholder} autoComplete={autoComplete} required={required} maxLength={type === 'tel' ? 30 : 200} class="field" />}
  </div>;
}
