import { Auth, define, DropdownElement, Events, Observer } from "@calpoly/mustang";
import { LitElement, css, html } from "lit";
import { property } from "lit/decorators.js";

export class NavHeaderElement extends LitElement {
    static uses = define({
        "drop-down": DropdownElement
      });
    
    @property()
    username = "anonymous";

    render() {
    return html`
    <header>
        <nav class='nav'>
            <a href="/" class="logo">FESTIVOUS</a>
            <a href="/festival.html">FESTIVALS</a>
            <a href="/rendezvous.html">RENDEZVOUS</a>
            <a href="/group.html">GROUPS</a>
            <a href="/login.html" class="right" id="profile-link">PROFILE</a>
            <drop-down class="right">
                <a name="greeting" slot="actuator"
                    >HELLO, ${this.username}</a>
                <ul>
                    <li>
                    <label @change=${toggleLightMode}>
                        <input type="checkbox" autocomplete="off" />
                        LIGHT MODE
                    </label>
                    </li>
                <li><a href="/profile">PROFILE</a></li>
                <li><a href="#" @click=${signOutUser}>SIGN OUT</a></li>
                </ul>
            </drop-down>
        </nav>
    </header>
    `;
    }

    static styles = css`
        :host {
            display: contents;
        }
        .nav{
            display: block;
            a, drop-down {
                padding: var(--body-margin);
                font-family: "Pontano Sans", sans-serif;
                text-decoration: none;
                color: var(--color-font-primary);
                font-weight: var(--font-weight-body);
                font-size: var(--font-size-med);
                cursor: pointer;
            }
            .logo {
                font-family: "Prompt", sans-serif;
                font-weight: var(--font-weight-xlarge);
                font-size: var(--font-size-large);
            }
            .right{
                float: right;
                margin-top: var(--margin-size-neg);
            }
        }
    `;

    _authObserver = new Observer<Auth.Model>(
        this,
        "festivous:auth"
      );

    connectedCallback() {
        super.connectedCallback();
        this._authObserver.observe(({ user }) => {
        if (user) {
            this.username = user.username;
        }
        });
    }
}

type Checkbox = HTMLInputElement & { checked: boolean };

function toggleLightMode(ev: InputEvent) {
  const target = ev.target as Checkbox;
  const checked = target.checked;

  Events.relay(ev, "light-mode", { checked });
}

function signOutUser(ev: Event) {
  Events.relay(ev, "auth:message", ["auth/signout"]);
}