import AppComponent from "../AppComponent";
import AppSelectFilterStyles from "./AppSelectFilter.sass?inline";

const template = document.createElement("template");
template.innerHTML = `
  <div class="app-select-filter">
    <div class="app-select-filter__name"></div>
    <div class="app-select-filter__wrapper"></div>
  </div>
`;

class AppSelectFilter extends AppComponent {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.appendStyles(template, AppSelectFilterStyles);

    this.selectFilter = this.shadowRoot.querySelector(".app-select-filter");
    this.selectFilterName = this.shadowRoot.querySelector(
      ".app-select-filter__name"
    );
    this.selectFilterWrapper = this.shadowRoot.querySelector(
      ".app-select-filter__wrapper"
    );

    this.selectedOption = null;
  }

  static get observedAttributes() {
    return ["options"];
  }

  get name() {
    return this.getAttribute("name");
  }

  get placeholder() {
    return this.getAttribute("placeholder");
  }

  get options() {
    return this.getDataFromAttribute("options") || [];
  }

  get disabled() {
    return this.hasAttribute("disabled");
  }

  setState() {
    this.renderComponent();
    this.selectFilterName.textContent = this.name;
    this.selectFilterWrapper.addEventListener(
      "app-select-changed",
      this.onAppSelectChanged
    );
  }

  attributeChangedCallback(name, oldValue) {
    if (!oldValue) return;
    switch (name) {
      case "name":
        this.rerenderName();
        break;
      case "options":
        this.rerenderSelect();
        break;
      default:
        break;
    }
  }

  onAppSelectChanged = function ($event) {
    try {
      $event.stopPropagation();

      const value = $event.detail || {};
      if (this.selectedOption === value) {
        this.selectedOption = null;
      } else {
        this.selectedOption = value;
      }
      this.dispatchEvent(
        new CustomEvent("app-select-filter-changed", {
          composed: true,
          detail: this.selectedOption,
        })
      );
    } catch (err) {
      console.error("AppSelectFilter: onAppSelectChanged - ", err);
    }
  }.bind(this);

  createAppSelect({ placeholder, options = [], disabled } = {}) {
    const appSelect = document.createElement("app-select");
    if (disabled) appSelect.setAttribute("disabled", "");
    if (placeholder) appSelect.setAttribute("placeholder", placeholder);
    if (options) appSelect.setAttribute("options", JSON.stringify(options));
    return appSelect;
  }

  renderComponent() {
    this.rerenderName();
    this.rerenderSelect();
  }

  rerenderName() {
    this.selectFilterName.textContent = this.name;
  }

  rerenderSelect() {
    this.selectFilterWrapper.innerHTML = "";
    this.selectFilterWrapper.appendChild(
      this.createAppSelect({
        placeholder: this.placeholder,
        options: this.options,
        disabled: this.disabled
      })
    );
  }

  connectedCallback() {
    this.setState();
  }

  disconnectedCallback() {
    this.selectFilterWrapper.removeEventListener(
      "app-select-changed",
      this.onAppSelectChanged
    );
  }
}

window.customElements.define("app-select-filter", AppSelectFilter);

export default {};
