import EventEmitter from "../helpers/eventEmiter";

export default class Filter extends EventEmitter {
  constructor() {
    super();

    this.$el = null;
  }

  updateProperty(name, data) {
    if (this.$el) {
      this.$el.setAttribute(name, data);
    }
  }

  static Events = {
    CHANGED: "changed",
  };
}
