import { groupBy, flatten } from "lodash";
import "virtual:svg-icons-register";
import "../sass/styles.sass";
import "../components";
import events from "../_mocks/events.json";
import names from "../_mocks/names.json";
import Filters from "./filters";

import {
  addCircle,
  getPosition,
  hasCoordinates,
  getGroupSizesMapping,
  groupEventsByLocation,
  getAvargeEventGroupPosition,
} from "./helpers/map";
import {
  EVENT_TYPE_COLOR_MAPPING,
  EVENT_TYPE_SIZE_MAPPING,
  MARKER_VALUE_BY_EVENT_TYPE,
  SIZES,
} from "./consts";

const [
  {
    affected_type: crimeTypes,
    event: eventTypes,
    object_status: objectTypes,
    qualification,
  },
] = names;

const allEvents = flatten(Object.values(events));
window.allEvents = allEvents;
const allGroupedEvents = groupBy(allEvents, "affected_type");

const filters = new Filters({ events, names });
window.filters = filters;

// MAP
const svg = document.querySelector("#map").getSVGDocument();
const groupEl = svg.querySelector("g");

const crimeTypeIds = Object.keys(crimeTypes).map(Number);

for (const crimeTypeId of crimeTypeIds) {
  const eventsColor = EVENT_TYPE_COLOR_MAPPING[crimeTypeId] || "";
  const eventSizeMapping = EVENT_TYPE_SIZE_MAPPING[crimeTypeId];
  const isEventWithValue = MARKER_VALUE_BY_EVENT_TYPE.includes(crimeTypeId);
  const events = allGroupedEvents[crimeTypeId] || [];

  const eventsWithCoordinates = events.filter(hasCoordinates);
  const crimeTypeEventGroups = groupEventsByLocation(eventsWithCoordinates, 70);

  const cityEventsGroupsWithSize = getGroupSizesMapping(crimeTypeEventGroups);
  crimeTypeEventGroups.forEach((group, index) => {
    if (group.length) {
      const groupCircleSize = cityEventsGroupsWithSize[index];
      const groupPosition = getAvargeEventGroupPosition(group);
      const { x, y } = getPosition(groupPosition.lat, groupPosition.lon);
      const isShowValue = isEventWithValue && groupCircleSize !== SIZES.SMALL;

      addCircle({
        x,
        y,
        amount: isShowValue ? group.length : 0,
        parentEl: groupEl,
        color: eventsColor,
        size: eventSizeMapping[groupCircleSize],
      });
    }
  });
}
