import Filter from "./filter";

export default class SelectFilter extends Filter {
  constructor({ name, options, placeholder }) {
    super();

    this.$el = null;
    this.name = name;
    this.options = options;
    this.placeholder = placeholder;

    this.selectedOption = null;
  }

  render() {
    this.$el = document.createElement("app-select-filter");
    this.$el.setAttribute("name", this.name);
    this.$el.setAttribute("placeholder", this.placeholder);
    this.$el.setAttribute("options", JSON.stringify(this.options));

    this.$el.addEventListener("app-select-filter-changed", this.onFilterChanged);

    return this.$el;
  }

  updateProperty(name, data) {
    this.$el.setAttribute(name, data);
  }

  onFilterChanged = function ($event) {
    this.selectedOption = $event.detail;

    this.emit(SelectFilter.Events.CHANGED, this.selectedOption);
  }.bind(this);
}
