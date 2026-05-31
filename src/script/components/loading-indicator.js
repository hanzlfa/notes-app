// loading-indicator.js
class LoadingIndicator extends HTMLElement {
  constructor() {
    super()
    this.innerHTML = `
            <style>
                .loading-indicator {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background-color: rgba(0, 0, 0, 0.6);
                    color: white;
                    padding: 12px 20px;
                    border-radius: 5px;
                    font-size: 16px;
                    display: none;
                    z-index: 1000;
                }
            </style>
            <div class="loading-indicator">
                <span class="loading-text">Loading...</span>
            </div>
        `
  }

  show() {
    this.querySelector('.loading-indicator').style.display = 'block'
  }

  hide() {
    this.querySelector('.loading-indicator').style.display = 'none'
  }
}

customElements.define('loading-indicator', LoadingIndicator)
