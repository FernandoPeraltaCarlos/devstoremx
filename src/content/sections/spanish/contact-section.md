---
enable: true
badge: "contacto"
title: "¿Tienes un proyecto en mente? <br /> Contáctanos."
description: "Con esa información podemos preparar una primera respuesta y decirte qué necesitamos revisar antes de cotizar el proyecto."
image: "/images/contact-home.jpg"
imageAlt: "Contacto"
characterImage: "/images/character-3d.png"
characterImageAlt: "Personaje 3D"

form:
  submitButton:
    enable: true
    label: "Enviar mensaje"
  inputs:
    - label: "Nombre"
      placeholder: "Nombre *"
      name: "name"
      required: true
      halfWidth: true
      defaultValue: ""
    - label: "Teléfono o WhatsApp"
      placeholder: "Teléfono o WhatsApp *"
      name: "phone"
      required: true
      type: "text"
      halfWidth: true
      defaultValue: ""
    - label: "Correo electrónico"
      placeholder: "Correo electrónico *"
      name: "email"
      required: true
      type: "email"
      halfWidth: true
      defaultValue: ""
    - label: "Medio de contacto preferido"
      placeholder: "Medio de contacto preferido"
      name: "preferredContact"
      required: false
      type: "text"
      halfWidth: true
      defaultValue: ""
    - label: "Mensaje"
      tag: "textarea"
      placeholder: "Cuéntanos sobre tu proyecto *"
      name: "message"
      required: true
      halfWidth: false
      rows: "4"
      defaultValue: ""
    - label: "Búsqueda en Google"
      checked: false
      name: "source"
      required: true
      groupLabel: "¿Cómo te enteraste de nosotros?"
      group: "source"
      type: "radio"
      halfWidth: true
      defaultValue: ""
    - label: "Redes sociales"
      name: "source"
      required: true
      group: "source"
      type: "radio"
      halfWidth: true
      defaultValue: ""
    - label: "Recomendación"
      name: "source"
      required: true
      group: "source"
      type: "radio"
      halfWidth: true
      defaultValue: ""
    - label: "LinkedIn"
      name: "source"
      required: true
      group: "source"
      type: "radio"
      halfWidth: true
      defaultValue: ""
    - label: "Google Maps"
      name: "source"
      required: true
      group: "source"
      type: "radio"
      halfWidth: true
      defaultValue: ""
    - note: success
      parentClass: "hidden text-sm message success"
      content: "¡Recibimos tu mensaje! Te responderemos lo antes posible."
    - note: deprecated
      parentClass: "hidden text-sm message error"
      content: "Algo salió mal. Inténtalo de nuevo."
---
