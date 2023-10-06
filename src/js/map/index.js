import "../../assets/map.svg";
import "../../assets/map.png";
import {
  EVENT_TYPE_COLOR_MAPPING,
  EVENT_TYPE_SIZE_MAPPING,
  SIZES,
} from "../consts";
import {
  getPosition,
  hasCoordinates,
  getGroupSizesMapping,
  groupEventsByLocation,
  getAvargeEventGroupPosition,
} from "../helpers/map";

export default class Map {
  constructor({ types, events, selectedCategories } = {}) {
    this.svgEl = document.querySelector("#map").getSVGDocument();
    this.mapCrimesEl = document.querySelector("#crime-types");
    this.mapGroupEl = this.svgEl.querySelector("g");

    this.types = types;
    this.events = events;
    this.selectedCategories = selectedCategories;

    this.render();
  }

  addCircle({ x, y, amount, parentEl, size, color }) {
    const svgNS = "http://www.w3.org/2000/svg";
    const group = document.createElementNS(svgNS, "g");

    const circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", size / 2);
    circle.setAttribute("fill", color);
    circle.setAttribute("stroke", "white");
    circle.setAttribute("stroke-width", "1");
    circle.setAttribute("opacity", "0.6");
    group.appendChild(circle);

    if (amount) {
      const text = document.createElementNS(svgNS, "text");
      text.setAttribute("x", x);
      text.setAttribute("y", y);
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("alignment-baseline", "middle");
      text.setAttribute("fill", "white");
      text.setAttribute("font-size", "12px");
      text.textContent = amount;
      group.appendChild(text);
    }

    parentEl.appendChild(group);
  }

  renderMarkerTypes() {
    const appMarkerTypes = document.createElement("app-marker-types");
    appMarkerTypes.setAttribute("types", JSON.stringify(this.types));
    this.mapCrimesEl.appendChild(appMarkerTypes);
  }

  removeMarkers() {
    while (this.mapGroupEl.firstChild) {
      this.mapGroupEl.removeChild(this.mapGroupEl.firstChild);
    }

    const svgNS = "http://www.w3.org/2000/svg";
    const imageEl = document.createElementNS(svgNS, "image");
    imageEl.setAttribute("x", "-414");
    imageEl.setAttribute("y", "-225");
    imageEl.setAttribute("width", "2484");
    imageEl.setAttribute("height", "1350");
    imageEl.setAttribute("href", "map.png");
    this.mapGroupEl.appendChild(imageEl);
  }

  renderMarkers() {
    const crimeIds = Object.keys(this.events).map(Number).filter(Boolean);

    // Set bigger z-index for the last selected markers category
    const lastSelectedCrime =
      this.selectedCategories[this.selectedCategories.length - 1] || {};
    const lastSelectedCrimeId = Number(lastSelectedCrime.key || 0);
    const correctOrderCrimeIds = lastSelectedCrime
      ? [
          ...(crimeIds.filter((id) => id !== lastSelectedCrimeId) || []),
          lastSelectedCrimeId,
        ]
      : crimeIds;

    for (const crimeId of correctOrderCrimeIds) {
      const eventsColor = EVENT_TYPE_COLOR_MAPPING[crimeId] || "";
      const eventSizeMapping = EVENT_TYPE_SIZE_MAPPING[crimeId];
      const isEventWithValue = !!this.selectedCategories.find(
        (category) => category.key === String(crimeId)
      );

      const events = this.events[crimeId] || [];
      const eventsWithCoordinates = events.filter(hasCoordinates);
      const crimeTypeEventGroups = groupEventsByLocation(
        eventsWithCoordinates,
        70
      );

      const cityEventsGroupsWithSize =
        getGroupSizesMapping(crimeTypeEventGroups);
      crimeTypeEventGroups.forEach((group, index) => {
        if (group.length) {
          const groupCircleSize = cityEventsGroupsWithSize[index];
          const groupPosition = getAvargeEventGroupPosition(group);
          const { x, y } = getPosition(groupPosition.lat, groupPosition.lon);
          const isShowValue =
            isEventWithValue && groupCircleSize !== SIZES.SMALL;

          this.addCircle({
            x,
            y,
            amount: isShowValue ? group.length : 0,
            parentEl: this.mapGroupEl,
            color: eventsColor,
            size: eventSizeMapping[groupCircleSize],
          });
        }
      });
    }
  }

  rerenderMap() {
    this.removeMarkers();
    this.renderMarkers();
  }

  render() {
    this.renderMarkerTypes();
    this.renderMarkers();
  }
}
