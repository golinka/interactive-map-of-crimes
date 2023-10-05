import Filter from "./filter";

export default class CategoryFilter extends Filter {
  constructor({ name, options }) {
    super();

    this.$el = null;
    this.name = name;
    this.options = options;

    this.categoryFilterSelectedOptions = [];
  }

  render() {
    console.log("render!!!");
    this.$el = document.createElement("app-category-filter");
    this.$el.setAttribute("name", this.name);
    this.$el.setAttribute("options", JSON.stringify(this.options));

    this.$el.addEventListener(
      "app-category-filter-changed",
      this.onFilterChanged.bind(this)
    );

    return this.$el;
  }

  updateProperty(name, data) {
    this.$el.setAttribute(name, data);
  }

  onFilterChanged($event) {
    this.categoryFilterSelectedOptions = $event.detail || [];

    this.emit(
      CategoryFilter.Events.CHANGED,
      this.categoryFilterSelectedOptions
    );
  }
}