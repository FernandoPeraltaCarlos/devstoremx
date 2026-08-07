---
enable: true
badge: "contacto"
title: "Cuéntanos qué necesitas <br /> y qué tienes hoy."
description: "Con esa información podemos preparar una primera respuesta y decirte qué necesitamos revisar antes de cotizar el proyecto."
image: "/images/contact-home.jpg"
imageAlt: "Contacto"
characterImage: "/images/character-3d.png"
characterImageAlt: "Personaje 3D"

form:
  emailSubject: "Nuevo mensaje del formulario de contacto"
  submitButton:
    enable: true
    label: "Enviar mensaje"
  inputs:
    - label: "Nombre"
      placeholder: "Nombre *"
      name: "Nombre"
      required: true
      halfWidth: true
      defaultValue: ""
    - label: "Teléfono o WhatsApp"
      placeholder: "Teléfono o WhatsApp *"
      name: "Teléfono o WhatsApp"
      required: true
      type: "text"
      halfWidth: true
      defaultValue: ""
    - label: "Correo electrónico"
      placeholder: "Correo electrónico *"
      name: "Correo electrónico"
      required: true
      type: "email"
      halfWidth: true
      defaultValue: ""
    - label: "Medio de contacto preferido"
      placeholder: "Medio de contacto preferido"
      name: "Medio de contacto preferido"
      required: false
      type: "text"
      halfWidth: true
      defaultValue: ""
    - label: "Mensaje"
      tag: "textarea"
      placeholder: "Cuéntanos sobre tu proyecto *"
      name: "Mensaje"
      required: true
      halfWidth: false
      rows: "4"
      defaultValue: ""
    - label: "Búsqueda en Google"
      checked: false
      name: "Cómo nos conoció"
      required: true
      groupLabel: "¿Cómo te enteraste de nosotros?"
      group: "source"
      type: "radio"
      halfWidth: true
      defaultValue: ""
    - label: "Redes sociales"
      name: "Cómo nos conoció"
      required: true
      group: "source"
      type: "radio"
      halfWidth: true
      defaultValue: ""
    - label: "Recomendación"
      name: "Cómo nos conoció"
      required: true
      group: "source"
      type: "radio"
      halfWidth: true
      defaultValue: ""
    - label: "LinkedIn"
      name: "Cómo nos conoció"
      required: true
      group: "source"
      type: "radio"
      halfWidth: true
      defaultValue: ""
    - label: "Google Maps"
      name: "Cómo nos conoció"
      required: true
      group: "source"
      type: "radio"
      halfWidth: true
      defaultValue: ""
    - label: "He leído el [Aviso de privacidad](/privacy/)"
      name: "Aviso de privacidad"
      value: "Aceptado"
      checked: false
      required: true
      type: "checkbox"
      halfWidth: false
      defaultValue: ""
    - note: success
      parentClass: "hidden text-sm message success"
      content: "¡Recibimos tu mensaje! Te responderemos lo antes posible."
    - note: deprecated
      parentClass: "hidden text-sm message error"
      content: "Algo salió mal. Inténtalo de nuevo."
---
