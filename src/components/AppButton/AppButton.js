import AppComponent from "../AppComponent";
import AppButtonStyles from "./AppButton.sass?inline";

const template = document.createElement("template");
template.innerHTML = `
  <button class="app-button">
    <div class="app-button__icon">
      <slot name="icon" />
    </div>
    <div class="app-button__text">
      <slot name="text" />
    </div>
  </button>
`;

class SvgIcon extends AppComponent {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.appendStyles(template, AppButtonStyles);

    this.button = this.shadowRoot.querySelector("button");
    this.buttonIcon = this.shadowRoot.querySelector(".app-button__icon");
    this.buttonText = this.shadowRoot.querySelector(".app-button__text");
  }

  setState() {
    const size = this.getAttribute("size") || "medium";
    const color = this.getAttribute("color") || "orange";

    if (!this.hasSlot("icon")) {
      this.buttonIcon.remove();
    }

    if (!this.hasSlot("text")) {
      this.buttonText.remove();
    }

    this.button.classList.add(`app-button--size-${size}`);
    this.button.classList.add(`app-button--color-${color}`);
  }

  connectedCallback() {
    this.setState();
  }
}

window.customElements.define("app-button", SvgIcon);

export default {};
