import _ from "lodash";
import "virtual:svg-icons-register";
import "./../sass/styles.sass";
import "../components/SvgIcon/SvgIcon";
import "../components/AppButton/AppButton";
import {
  addCircle,
  getPosition,
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
  const cityEventsGroups = groupEventsByLocation(events, 10);
  console.warn("cityEventsGroups >>", cityEventsGroups);
  cityEventsGroups.forEach((group) => {
    const groupPosition = getAvargeEventGroupPosition(group);
    const { x, y } = getPosition(groupPosition.lat, groupPosition.lon);
    addCircle({ amount: cityEventsGroups.length, parentEl: groupEl, x, y });
  });
});
