import Filter from "./filter";

export default class SelectFilter extends Filter {
  constructor({ name, options, placeholder }) {
    super();

    this.name = name;
    this.options = options || [];
    this.placeholder = placeholder;

    this.selectedOption = null;
  }

  render() {
    this.$el = document.createElement("app-select-filter");
    this.$el.setAttribute("name", this.name);
    this.$el.setAttribute("placeholder", this.placeholder);

    if (this.options.length) {
      this.$el.setAttribute("options", JSON.stringify(this.options));
    } else {
      this.$el.setAttribute("disabled", "");
    }

    this.$el.addEventListener(
      "app-select-filter-changed",
      this.onFilterChanged
    );

    return this.$el;
  }

  onFilterChanged = function ($event) {
    this.selectedOption = $event.detail;

    this.emit(SelectFilter.Events.CHANGED, this.selectedOption);
  }.bind(this);
}
