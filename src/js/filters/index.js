import { flatten, groupBy } from "lodash";
import { EVENT_TYPE_COLOR_MAPPING } from "../consts";
import Filter from "./filter";
import CategoryFilter from "./category";
import SelectFilter from "./select";

export default class Filters extends Filter {
  constructor({ events, names }) {
    super();

    this.filtersEl = document.querySelector("#filters");
    this.events = events;
    this.names = names;

    // Filter instances
    this.categoryFilter = null;
    this.regionSelectFilter = null;
    this.citySelectFilter = null;

    // Data
    this.categoryFilterSelectedOptions = [];
    this.regionFilterSelectedOption = null;
    this.cityFilterSelectedOption = null;

    this.render();
  }

  static Events = {
    CHANGED: "changed",
    CLEAR: "clear",
  };

  get allEvents() {
    return flatten(Object.values(this.events));
  }

  get allRegions() {
    return Object.keys(this.events);
  }

  get allGroupedEvents() {
    if (this.regionFilterSelectedOption) {
      return groupBy(
        this.events[this.regionFilterSelectedOption],
        "affected_type"
      );
    }
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
      key: String(crimeId),
      label: this.crimeTypes[crimeId],
      count: (this.allGroupedEvents[crimeId] || []).length || 0,
    }));
    return [...options, this.categoryFilterOptionAll];
  }

  get filteredEventes() {
    let allEvents = { ...this.allGroupedEvents, total: this.allEvents.length };

    const isShowAllEvents = !!this.categoryFilterSelectedOptions.find(
      (option) => option.key === String(this.categoryFilterOptionAll.key)
    );
    if (!isShowAllEvents && this.categoryFilterSelectedOptions.length) {
      allEvents = this.categoryFilterSelectedOptions.reduce((acc, crime) => {
        const events = this.allGroupedEvents[Number(crime.key)] || [];
        acc[crime.key] = events;
        acc.total = (acc.total || 0) + events.length;
        return acc;
      }, {});
    }

    return allEvents;
  }

  get regionSelectOptions() {
    return this.allRegions.map((region) => ({
      value: region,
      label: region,
    }));
  }

  get regionPlaceholder() {
    return "All States";
  }

  get cityPlaceholder() {
    return "All Cities / Towns";
  }

  updateResults() {
    this.renderResults(this.filteredEventes.total || 0);

    // Tags
    const categoryTags = this.categoryFilterSelectedOptions.map((category) => ({
      label: category.label,
      type: "category",
      color: EVENT_TYPE_COLOR_MAPPING[category.key],
    }));

    this.renderTags([
      ...categoryTags,
      {
        label: this.regionFilterSelectedOption || this.regionPlaceholder,
        type: "region",
      },
      {
        label: this.cityFilterSelectedOption || this.cityPlaceholder,
        type: "city",
      },
    ]);

    this.emit(Filters.Events.CHANGED);
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

  renderClearButton() {
    const appButtonEl = document.createElement("app-button");
    appButtonEl.setAttribute("type", "secondary");
    appButtonEl.setAttribute("size", "large");
    appButtonEl.classList.add("h-mb-15", "h-display-block");

    // const appButtonSlotIconEl = document.createElement("div");
    // appButtonSlotIconEl.setAttribute("slot", "icon");

    // const appButtonIconEl = document.createElement("app-icon");
    // appButtonIconEl.setAttribute("name", "grid");
    // appButtonIconEl.setAttribute("width", "20px");
    // appButtonIconEl.setAttribute("height", "20px");

    const appButtonSlotTextEl = document.createElement("div");
    appButtonSlotTextEl.setAttribute("slot", "text");
    appButtonSlotTextEl.textContent = "Clear All Filters";

    // appButtonSlotIconEl.appendChild(appButtonIconEl);
    // appButtonEl.appendChild(appButtonSlotIconEl);
    appButtonEl.appendChild(appButtonSlotTextEl);
    this.filtersEl.appendChild(appButtonEl);

    appButtonEl.addEventListener("click", () => {
      this.categoryFilterSelectedOptions = [];
      this.regionFilterSelectedOption = null;
      this.cityFilterSelectedOption = null;

      this.categoryFilter.updateProperty(
        "options",
        JSON.stringify(this.categoryFiltersOptions)
      );
      this.regionSelectFilter.updateProperty(
        "options",
        JSON.stringify(this.regionSelectOptions)
      );

      this.emit(Filters.Events.CLEAR);
    });
  }

  render() {
    // Category filter
    this.categoryFilter = new CategoryFilter({
      name: "Category",
      options: this.categoryFiltersOptions,
    });

    this.categoryFilter.on(CategoryFilter.Events.CHANGED, (data) => {
      this.categoryFilterSelectedOptions = data;
      this.updateResults();
    });

    const categoryFilterEl = this.categoryFilter.render();
    categoryFilterEl.classList.add("h-display-block", "h-mb-35");
    document.querySelector("#filters").appendChild(categoryFilterEl);

    // Region filter
    this.regionSelectFilter = new SelectFilter({
      name: "Region",
      options: this.regionSelectOptions,
      placeholder: this.regionPlaceholder,
    });

    this.regionSelectFilter.on(SelectFilter.Events.CHANGED, (data) => {
      this.regionFilterSelectedOption = data;
      this.updateResults();
    });

    const regionFilterEl = this.regionSelectFilter.render();
    regionFilterEl.classList.add("h-display-block", "h-mb-35");
    document.querySelector("#filters").appendChild(regionFilterEl);

    // City filter
    this.citySelectFilter = new SelectFilter({
      name: "City / Town",
      options: [{ value: "konotop", label: "Konopot" }],
      placeholder: this.cityPlaceholder,
    });

    this.citySelectFilter.on(SelectFilter.Events.CHANGED, (data) => {
      this.cityFilterSelectedOption = data;
      this.updateResults();
    });

    const cityFilterEl = this.citySelectFilter.render();
    cityFilterEl.classList.add("h-display-block", "h-mb-35");
    document.querySelector("#filters").appendChild(cityFilterEl);

    // Results
    this.updateResults();

    // Button
    this.renderClearButton();
  }
}
