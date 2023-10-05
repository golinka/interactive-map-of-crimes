import AppComponent from "../AppComponent";
import AppCategoryFilterStyles from "./AppCategoryFilter.sass?inline";

const template = document.createElement("template");
template.innerHTML = `
  <div class="app-category-filter">
    <div class="app-category-filter__name"></div>
    <div class="app-category-filter__list"></div>
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
      this.onAppCheckboxChanged
    );
  }

  attributeChangedCallback(name, oldValue) {
    if (!oldValue) return;
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

  onAppCheckboxChanged = function ($event) {
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
  }.bind(this);

  createAppCheckbox({ key, label, count, checked, disabled } = {}) {
    const appCheckbox = document.createElement("app-checkbox");
    if (typeof key !== undefined) appCheckbox.setAttribute("key", key);
    if (label) appCheckbox.setAttribute("label", label);
    if (typeof count !== undefined) appCheckbox.setAttribute("count", count);
    if (checked) appCheckbox.setAttribute("checked", checked);
    if (disabled) appCheckbox.setAttribute("disabled", disabled);
    return appCheckbox;
  }

  renderComponent() {
    this.rerenderName();
    this.rerenderList();
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

  connectedCallback() {
    this.setState();
  }

  disconnectedCallback() {
    this.categoryFilterList.removeEventListener(
      "app-checkbox-changed",
      this.onAppCheckboxChanged
    );
  }
}

window.customElements.define("app-category-filter", AppCategoryFilter);

export default {};
