const topLeftLatLon = [52.64701, 20.01434];
const bottomLeftLatLon = [43.91221, 20.01434];
const topRightLatLon = [52.64701, 44.62032];
const bottomRightLatLon = [43.91221, 44.62032];

const EARTH_RADIUS = 6371;

export function addCircle({ amount, parentEl, x, y }) {
  const svgNS = "http://www.w3.org/2000/svg";

  // Create a group
  const group = document.createElementNS(svgNS, "g");

  // Add circle
  const circle = document.createElementNS(svgNS, "circle");
  circle.setAttribute("cx", x);
  circle.setAttribute("cy", y);
  circle.setAttribute("r", "40");
  circle.setAttribute("fill", "#1A1A1A");
  circle.setAttribute("stroke", "white");
  circle.setAttribute("stroke-width", "1");
  circle.setAttribute("opacity", "0.6");

  // Add text
  const text = document.createElementNS(svgNS, "text");
  text.setAttribute("x", x);
  text.setAttribute("y", y);
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("alignment-baseline", "middle");
  text.setAttribute("fill", "white");
  text.setAttribute("font-size", "30px");
  text.textContent = amount;

  // Add elems to the group
  group.appendChild(circle);
  group.appendChild(text);
  parentEl.appendChild(group);
}

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
    svgImageHeight / (topLeftLatLon[latOrder] - bottomLeftLatLon[latOrder]);
  const lonPixelsRation =
    svgImageWidth / (topRightLatLon[lonOrder] - bottomLeftLatLon[lonOrder]);

  const diffLatFromXLat = topLeftLatLon[latOrder] - lat;
  const diffLonFromXLon = Math.abs(topLeftLatLon[lonOrder] - lon);

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

export function hasCoordinates(event) {
  return event.lat && event.lon;
}

export default {};
