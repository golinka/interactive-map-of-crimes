import AppComponent from "../AppComponent";
import AppMarkerTypesStyles from "./AppMarkerTypes.sass?inline";

const template = document.createElement("template");
template.innerHTML = `
  <div class="app-marker-types"></div>
`;

class AppMarkerTypes extends AppComponent {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.appendStyles(template, AppMarkerTypesStyles);

    this.markerTypes = this.shadowRoot.querySelector(".app-marker-types");
  }

  get types() {
    return this.getDataFromAttribute("types") || [];
  }

  setState() {
    if (!this.types.length)
      console.error("AppMarkerTypes: the types attribute must be specified");

    this.types.forEach((type) => {
      const typeEl = document.createElement("div");
      typeEl.classList.add("app-marker-types__type", `app-marker-types__type--${type.color}`);

      const typeCircleEl = document.createElement("div");
      typeCircleEl.classList.add("app-marker-types__type-circle");
      typeCircleEl.style.backgroundColor = type.color;

      const typeLabelEl = document.createElement("div");
      typeLabelEl.classList.add("app-marker-types__type-label");
      typeLabelEl.textContent = type.label;

      typeEl.appendChild(typeCircleEl)
      typeEl.appendChild(typeLabelEl)
      this.markerTypes.appendChild(typeEl);
    });
  }

  connectedCallback() {
    this.setState();
  }
}

window.customElements.define("app-marker-types", AppMarkerTypes);

export default {};
