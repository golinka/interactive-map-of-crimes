import AppComponent from "../AppComponent";
import AppFilterTagsStyles from "./AppFilterTags.sass?inline";

const template = document.createElement("template");
template.innerHTML = `
  <div class="app-filter-tags"></div>
`;

class AppFilterTags extends AppComponent {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.appendStyles(template, AppFilterTagsStyles);

    this.tagsEl = this.shadowRoot.querySelector(".app-filter-tags");
  }

  static get observedAttributes() {
    return ["tags"];
  }

  get tags() {
    return this.getDataFromAttribute("tags") || [];
  }

  attributeChangedCallback(_name, oldValue) {
    if (!oldValue) return;
    this.rerenderTags();
  }

  setState() {
    this.rerenderTags();
  }

  rerenderTags() {
    this.tagsEl.innerHTML = "";
    this.tags.forEach((tag) => {
      this.tagsEl.appendChild(this.renderTag(tag));
    });
  }

  renderTag(tag) {
    const tagEl = document.createElement("div");
    tagEl.classList.add(
      "app-filter-tags__item",
      `app-filter-tags__item--${tag.type}`
    );
    tagEl.textContent = tag.label;
    if (tag.color) tagEl.style.backgroundColor = tag.color;
    debugger;
    return tagEl;
  }

  connectedCallback() {
    this.setState();
  }
}

window.customElements.define("app-filter-tags", AppFilterTags);

export default {};
