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

  getDataFromAttribute(attributeName) {
    const options = this.getAttribute(attributeName);
    if (options) {
      return JSON.parse(options);
    }
    return null;
  }
}

export default AppComponent;
