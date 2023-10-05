export default class Map {
  constructor({ types } = {}) {
    this.types = types;
    this.mapCrimesEl = document.querySelector("#crime-types");

    this.render();
  }

  render() {
    const appMarkerTypes = document.createElement("app-marker-types");
    appMarkerTypes.setAttribute("types", JSON.stringify(this.types));
    this.mapCrimesEl.appendChild(appMarkerTypes);
  }
}
