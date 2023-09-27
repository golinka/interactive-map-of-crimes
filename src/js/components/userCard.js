const template = document.createElement("template");
template.innerHTML = `
    <div>!!!!!</div>
`;

class UserCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

window.customElements.define("user-card", UserCard);

export default {};
