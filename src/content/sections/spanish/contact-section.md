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
    - label: "Nombre completo"
      placeholder: "Nombre completo *"
      name: "Nombre completo"
      required: true
      halfWidth: true
      defaultValue: ""
    - label: "Correo electrónico"
      placeholder: "Correo electrónico *"
      name: "Correo electrónico"
      required: true
      type: "email"
      halfWidth: true
      defaultValue: ""
    - label: "Teléfono"
      placeholder: "Teléfono"
      name: "Teléfono"
      required: false
      type: "text"
      halfWidth: true
      defaultValue: ""
    - label: "Empresa"
      placeholder: "Empresa"
      name: "Empresa"
      required: false
      type: "text"
      halfWidth: true
      defaultValue: ""
    - label: "Asunto"
      placeholder: "Asunto *"
      name: "Asunto"
      required: true
      halfWidth: true
      dropdown:
        type: "select"
        items:
          - label: "Páginas web"
            value: "Páginas web"
            selected: false
          - label: "Tiendas en línea con Shopify"
            value: "Tiendas en línea con Shopify"
            selected: false
          - label: "Mantenimiento web"
            value: "Mantenimiento web"
            selected: false
          - label: "Rediseño de sitios web"
            value: "Rediseño de sitios web"
            selected: false
          - label: "Plantillas de email"
            value: "Plantillas de email"
            selected: false
          - label: "Landing pages"
            value: "Landing pages"
            selected: false
          - label: "Otro"
            value: "Otro"
            selected: false
    - label: "Área relacionada"
      placeholder: "Selecciona un área *"
      name: "Área"
      required: true
      halfWidth: true
      dropdown:
        type: "search"
        search:
          placeholder: "Buscar áreas..."
        items:
          - label: "Atención a clientes"
            value: "Atención a clientes"
            selected: false
          - label: "Ventas y finanzas"
            value: "Ventas y finanzas"
            selected: false
          - label: "Soporte técnico"
            value: "Soporte técnico"
            selected: false
          - label: "Alianzas"
            value: "Alianzas"
            selected: false
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
    - label: "Acepto los [Términos y Condiciones](/)"
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
