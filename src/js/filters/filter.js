import EventEmitter from "../helpers/eventEmiter";

export default class Filter extends EventEmitter {
  constructor() {
    super();
  }

  static Events = {
    CHANGED: "changed",
  };
}
