import AppComponent from "../AppComponent";
import AppSelectStyles from "./AppSelect.sass?inline";

const template = document.createElement("template");
template.innerHTML = `
  <div class="app-select">
    <select class="app-select__select">
      <option class="app-select__select-placeholder" value="" disabled selected hidden></option>
    </select>
  </div>
`;

class AppSelect extends AppComponent {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.appendStyles(template, AppSelectStyles);

    this.select = this.shadowRoot.querySelector(".app-select");
    this.selectInput = this.shadowRoot.querySelector(".app-select__select");
    this.selectInputPlaceholder = this.shadowRoot.querySelector(
      ".app-select__select-placeholder"
    );
  }

  get placeholder() {
    return this.getAttribute("placeholder");
  }

  get options() {
    return this.getDataFromAttribute("options") || [];
  }

  setState() {
    if (!this.options.length)
      console.error("AppSelect: the options attribute must be specified");

    if (this.hasAttribute("disabled")) {
      this.selectInput.setAttribute("disabled", "");
      this.select.classList.add("app-select--disabled");
    }

    if (this.placeholder) {
      this.selectInputPlaceholder.textContent = this.placeholder;
    } else {
      this.selectInputPlaceholder.remove();
    }

    this.options.forEach((option) => {
      const optionEl = document.createElement("option");
      optionEl.setAttribute("value", option.value);
      optionEl.textContent = option.label;
      this.selectInput.appendChild(optionEl);
    });

    this.selectInput.addEventListener("change", this.onChanged);
  }

  onChanged = function ($event) {
    this.dispatchEvent(
      new CustomEvent("app-select-changed", {
        bubbles: true,
        composed: true,
        detail: $event.target.value,
      })
    );
  }.bind(this);

  connectedCallback() {
    this.setState();
  }

  disconnectedCallback() {
    this.selectInput.removeEventListener("change", this.onChanged);
  }
}

window.customElements.define("app-select", AppSelect);

export default {};
