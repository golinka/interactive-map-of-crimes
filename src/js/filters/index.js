import { flatten, groupBy } from "lodash";
import CategoryFilter from "./category";
import SelectFilter from "./select";

export default class Filters {
  constructor({ events, names }) {
    this.filtersEl = document.querySelector("#filters");
    this.events = events;
    this.names = names;

    // Data
    this.categoryFilterSelectedOptions = [];
    this.regionFilterSelectedOption = null;
    this.cityFilterSelectedOption = null;

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

  rerenderResults(count) {
    let appFilterResultsEl = document.querySelector("app-filter-results");
    if (!appFilterResultsEl) {
      appFilterResultsEl = document.createElement("app-filter-results");
      appFilterResultsEl.setAttribute("count", count);
      this.filtersEl.appendChild(appFilterResultsEl);
    } else {
      appFilterResultsEl.setAttribute("count", count);
    }
  }

  render() {
    // Category filter
    const categoryFilter = new CategoryFilter({
      name: "Category",
      options: this.categoryFiltersOptions,
    });

    categoryFilter.on(CategoryFilter.Events.CHANGED, (data) => {
      console.log("categoryFilter >> CHANGED", data);
      this.categoryFilterSelectedOptions = data;
    });

    const categoryFilterEl = categoryFilter.render();
    categoryFilterEl.classList.add("h-display-block", "h-mb-35");
    document.querySelector("#filters").appendChild(categoryFilterEl);

    // Region filter
    const regionSelectFilter = new SelectFilter({
      name: "Region",
      options: [{ value: "sumy", label: "Sumy" }],
      placeholder: "All States",
    });

    regionSelectFilter.on(SelectFilter.Events.CHANGED, (data) => {
      this.regionFilterSelectedOption = data;
    });

    const regionFilterEl = regionSelectFilter.render();
    regionFilterEl.classList.add("h-display-block", "h-mb-35");
    document.querySelector("#filters").appendChild(regionFilterEl);

    // City filter
    const citySelectFilter = new SelectFilter({
      name: "City / Town",
      options: [{ value: "konotop", label: "Konopot" }],
      placeholder: "All Cities / Towns",
    });

    citySelectFilter.on(SelectFilter.Events.CHANGED, (data) => {
      this.cityFilterSelectedOption = data;
    });

    const cityFilterEl = citySelectFilter.render();
    cityFilterEl.classList.add("h-display-block", "h-mb-35");
    document.querySelector("#filters").appendChild(cityFilterEl);

    // Results
    this.rerenderResults(0);
  }
}
