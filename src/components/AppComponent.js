class AppComponent extends HTMLElement {
  constructor() {
    super();
  }

  appendStyles(template, styles) {
    const style = document.createElement("style");
    style.textContent = styles;
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  hasSlot(name) {
    if (!name) return false;
    const slot = this.shadowRoot.querySelector(`slot[name="${name}"]`);
    return slot.assignedElements().length > 0;
  }
}

export default AppComponent;
