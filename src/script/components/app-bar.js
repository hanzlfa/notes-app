class AppBar extends HTMLElement {
  constructor() {
    super()

    const wrapper = document.createElement('div')
    wrapper.setAttribute('class', 'app-bar')

    const title = document.createElement('h1')
    title.setAttribute('class', 'title')
    title.innerText = this.getAttribute('app-title') || 'My Notes'

    wrapper.appendChild(title)
    this.append(wrapper)
  }

  static get observedAttributes() {
    return ['app-title']
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'app-title' && oldValue !== newValue) {
      this.querySelector('.title').innerText = newValue
    }
  }
}

customElements.define('app-bar', AppBar)
