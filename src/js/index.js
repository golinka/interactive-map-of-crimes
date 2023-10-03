import _ from "lodash";
import "virtual:svg-icons-register";
import "./../sass/styles.sass";
import "../components/SvgIcon/SvgIcon";
import "../components/AppButton/AppButton";
import events from "../_mocks/events.json";
import names from "../_mocks/names.json";
import {
  addCircle,
  getPosition,
  hasCoordinates,
  groupEventsByLocation,
  getAvargeEventGroupPosition,
} from "./helpers/map";
import { EVENT_TYPE_COLOR_MAPPING } from "./consts";

const svg = document.querySelector("#map").getSVGDocument();
const groupEl = svg.querySelector("g");

const [
  {
    affected_type: crimeTypes,
    event: eventTypes,
    object_status: objectTypes,
    qualification,
  },
] = names;

const crimeTypeIds = Object.keys(crimeTypes).map(Number);
const cityGroups = Object.keys(events).map((city) => ({
  name: city,
  crimes: _.groupBy(events[city], "affected_type"),
}));

cityGroups.forEach((city) => {
  for (const crimeTypeId of crimeTypeIds) {
    const events = city.crimes[crimeTypeId] || [];
    const eventsColor = EVENT_TYPE_COLOR_MAPPING[crimeTypeId] || "";
    const eventsWithCoordinates = events.filter(hasCoordinates);

    const cityEventsGroups = groupEventsByLocation(eventsWithCoordinates, 100);
    cityEventsGroups.forEach((group) => {
      if (group.length) {
        const groupPosition = getAvargeEventGroupPosition(group);
        const { x, y } = getPosition(groupPosition.lat, groupPosition.lon);

        addCircle({
          x,
          y,
          amount: group.length,
          parentEl: groupEl,
          color: eventsColor,
          size: 65,
        });
      }
    });
  }
});
