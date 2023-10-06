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

// Filters
filters = new Filters({
  events,
  names: Array.isArray(names) ? names[0] : names || {},
});
filters.on(Filters.Events.CHANGED, () => {
  if (map) {
    map.selectedCategories = filters.categoryFilterSelectedOptions;
    map.events = filters.filteredEventes;
    map.rerenderMap();
  }
});
window.filters = filters;

// MAP
map = new Map({
  types: Object.keys(crimeTypes).map((typeId) => ({
    label: crimeTypes[typeId] || "",
    color: EVENT_TYPE_COLOR_MAPPING[typeId] || "black",
  })),
  events: filters.filteredEventes,
  selectedCategories: filters.categoryFilterSelectedOptions,
});
window.map = map;
