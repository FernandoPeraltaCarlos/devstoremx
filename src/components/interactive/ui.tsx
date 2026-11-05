import type { ComponentChildren, JSX } from 'preact';
import { useState } from 'preact/hooks';

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

/** Use native constraints, with messages shared by submit, blur and input. */
export function validateField(field: HTMLInputElement | HTMLTextAreaElement): string {
  field.setCustomValidity('');
  let message = '';
  if (field.required && !field.value.trim()) message = 'Completa este campo.';
  else if (field.validity.typeMismatch) message = 'Escribe un correo válido, por ejemplo: tu@empresa.com.';
  else if (field.maxLength > 0 && field.value.length > field.maxLength) message = `Usa como máximo ${field.maxLength} caracteres.`;
  else if (!field.validity.valid) message = 'Revisa el valor de este campo.';
  field.setCustomValidity(message);
  return message;
}

export function Field({ id, name, label, placeholder, type = 'text', autoComplete, multiline, required = false }: FieldProps) {
  const [error, setError] = useState('');
  const events: Pick<JSX.HTMLAttributes<HTMLInputElement | HTMLTextAreaElement>, 'onInvalid' | 'onBlur' | 'onInput'> = {
    onInvalid: (event) => {
      event.preventDefault();
      setError(validateField(event.currentTarget));
    },
    onBlur: (event) => setError(validateField(event.currentTarget)),
    onInput: (event) => {
      const message = validateField(event.currentTarget);
      if (error) setError(message);
    },
  };
  return <div class="flex min-w-0 flex-col gap-2">
    <label for={id} class="text-[0.8125rem] leading-4 font-medium tracking-[0.01em]">{label}{!required && <span class="font-normal text-muted"> (opcional)</span>}</label>
    {multiline
      ? <textarea {...events} id={id} name={name} placeholder={placeholder} required={required} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-error` : undefined} maxLength={5000} rows={4} class="field min-h-[120px] resize-y py-3" />
      : <input {...events} id={id} name={name} type={type} placeholder={placeholder} autoComplete={autoComplete} required={required} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-error` : undefined} maxLength={type === 'tel' ? 30 : 200} class="field" />}
    {error && <p id={`${id}-error`} role="alert" class="text-sm leading-5 text-danger">{error}</p>}
  </div>;
}
