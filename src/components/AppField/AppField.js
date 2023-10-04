import { debounce } from "lodash";
import AppComponent from "../AppComponent";
import AppFieldStyles from "./AppField.sass?inline";

const template = document.createElement("template");
template.innerHTML = `
  <div class="app-field app-field--has-icon">
    <div class="app-field__icon">
      <slot name="icon" />
    </div>
    <input type="text">
  </div>
`;

class AppField extends AppComponent {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.appendStyles(template, AppFieldStyles);

    this.field = this.shadowRoot.querySelector(".app-field");
    this.fieldIcon = this.shadowRoot.querySelector(".app-field__icon");
    this.fieldInput = this.shadowRoot.querySelector(".app-field input");
  }

  static get observedAttributes() {
    return ["value"];
  }

  get placeholder() {
    return this.getAttribute("placeholder");
  }

  get value() {
    return this.getAttribute("value");
  }

  setState() {
    if (!this.hasSlot("icon")) {
      this.fieldIcon.remove();
      this.field.classList.remove("app-field--has-icon");
    }

    this.fieldInput.setAttribute("placeholder", this.placeholder);
    this.fieldInput.addEventListener("onchange", this.onInputChange);
  }

  onInputChange = debounce(function ($event) {
    this.dispatchEvent(
      new CustomEvent("change", { detail: $event.target.value || "" })
    );
  }, 150);

  attributeChangedCallback(name, _oldValue, newValue) {
    if (name === "value") {
      this.fieldInput.value = newValue;
    }
  }

  connectedCallback() {
    this.setState();
  }

  disconnectedCallback() {
    this.fieldInput.removeEventListener("onchange", this.onInputChange);
  }
}

window.customElements.define("app-field", AppField);

export default {};
