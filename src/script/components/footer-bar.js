class FooterBar extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    this.innerHTML = `
        <style>
            footer {
                font-size: 14px;
            }
        </style>
            <p>This Project's is for Dicoding Submission: Membangun Notes App</p>
            <i>- Jihan Zulfa -</i>
        `
  }
}

customElements.define('footer-bar', FooterBar)
