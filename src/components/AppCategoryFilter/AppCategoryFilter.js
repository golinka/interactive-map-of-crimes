import AppComponent from "../AppComponent";
import AppCategoryFilterStyles from "./AppCategoryFilter.sass?inline";

const template = document.createElement("template");
template.innerHTML = `
  <div class="app-category-filter">
    <div class="app-category-filter__name"></div>
    <div class="app-category-filter__list">
      <app-checkbox label="Label" />
    </div>
  </div>
`;

class AppCategoryFilter extends AppComponent {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.appendStyles(template, AppCategoryFilterStyles);

    this.categoryFilter = this.shadowRoot.querySelector(".app-category-filter");
    this.categoryFilterName = this.shadowRoot.querySelector(
      ".app-category-filter__name"
    );
    this.categoryFilterList = this.shadowRoot.querySelector(
      ".app-category-filter__list"
    );

    this.selectedOptions = [];
  }

  static get observedAttributes() {
    return ["options"];
  }

  get name() {
    return this.getAttribute("name");
  }

  get options() {
    return this.getDataFromAttribute("options") || [];
  }

  setState() {
    this.renderComponent();
    this.categoryFilterName.textContent = this.name;
    this.categoryFilterList.addEventListener(
      "app-checkbox-changed",
      this.onAppCheckboxChanged.bind(this)
    );
  }

  attributeChangedCallback(name, _oldValue, newValue) {
    switch (name) {
      case "name":
        this.rerenderName();
        break;
      case "options":
        this.rerenderList();
        break;
      default:
        break;
    }
  }

  onAppCheckboxChanged($event) {
    try {
      $event.stopPropagation();

      const { key, value, label } = $event.detail || {};
      if (this.selectedOptions.find((option) => option.key === key) && !value) {
        this.selectedOptions = this.selectedOptions.filter(
          (option) => option.key !== key
        );
      } else {
        this.selectedOptions = [
          ...(this.selectedOptions || []),
          { key, value, label },
        ];
      }
      this.dispatchEvent(
        new CustomEvent("app-category-filter-changed", {
          composed: true,
          detail: this.selectedOptions,
        })
      );
    } catch (err) {
      console.error("AppCategoryFilter: onAppCheckboxChanged - ", err);
    }
  }

  createAppCheckbox(params) {
    const appCheckbox = document.createElement("app-checkbox");
    if (typeof params.key !== undefined)
      appCheckbox.setAttribute("key", params.key);
    if (params.label) appCheckbox.setAttribute("label", params.label);
    if (typeof params.count !== undefined)
      appCheckbox.setAttribute("count", params.count);
    if (params.checked) appCheckbox.setAttribute("checked", params.checked);
    if (params.disabled) appCheckbox.setAttribute("disabled", params.disabled);
    return appCheckbox;
  }

  renderComponent() {
    this.categoryFilterName.textContent = this.name;
    this.options.forEach((option) => {
      this.categoryFilterList.appendChild(this.createAppCheckbox(option));
    });
  }

  rerenderName() {
    this.categoryFilterName.textContent = this.name;
  }

  rerenderList() {
    this.categoryFilterList.innerHTML = "";
    this.options.forEach((option) => {
      this.categoryFilterList.appendChild(this.createAppCheckbox(option));
    });
  }

  onInputChange() {
    this.dispatchEvent(
      new CustomEvent("change", { detail: $event.target.value || "" })
    );
  }

  connectedCallback() {
    this.setState();
  }

  disconnectedCallback() {
    this.categoryFilterList.removeEventListener(
      "app-checkbox-changed",
      this.onAppCheckboxChanged.bind(this)
    );
  }
}

window.customElements.define("app-category-filter", AppCategoryFilter);

export default {};
