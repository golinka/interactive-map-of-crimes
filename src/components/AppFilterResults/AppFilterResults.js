import AppComponent from "../AppComponent";
import AppFilterResultsStyles from "./AppCheckbox.sass?inline";

const template = document.createElement("template");
template.innerHTML = `
  <div class="app-filter-results">
    Results:
    <span class="app-filter-results__count">0</span>
  </div>
`;

class AppFilterResults extends AppComponent {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.appendStyles(template, AppFilterResultsStyles);

    this.results = this.shadowRoot.querySelector(".app-filter-results");
    this.resultsCount = this.shadowRoot.querySelector(
      ".app-filter-results__count"
    );
  }

  get count() {
    return this.getAttribute("count");
  }

  setState() {
    if (this.count) this.resultsCount.textContent = this.count;
  }

  connectedCallback() {
    this.setState();
  }
}

window.customElements.define("app-filter-results", AppFilterResults);

export default {};
