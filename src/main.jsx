import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

function defineWebComponent(name, Component) {
    customElements.define(
        name,
        class extends HTMLElement {
            root

            constructor() {
                super()
                this.root = createRoot(this)
            }

            connectedCallback() {

                const username = this.getAttribute('username');
                
                this.root.render(
                    <App username={username} />
                )
            }

            disconnectedCallback() {
                this.root.unmount()
            }
        }
    )
}

defineWebComponent('app-root', App)

/*createRoot(document.getElementById('root')).render(
    <App />
)*/
