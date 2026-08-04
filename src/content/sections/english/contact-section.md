---
enable: true
badge: "contact"
title: "Tell us what you need <br /> and what you have today."
description: "With that information, we can prepare an initial response and explain what we need to review before quoting the project."
image: "/images/contact-home.jpg"
imageAlt: "Contact"
characterImage: "/images/character-3d.png"
characterImageAlt: "3D character"

form:
  emailSubject: "New contact form submission"
  submitButton:
    enable: true
    label: "Send a Message"
  inputs:
    - label: "Name"
      placeholder: "Name *"
      name: "Name"
      required: true
      halfWidth: true
      defaultValue: ""
    - label: "Phone or WhatsApp"
      placeholder: "Phone or WhatsApp *"
      name: "Phone or WhatsApp"
      required: true
      type: "text"
      halfWidth: true
      defaultValue: ""
    - label: "Email Address"
      placeholder: "Email Address *"
      name: "Email Address"
      required: true
      type: "email"
      halfWidth: true
      defaultValue: ""
    - label: "Preferred contact method"
      placeholder: "Preferred contact method"
      name: "Preferred contact method"
      required: false
      type: "text"
      halfWidth: true
      defaultValue: ""
    - label: "Message"
      tag: "textarea"
      placeholder: "Ask your question *"
      name: "Message"
      required: true
      halfWidth: false
      rows: "4"
      defaultValue: ""
    - label: "Google Search"
      checked: false
      name: "User Source"
      required: true
      groupLabel: "How did you hear about us?"
      group: "source"
      type: "radio"
      halfWidth: true
      defaultValue: ""
    - label: "Social Media"
      name: "User Source"
      required: true
      group: "source"
      type: "radio"
      halfWidth: true
      defaultValue: ""
    - label: "Referral"
      name: "User Source"
      required: true
      group: "source"
      type: "radio"
      halfWidth: true
      defaultValue: ""
    - label: "LinkedIn"
      name: "User Source"
      required: true
      group: "source"
      type: "radio"
      halfWidth: true
      defaultValue: ""
    - label: "Google Maps"
      name: "User Source"
      required: true
      group: "source"
      type: "radio"
      halfWidth: true
      defaultValue: ""
    - label: "I agree to the [Terms & Conditions](/)"
      name: "Agreed Privacy"
      value: "Agreed"
      checked: false
      required: true
      type: "checkbox"
      halfWidth: false
      defaultValue: ""
    - note: success
      parentClass: "hidden text-sm message success"
      content: "We have received your message! We'll get back to you as soon as possible."
    - note: deprecated
      parentClass: "hidden text-sm message error"
      content: "Something went wrong! Please try again."
---
