import AppComponent from "../AppComponent";
import AppCheckboxStyles from "./AppCheckbox.sass?inline";

const template = document.createElement("template");
template.innerHTML = `
  <label class="app-checkbox">
    <input class="app-checkbox__input" type="checkbox" name="checkbox" />
    <span class="app-checkbox__label"></span>
    <span class="app-checkbox__count"></span>
  </label>
`;

class AppCheckbox extends AppComponent {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.appendStyles(template, AppCheckboxStyles);

    this.checkbox = this.shadowRoot.querySelector(".app-checkbox");
    this.checkboxInput = this.shadowRoot.querySelector(".app-checkbox__input");
    this.checkboxLabel = this.shadowRoot.querySelector(".app-checkbox__label");
    this.checkboxCount = this.shadowRoot.querySelector(".app-checkbox__count");
  }

  get label() {
    return this.getAttribute("label");
  }

  get checked() {
    return this.getAttribute("checked");
  }

  get count() {
    return this.getAttribute("count");
  }

  setState() {
    if (this.hasAttribute("disabled")) {
      this.checkboxInput.setAttribute("disabled", "");
      this.checkbox.classList.add("app-checkbox--disabled");
    }

    if (!this.label) this.checkboxLabel.remove();
    if (!this.count) this.checkboxCount.remove();

    this.checkboxLabel.textContent = this.label;
    this.checkboxCount.textContent = this.count;
    if (this.checked) this.checkboxInput.setAttribute('checked', '');
  }

  connectedCallback() {
    this.setState();
  }
}

window.customElements.define("app-checkbox", AppCheckbox);

export default {};
