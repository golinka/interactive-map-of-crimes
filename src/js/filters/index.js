import { flatten, groupBy } from "lodash";
import CategoryFilter from "./category";

export default class Filters {
  constructor({ events, names }) {
    this.filtersEl = document.querySelector("#filters");
    this.events = events;
    this.names = names;

    // Data
    this.categoryFilterSelectedOptions = [];

    this.render();
  }

  get allEvents() {
    return flatten(Object.values(this.events));
  }

  get allGroupedEvents() {
    return groupBy(this.allEvents, "affected_type");
  }

  get crimeTypes() {
    return this.names.affected_type;
  }

  get categoryFilterOptionAll() {
    return {
      key: -1,
      label: "All",
      count: this.allEvents.length,
    };
  }

  get categoryFiltersOptions() {
    const options = Object.keys(this.crimeTypes || []).map((crimeId) => ({
      key: `${crimeId}`,
      label: this.crimeTypes[crimeId],
      count: (this.allGroupedEvents[crimeId] || []).length || 0,
    }));
    return [...options, this.categoryFilterOptionAll];
  }

  renderResultsBlock(count) {
    const appFilterResultsEl = document.createElement("app-filter-results");
    appFilterResultsEl.setAttribute("count", count);

    this.filtersEl.appendChild(appFilterResultsEl);
  }

  render() {
    const categoryFilter = new CategoryFilter({
      name: "Category",
      options: this.categoryFiltersOptions,
    });

    categoryFilter.on(CategoryFilter.Events.CHANGED, (data) => {
      console.log("categoryFilter >> CHANGED", data);
      this.categoryFilterSelectedOptions = data;
    });

    const categoryFilterEl = categoryFilter.render();
    categoryFilterEl.classList.add("h-mb-15");
    document.querySelector("#filters").appendChild(categoryFilterEl);

    this.renderResultsBlock(0);
  }
}
