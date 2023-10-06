import "virtual:svg-icons-register";
import "../sass/styles.sass";
import "../components";
import { EVENT_TYPE_COLOR_MAPPING } from "./consts";
import events from "../_mocks/events.json";
import names from "../_mocks/names.json";
import Filters from "./filters";
import Map from "./map";

const [{ affected_type: crimeTypes }] = names;
let map, filters;

const onFiltersChanged = () => {
  if (map && filters) {
    map.selectedCategories = filters.categoryFilterSelectedOptions;
    map.events = filters.filteredEventes;
    map.rerenderMap();
  }
};

// Filters
filters = new Filters({
  events,
  names: Array.isArray(names) ? names[0] : names || {},
});
filters.on(Filters.Events.CHANGED, onFiltersChanged);
filters.on(Filters.Events.CLEAR, onFiltersChanged);

// MAP
map = new Map({
  events: filters.filteredEventes,
  selectedCategories: filters.categoryFilterSelectedOptions,
  types: Object.keys(crimeTypes).map((typeId) => ({
    label: crimeTypes[typeId] || "",
    color: EVENT_TYPE_COLOR_MAPPING[typeId] || "black",
  })),
});
