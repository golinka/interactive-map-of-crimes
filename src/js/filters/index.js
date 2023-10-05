import { flatten, groupBy } from "lodash";
import { EVENT_TYPE_COLOR_MAPPING } from "../consts";
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

  updateResults() {
    this.renderResults(0);

    // Tags
    const categoryTags = this.categoryFilterSelectedOptions.map((category) => ({
      label: category.label,
      type: "category",
      color: EVENT_TYPE_COLOR_MAPPING[category.key],
    }));

    this.renderTags([
      ...categoryTags,
      { label: "Raped", type: "region" },
      { label: "Raped", type: "city" },
    ]);
  }

  renderResults(count) {
    let appFilterResultsEl = document.querySelector("app-filter-results");
    if (!appFilterResultsEl) {
      appFilterResultsEl = document.createElement("app-filter-results");
      appFilterResultsEl.setAttribute("count", count);
      appFilterResultsEl.classList.add("h-mb-15", "h-display-block");
      this.filtersEl.appendChild(appFilterResultsEl);
    } else {
      appFilterResultsEl.setAttribute("count", count);
    }
  }

  renderTags(tags) {
    let appFilterTagsEl = document.querySelector("app-filter-tags");
    if (!appFilterTagsEl) {
      appFilterTagsEl = document.createElement("app-filter-tags");
      appFilterTagsEl.setAttribute("tags", JSON.stringify(tags));
      appFilterTagsEl.classList.add("h-mb-15", "h-display-block");
      this.filtersEl.appendChild(appFilterTagsEl);
    } else {
      appFilterTagsEl.setAttribute("tags", JSON.stringify(tags));
    }
  }

  render() {
    // Category filter
    const categoryFilter = new CategoryFilter({
      name: "Category",
      options: this.categoryFiltersOptions,
    });

    categoryFilter.on(CategoryFilter.Events.CHANGED, (data) => {
      this.categoryFilterSelectedOptions = data;
      this.updateResults();
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
      this.updateResults();
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
      this.updateResults();
    });

    const cityFilterEl = citySelectFilter.render();
    cityFilterEl.classList.add("h-display-block", "h-mb-35");
    document.querySelector("#filters").appendChild(cityFilterEl);

    // Results
    this.updateResults();
  }
}
