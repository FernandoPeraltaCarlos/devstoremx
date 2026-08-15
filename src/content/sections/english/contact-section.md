---
enable: true
badge: "contact"
title: "Have a project in mind? <br /> Get in touch."
description: "With that information, we can prepare an initial response and explain what we need to review before quoting the project."
image: "/images/contact-home.jpg"
imageAlt: "Contact"
characterImage: "/images/character-3d.png"
characterImageAlt: "3D character"

form:
  submitButton:
    enable: true
    label: "Send a Message"
  inputs:
    - label: "Name"
      placeholder: "Name *"
      name: "name"
      required: true
      halfWidth: true
      defaultValue: ""
    - label: "Phone or WhatsApp"
      placeholder: "Phone or WhatsApp *"
      name: "phone"
      required: true
      type: "text"
      halfWidth: true
      defaultValue: ""
    - label: "Email Address"
      placeholder: "Email Address *"
      name: "email"
      required: true
      type: "email"
      halfWidth: true
      defaultValue: ""
    - label: "Preferred contact method"
      placeholder: "Preferred contact method"
      name: "preferredContact"
      required: false
      type: "text"
      halfWidth: true
      defaultValue: ""
    - label: "Message"
      tag: "textarea"
      placeholder: "Ask your question *"
      name: "message"
      required: true
      halfWidth: false
      rows: "4"
      defaultValue: ""
    - label: "Google Search"
      checked: false
      name: "source"
      required: true
      groupLabel: "How did you hear about us?"
      group: "source"
      type: "radio"
      halfWidth: true
      defaultValue: ""
    - label: "Social Media"
      name: "source"
      required: true
      group: "source"
      type: "radio"
      halfWidth: true
      defaultValue: ""
    - label: "Referral"
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
      content: "We have received your message! We'll get back to you as soon as possible."
    - note: deprecated
      parentClass: "hidden text-sm message error"
      content: "Something went wrong! Please try again."
---
