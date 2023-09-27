class SvgIcon extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <svg aria-hidden="true">
        <use xlink:href="" fill="" />
      </svg>
    `;

    this.icon = this.querySelector("svg");
    this.iconUseTag = this.querySelector("use");
    this.setAttributes();
  }

  setAttributes() {
    const manualAttributes = ["name", "color"];
    this.setAttribute("style", "display: inline-flex !important");

    this.iconUseTag.setAttribute("xlink:href", `#${this.getAttribute("name")}`);
    this.iconUseTag.setAttribute("fill", this.getAttribute("color"));

    const attributeNames = this.getAttributeNames();
    attributeNames.forEach((attr) => {
      if (!manualAttributes.includes(attr)) {
        this.icon.setAttribute(attr, this.getAttribute(attr));
      }
    });
  }
}

window.customElements.define("svg-icon", SvgIcon);

export default {};
