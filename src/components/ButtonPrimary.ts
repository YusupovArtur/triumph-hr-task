export class ButtonPrimary extends HTMLElement {
  connectedCallback() {
    const button = document.createElement('button');
    button.className =
      'px-4 py-2 flex justify-between items-center bg-blue-700 text-white rounded select-none hover:bg-blue-800 active:bg-blue-900 disabled:bg-gray-400 disabled:opacity-80 disabled:cursor-not-allowed disabled:pointer-events-none transition';

    while (this.firstChild) {
      button.appendChild(this.firstChild);
    }

    this.appendChild(button);
  }
}

customElements.define('button-primary', ButtonPrimary);
