export default class Filters {
  constructor({ categoryFilter }) {
    this.filtersEl = document.querySelector("#filters");
    this.categoryFilterEl = document.querySelector("#category");

    if (categoryFilter) {
      this.categoryFilterData = {
        name: categoryFilter.name,
        options: categoryFilter.options,
      };
    }

    this.render();
  }

  renderCategoryFilter(name, options) {
    const blockEl = document.createElement("div");
    blockEl.classList.add("sidebar__filters-block");
    blockEl.appendChild;

    const appCategoryFilterEl = document.createElement("app-category-filter");
    appCategoryFilterEl.setAttribute("name", name);
    appCategoryFilterEl.setAttribute("options", JSON.stringify(options));

    blockEl.appendChild(appCategoryFilterEl);
    this.filtersEl.appendChild(blockEl);
  }

  render() {
    this.renderCategoryFilter(
      this.categoryFilterData.name,
      this.categoryFilterData.options
    );
  }
}
