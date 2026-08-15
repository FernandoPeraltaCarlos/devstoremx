import { useEffect, useId, useRef, useState } from "react";
import type { InvalidEvent, SyntheticEvent } from "react";
import type { z } from "astro/zod";
import { ArrowUpRight, type IconNode } from "lucide";
import type { contactFormSchema, inputFieldSchema } from "@/sections.schema";
import { markdownify, toLowerCase } from "@/lib/utils/textConverter";

type FormType = z.infer<typeof contactFormSchema>;
type InputField = z.infer<typeof inputFieldSchema>;
type InputItem = NonNullable<InputField["items"]>[number];
type DropdownItem = NonNullable<
  NonNullable<InputField["dropdown"]>["items"]
>[number];

type GroupedField = {
  group: string;
  groupLabel?: string;
  items: InputField[];
};

type VisibleField = InputField | GroupedField;

type Props = {
  form: FormType;
  locale?: string;
  className?: string;
};

type FormStatus = "idle" | "pending" | "success" | "error";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTACT_ENDPOINT = "/api/contact/";
const CONTACT_EMAIL = "hola@devstoremx.xyz";
const HONEYPOT_FIELD = "website";

const fieldLimits: Record<string, number> = {
  name: 200,
  phone: 50,
  email: 254,
  preferredContact: 200,
  message: 5000,
};

const pendingCopy = {
  es: "Enviando tu mensaje...",
  en: "Submitting your message...",
};

const fallbackErrorCopy = {
  es: `No pudimos enviar tu mensaje. Escríbenos a [${CONTACT_EMAIL}](mailto:${CONTACT_EMAIL}).`,
  en: `We couldn't send your message. Please email [${CONTACT_EMAIL}](mailto:${CONTACT_EMAIL}) instead.`,
};

const fieldErrorCopy = {
  es: {
    required: "Revisa este campo.",
    email: "Escribe un correo electrónico válido.",
  },
  en: {
    required: "Check this field.",
    email: "Enter a valid email address.",
  },
};

const isGroupedField = (input: VisibleField): input is GroupedField =>
  "group" in input &&
  Array.isArray((input as GroupedField).items) &&
  !("type" in input) &&
  !("note" in input && input.note);

const genIdFromLabel = (label: string) =>
  toLowerCase(label).replace(/\s+/g, "-");

const getFieldName = (input: InputField | GroupedField) => {
  if (isGroupedField(input)) {
    return input.items[0]?.name || input.group || "contact-field";
  }

  return input.items?.[0]?.name || input.name || input.label || "contact-field";
};

const withRequiredMark = (value: string | undefined, required?: boolean) => {
  const content = value || "";

  if (!required || content.includes("*")) {
    return content;
  }

  return `${content} *`;
};

const combineRadio = (list: InputField[]) => {
  const groups = new Map<string, GroupedField>();
  const result: VisibleField[] = [];

  for (const item of list) {
    if (!item.group) {
      result.push(item);
      continue;
    }

    const existing = groups.get(item.group);
    if (existing) {
      existing.items.push(item);
      continue;
    }

    const group = {
      group: item.group,
      groupLabel: item.groupLabel || "",
      items: [item],
    };
    groups.set(item.group, group);
    result.push(group);
  }

  return result;
};

const getInitialFilledFields = (inputs: VisibleField[]) => {
  const filled: Record<string, boolean> = {};

  for (const input of inputs) {
    if (isGroupedField(input)) {
      filled[getFieldName(input)] = input.items.some((item) => item.checked);
      continue;
    }
    if (input.note) continue;

    const name = getFieldName(input);
    filled[name] = Boolean(
      input.defaultValue ||
      input.checked ||
      input.dropdown?.items.some((option) => option.selected),
    );
  }

  return filled;
};

const toHtml = (content: string, container = false) => {
  const html = markdownify(content, container);
  return typeof html === "string" ? html : content;
};

const LucideIcon = ({
  icon,
  className,
}: {
  icon: IconNode;
  className?: string;
}) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    {icon.map(([tag, attrs], index) => {
      const Tag = tag as "path" | "polyline" | "line" | "circle" | "rect";
      return <Tag key={index} {...attrs} />;
    })}
  </svg>
);

const SubmitButton = ({
  label,
  disabled,
}: {
  label: string;
  disabled: boolean;
}) => (
  <button
    type="submit"
    id="contact-submit"
    disabled={disabled}
    className="btn-wrapper btn btn-primary creative-hover-anim has-icon has-icon-moving-animation contact-submit-btn mt-0 px-8 py-4!"
  >
    <span className="hover-bg" aria-hidden="true" />
    <span className="icons-wrapper -mb-px inline-flex min-h-4 min-w-4 items-center justify-center">
      <span className="icon icon-before flex items-center justify-center">
        <LucideIcon className="[font-size:inherit]" icon={ArrowUpRight} />
      </span>
      <span className="icon icon-after flex items-center justify-center">
        <LucideIcon className="[font-size:inherit]" icon={ArrowUpRight} />
      </span>
    </span>
    <span>{label}</span>
  </button>
);

export default function ContactForm({ form, locale = "es", className }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const instanceId = useId().replaceAll(":", "");
  const normalizedLocale = locale === "en" ? "en" : "es";
  const preparedInputs = combineRadio(form.inputs);
  const initialFilledFields = getInitialFilledFields(preparedInputs);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [filledFields, setFilledFields] =
    useState<Record<string, boolean>>(initialFilledFields);
  const [errorFields, setErrorFields] = useState<Record<string, boolean>>({});
  const [errorMessage, setErrorMessage] = useState("");
  const messageInputs = preparedInputs.filter(
    (input): input is InputField =>
      !isGroupedField(input) && Boolean(input.note),
  );
  const visibleInputs = preparedInputs.filter(
    (input) => isGroupedField(input) || !input.note,
  );

  const successMessage =
    messageInputs.find((input) => input.note === "success")?.content ||
    (normalizedLocale === "es"
      ? "Recibimos tu mensaje. Te responderemos lo antes posible."
      : "We have received your message. We'll get back to you as soon as possible.");
  const defaultErrorMessage =
    messageInputs.find((input) => input.note === "deprecated")?.content ||
    (normalizedLocale === "es"
      ? "Algo salió mal. Inténtalo de nuevo."
      : "Something went wrong. Please try again.");
  const pendingMessage = pendingCopy[normalizedLocale];
  const validationCopy = fieldErrorCopy[normalizedLocale];

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const formElement = formRef.current;
      if (!formElement) return;

      const nextFilled = { ...initialFilledFields };
      formElement
        .querySelectorAll<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >("input[name], textarea[name], select[name]")
        .forEach((element) => {
          if (!element.name || element.name === HONEYPOT_FIELD) return;
          if (element.type === "radio" || element.type === "checkbox") {
            nextFilled[element.name] = Boolean(
              formElement.querySelector(
                `[name="${CSS.escape(element.name)}"]:checked`,
              ),
            );
          } else {
            nextFilled[element.name] = Boolean(element.value.trim());
          }
        });
      setFilledFields(nextFilled);
    }, 0);

    return () => window.clearTimeout(timeout);
    // Inputs are static content for the lifetime of this island.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markFilled = (name: string, filled: boolean) => {
    setFilledFields((current) => ({ ...current, [name]: filled }));
    if (filled) {
      setErrorFields((current) => ({ ...current, [name]: false }));
    }
    if (status === "success" || status === "error") setStatus("idle");
  };

  const syncField = (
    element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  ) => {
    const name = element.name;
    if (!name || name === HONEYPOT_FIELD) return;

    if (element instanceof HTMLSelectElement) {
      markFilled(name, element.value !== "");
      return;
    }

    if (element.type === "radio" || element.type === "checkbox") {
      const formElement = formRef.current;
      if (!formElement) return;
      const checked = formElement.querySelectorAll(
        `[name="${CSS.escape(name)}"]:checked`,
      );
      markFilled(name, checked.length > 0);
      return;
    }

    markFilled(name, Boolean(element.value.trim()));
  };

  const validateForm = (formElement: HTMLFormElement) => {
    const formData = new FormData(formElement);
    const handledGroups = new Set<string>();
    let hasError = false;
    const nextErrors: Record<string, boolean> = {};

    formElement
      .querySelectorAll<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >("[required]")
      .forEach((element) => {
        const name = element.name;
        if (!name || name === HONEYPOT_FIELD) return;

        if (element.type === "radio" || element.type === "checkbox") {
          if (handledGroups.has(name)) return;
          handledGroups.add(name);

          const group = formElement.querySelectorAll(
            `[name="${CSS.escape(name)}"]:checked`,
          );
          if (group.length === 0) {
            nextErrors[name] = true;
            hasError = true;
          }
          return;
        }

        const value = formData.get(name);
        if (!value || (typeof value === "string" && !value.trim())) {
          nextErrors[name] = true;
          hasError = true;
          return;
        }

        if (
          element instanceof HTMLInputElement &&
          element.type === "email" &&
          typeof value === "string" &&
          !EMAIL_PATTERN.test(value)
        ) {
          nextErrors[name] = true;
          hasError = true;
        }
      });

    formElement
      .querySelectorAll<HTMLElement>("[data-required-group]")
      .forEach((group) => {
        const name = group.dataset.requiredGroup;
        if (!name || handledGroups.has(name)) return;
        handledGroups.add(name);

        if (!group.querySelector(`[name="${CSS.escape(name)}"]:checked`)) {
          nextErrors[name] = true;
          hasError = true;
        }
      });

    setErrorFields(nextErrors);
    const firstInvalidName = Object.keys(nextErrors)[0];
    if (firstInvalidName) {
      requestAnimationFrame(() => {
        formElement
          .querySelector<HTMLElement>(
            `[name="${CSS.escape(firstInvalidName)}"]`,
          )
          ?.focus();
      });
    }
    return !hasError;
  };

  const handleInvalid = (event: InvalidEvent<HTMLFormElement>) => {
    const element = event.target as HTMLInputElement | HTMLTextAreaElement;
    if (!element.name || element.name === HONEYPOT_FIELD) return;
    setErrorFields((current) => ({ ...current, [element.name]: true }));
  };

  const handleSubmit = async (
    event: SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) => {
    event.preventDefault();
    const formElement = event.currentTarget;

    if (!validateForm(formElement) || status === "pending") return;

    setStatus("pending");
    setErrorMessage("");
    let timeoutId: number | undefined;

    try {
      const formData = new FormData(formElement);
      const submissionId = globalThis.crypto?.randomUUID?.();
      const payload = {
        name: String(formData.get("name") || ""),
        phone: String(formData.get("phone") || ""),
        email: String(formData.get("email") || ""),
        preferredContact: String(formData.get("preferredContact") || ""),
        message: String(formData.get("message") || ""),
        source: String(formData.get("source") || ""),
        locale: normalizedLocale,
        ...(submissionId ? { submissionId } : {}),
        [HONEYPOT_FIELD]: String(formData.get(HONEYPOT_FIELD) || ""),
      };
      const controller = new AbortController();
      timeoutId = window.setTimeout(() => controller.abort(), 15000);
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
      };

      if (!response.ok || result.ok !== true) {
        throw new Error("submit-failed");
      }

      formElement.reset();
      setFilledFields(initialFilledFields);
      setErrorFields({});
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage(fallbackErrorCopy[normalizedLocale]);
    } finally {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    }
  };

  const fieldClassName = (name: string, input: InputField | GroupedField) => {
    const halfWidth = isGroupedField(input) ? false : Boolean(input.halfWidth);
    const parentClass = isGroupedField(input) ? "" : input.parentClass;

    return [
      "contact-form-field",
      halfWidth ? "contact-form-field--half" : "contact-form-field--full",
      parentClass,
      filledFields[name] ? "is-filled" : "",
      errorFields[name] ? "is-error" : "",
    ]
      .filter(Boolean)
      .join(" ");
  };

  const controlId = (name: string) =>
    `contact-${instanceId}-${genIdFromLabel(name)}`;
  const errorId = (name: string) => `${controlId(name)}-error`;
  const renderFieldError = (name: string, isEmail = false) =>
    errorFields[name] ? (
      <span
        id={errorId(name)}
        className="mt-2 block text-sm text-red-200"
        role="alert"
      >
        {isEmail ? validationCopy.email : validationCopy.required}
      </span>
    ) : null;

  return (
    <form
      ref={formRef}
      id="contact-form"
      action={CONTACT_ENDPOINT}
      method="post"
      className={["contact-form", className].filter(Boolean).join(" ")}
      onSubmit={handleSubmit}
      onInvalid={handleInvalid}
      aria-busy={status === "pending"}
    >
      <input type="hidden" name="locale" value={normalizedLocale} />
      <div className="sr-only" aria-hidden="true">
        <label htmlFor={`contact-${instanceId}-website`}>Website</label>
        <input
          id={`contact-${instanceId}-website`}
          type="text"
          name={HONEYPOT_FIELD}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
      </div>

      {visibleInputs.map((input) => {
        const fieldName = getFieldName(input);

        if (isGroupedField(input) || input.items) {
          const items = isGroupedField(input)
            ? input.items
            : (input.items as InputItem[]);
          const groupLabel = isGroupedField(input)
            ? input.groupLabel
            : input.groupLabel;
          const groupRequired = items?.some((item) => item.required) ?? false;

          return (
            <fieldset
              key={fieldName}
              className={`${fieldClassName(fieldName, input)} min-w-0 border-0 p-0`}
              data-field-name={fieldName}
              data-required-group={groupRequired ? fieldName : undefined}
              aria-invalid={errorFields[fieldName] || undefined}
              aria-describedby={
                errorFields[fieldName] ? errorId(fieldName) : undefined
              }
            >
              {groupLabel && (
                <legend className="contact-form-field-label">
                  {withRequiredMark(groupLabel, groupRequired)}
                </legend>
              )}
              <div className="contact-form-choice-group">
                {items?.map((item) => {
                  const itemId = `${instanceId}-${
                    ("id" in item && item.id) ||
                    genIdFromLabel(item.label || "example-id")
                  }`;
                  const itemName = ("name" in item && item.name) || fieldName;
                  const itemType = ("type" in item && item.type) || "radio";
                  const itemValue =
                    typeof item.value === "boolean"
                      ? String(item.value)
                      : item.value || item.label;

                  return (
                    <div className="contact-form-choice-item" key={itemId}>
                      <input
                        id={itemId}
                        type={itemType}
                        name={itemName}
                        value={itemValue}
                        required={itemType === "radio" && groupRequired}
                        defaultChecked={Boolean(item.checked)}
                        className={[
                          "contact-form-choice-input",
                          itemType === "radio"
                            ? "contact-form-choice-input--radio"
                            : "contact-form-choice-input--checkbox",
                        ].join(" ")}
                        onChange={(event) => syncField(event.currentTarget)}
                      />
                      <label
                        htmlFor={itemId}
                        className="contact-form-choice-label"
                        dangerouslySetInnerHTML={{
                          __html: toHtml(item.label || "Example Label"),
                        }}
                      />
                    </div>
                  );
                })}
              </div>
              {renderFieldError(fieldName)}
            </fieldset>
          );
        }

        if (input.dropdown) {
          const id = input.id || controlId(fieldName);
          const selectedValue =
            input.dropdown.items.find((option) => option.selected)?.value ||
            input.defaultValue ||
            "";
          const label = input.label || input.placeholder || fieldName;

          return (
            <div
              key={fieldName}
              className={fieldClassName(fieldName, input)}
              data-field-name={fieldName}
            >
              <label className="sr-only" htmlFor={id}>
                {withRequiredMark(label, input.required)}
              </label>
              <div className="contact-form-control-shell">
                {input.dropdown.type === "search" ? (
                  <>
                    <input
                      id={id}
                      list={`${id}-options`}
                      name={fieldName}
                      required={Boolean(input.required)}
                      defaultValue={selectedValue}
                      placeholder={withRequiredMark(
                        input.dropdown.search?.placeholder ||
                          input.placeholder ||
                          "Search",
                        input.required,
                      )}
                      className="contact-form-control"
                      aria-invalid={errorFields[fieldName] || undefined}
                      aria-describedby={
                        errorFields[fieldName] ? errorId(fieldName) : undefined
                      }
                      onChange={(event) => syncField(event.currentTarget)}
                    />
                    <datalist id={`${id}-options`}>
                      {input.dropdown.items.map((option: DropdownItem) => (
                        <option
                          key={`${option.value}-${option.label}`}
                          value={option.value}
                          label={option.label}
                        />
                      ))}
                    </datalist>
                  </>
                ) : (
                  <select
                    id={id}
                    name={fieldName}
                    required={Boolean(input.required)}
                    defaultValue={selectedValue}
                    className="contact-form-control"
                    aria-invalid={errorFields[fieldName] || undefined}
                    aria-describedby={
                      errorFields[fieldName] ? errorId(fieldName) : undefined
                    }
                    onChange={(event) => syncField(event.currentTarget)}
                  >
                    <option value="">
                      {withRequiredMark(
                        input.placeholder || "Select an option",
                        input.required,
                      )}
                    </option>
                    {input.dropdown.items.map((option: DropdownItem) => (
                      <option
                        key={`${option.value}-${option.label}`}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              {renderFieldError(fieldName)}
            </div>
          );
        }

        if (input.tag === "textarea") {
          const id = input.id || controlId(fieldName);
          return (
            <div
              key={fieldName}
              className={fieldClassName(fieldName, input)}
              data-field-name={fieldName}
            >
              <label className="sr-only" htmlFor={id}>
                {withRequiredMark(
                  input.label || input.placeholder || fieldName,
                  input.required,
                )}
              </label>
              <div className="contact-form-control-shell">
                <textarea
                  id={id}
                  name={fieldName}
                  rows={Number(input.rows || "4")}
                  required={Boolean(input.required)}
                  maxLength={fieldLimits[fieldName]}
                  defaultValue={input.defaultValue || ""}
                  placeholder={withRequiredMark(
                    input.placeholder || "Please set placeholder",
                    input.required,
                  )}
                  className="contact-form-control contact-form-control--textarea"
                  aria-invalid={errorFields[fieldName] || undefined}
                  aria-describedby={
                    errorFields[fieldName] ? errorId(fieldName) : undefined
                  }
                  onChange={(event) => syncField(event.currentTarget)}
                />
              </div>
              {renderFieldError(fieldName)}
            </div>
          );
        }

        if (input.type === "checkbox" || input.type === "radio") {
          const itemId = `${instanceId}-${
            input.id || genIdFromLabel(input.label || "example-id")
          }`;
          const itemValue =
            typeof input.value === "boolean"
              ? String(input.value)
              : input.value || input.label;

          return (
            <div
              key={fieldName}
              className={fieldClassName(fieldName, input)}
              data-field-name={fieldName}
            >
              <div className="contact-form-choice-group">
                <div className="contact-form-choice-item">
                  <input
                    id={itemId}
                    type={input.type}
                    name={input.name || fieldName}
                    value={itemValue}
                    required={Boolean(input.required)}
                    defaultChecked={Boolean(input.checked)}
                    aria-invalid={errorFields[fieldName] || undefined}
                    aria-describedby={
                      errorFields[fieldName] ? errorId(fieldName) : undefined
                    }
                    className={[
                      "contact-form-choice-input",
                      input.type === "radio"
                        ? "contact-form-choice-input--radio"
                        : "contact-form-choice-input--checkbox",
                    ].join(" ")}
                    onChange={(event) => syncField(event.currentTarget)}
                  />
                  <label htmlFor={itemId} className="contact-form-choice-label">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: toHtml(input.label || "Example Label"),
                      }}
                    />
                  </label>
                </div>
              </div>
              {renderFieldError(fieldName)}
            </div>
          );
        }

        const id = input.id || controlId(fieldName);
        return (
          <div
            key={fieldName}
            className={fieldClassName(fieldName, input)}
            data-field-name={fieldName}
          >
            <label className="sr-only" htmlFor={id}>
              {withRequiredMark(
                input.label || input.placeholder || fieldName,
                input.required,
              )}
            </label>
            <div className="contact-form-control-shell">
              <input
                id={id}
                type={input.type || "text"}
                name={fieldName}
                autoComplete={
                  fieldName === "name"
                    ? "name"
                    : fieldName === "email"
                      ? "email"
                      : fieldName === "phone"
                        ? "tel"
                        : "on"
                }
                required={Boolean(input.required)}
                maxLength={fieldLimits[fieldName]}
                defaultValue={input.defaultValue || ""}
                placeholder={withRequiredMark(
                  input.placeholder || "Please set placeholder",
                  input.required,
                )}
                className="contact-form-control"
                aria-invalid={errorFields[fieldName] || undefined}
                aria-describedby={
                  errorFields[fieldName] ? errorId(fieldName) : undefined
                }
                onChange={(event) => syncField(event.currentTarget)}
              />
            </div>
            {renderFieldError(fieldName, input.type === "email")}
          </div>
        );
      })}

      {form.submitButton?.enable !== false && (
        <div className="contact-form-submit">
          <SubmitButton
            label={form.submitButton.label ?? "Send a Message"}
            disabled={status === "pending"}
          />
        </div>
      )}

      <div
        className={`contact-form-message contact-form-message--pending message pending${status === "pending" ? "" : "hidden"}`}
        hidden={status !== "pending"}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex size-2.5 shrink-0 animate-pulse rounded-full bg-white" />
          <div className="contact-form-message-content">{pendingMessage}</div>
        </div>
      </div>

      <div
        className={`contact-form-message contact-form-message--success message success${status === "success" ? "" : "hidden"}`}
        hidden={status !== "success"}
        role="status"
        aria-live="polite"
      >
        <div
          className="contact-form-message-content"
          dangerouslySetInnerHTML={{ __html: toHtml(successMessage, true) }}
        />
      </div>

      <div
        className={`contact-form-message contact-form-message--error message error${status === "error" ? "" : "hidden"}`}
        hidden={status !== "error"}
        role="alert"
        aria-live="assertive"
      >
        <div
          className="contact-form-message-content"
          dangerouslySetInnerHTML={{
            __html: toHtml(errorMessage || defaultErrorMessage, true),
          }}
        />
      </div>

      {form.note && (
        <div
          className="contact-form-note"
          dangerouslySetInnerHTML={{ __html: toHtml(form.note, true) }}
        />
      )}
    </form>
  );
}
