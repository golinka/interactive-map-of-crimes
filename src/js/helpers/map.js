import { SIZES } from "../consts";

const TOP_LEFT_MAP_LAT_LON = [52.64701, 20.01434];
const BOTTOM_LEFT_MAP_LAT_LON = [43.91221, 20.01434];
const TOP_RIGHT_MAP_LAT_LON = [52.64701, 44.62032];
const BOTTOM_RIGHT_MAP_LAT_LON = [43.91221, 44.62032];

const EARTH_RADIUS = 6371;

export function getPosition(lat, lon) {
  const svg = document.querySelector("#map").getSVGDocument();
  const svgImageEl = svg.querySelector("image");
  const svgImageWidth = svgImageEl.width.baseVal.value;
  const svgImageHeight = svgImageEl.height.baseVal.value;
  const svgImageX = svgImageEl.x.baseVal.value;
  const svgImageY = svgImageEl.y.baseVal.value;

  const latOrder = 0;
  const lonOrder = 1;
  const latPixelsRation =
    svgImageHeight /
    (TOP_LEFT_MAP_LAT_LON[latOrder] - BOTTOM_LEFT_MAP_LAT_LON[latOrder]);
  const lonPixelsRation =
    svgImageWidth /
    (TOP_RIGHT_MAP_LAT_LON[lonOrder] - BOTTOM_LEFT_MAP_LAT_LON[lonOrder]);

  const diffLatFromXLat = TOP_LEFT_MAP_LAT_LON[latOrder] - lat;
  const diffLonFromXLon = Math.abs(TOP_LEFT_MAP_LAT_LON[lonOrder] - lon);

  const markerX = svgImageX + lonPixelsRation * diffLonFromXLon;
  const markerY = svgImageY + latPixelsRation * diffLatFromXLat;

  return { x: markerX, y: markerY };
}

// Helper function to calculate distance between two coordinates using Haversine formula
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS * c;
}

export function groupEventsByLocation(events, delta) {
  const groupedObjects = [];

  for (const event of events) {
    let foundGroup = false;

    for (const group of groupedObjects) {
      // Take the first event in the group for comparison
      const groupEvent = group[0];

      const distance = calculateDistance(
        groupEvent.lat,
        groupEvent.lon,
        event.lat,
        event.lon
      );

      if (distance <= delta) {
        group.push(event);
        foundGroup = true;
        break;
      }
    }

    if (!foundGroup) {
      groupedObjects.push([event]);
    }
  }

  return groupedObjects;
}

export function getAvargeEventGroupPosition(events) {
  const { lat, lon } = events.reduce(
    (acc, event) => ({ lat: acc.lat + event.lat, lon: acc.lon + event.lon }),
    { lat: 0, lon: 0 }
  );
  return { lat: lat / events.length, lon: lon / events.length };
}

export function getGroupSizesMapping(group, offsetPercent = 0.2) {
  const lengths = group
    .map((innerArr, index) => ({ index, length: innerArr.length }))
    .sort((a, b) => a.length - b.length);

  const median = (lengths[Math.floor(lengths.length / 2)] || {}).length;
  const offset = Math.ceil(median * offsetPercent);

  return lengths.reduce((acc, _item, i) => {
    const length = group[i].length;
    switch (true) {
      case length > median + offset:
        acc[i] = SIZES.LARGE;
        break;
      case length >= median - offset:
        acc[i] = SIZES.MEDIUM;
        break;
      default:
        acc[i] = SIZES.SMALL;
    }
    return acc;
  }, {});
}

export function hasCoordinates(event) {
  return event.lat && event.lon;
}

export default {};
