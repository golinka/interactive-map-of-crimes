import _ from "lodash";
import "virtual:svg-icons-register";
import "./../sass/styles.sass";
import "../components/SvgIcon/SvgIcon";
import "../components/AppButton/AppButton";
import {
  addCircle,
  getPosition,
  hasCoordinates,
  groupEventsByLocation,
  getAvargeEventGroupPosition,
} from "./helpers/map";
import events from "../_mocks/events.json";

const svg = document.querySelector("#map").getSVGDocument();
const groupEl = svg.querySelector("g");

const cityGroups = Object.keys(events).map((city) => ({
  name: city,
  crimes: _.groupBy(events[city], "affected_type"),
}));

cityGroups.forEach((city) => {
  const events = city.crimes[31] || [];
  const eventsWithCoordinates = events.filter(hasCoordinates);
  const cityEventsGroups = groupEventsByLocation(eventsWithCoordinates, 100);
  cityEventsGroups.forEach((group) => {
    if (group.length) {
      const groupPosition = getAvargeEventGroupPosition(group);
      const { x, y } = getPosition(groupPosition.lat, groupPosition.lon);
      addCircle({ amount: group.length, parentEl: groupEl, x, y });
    }
  });
});
