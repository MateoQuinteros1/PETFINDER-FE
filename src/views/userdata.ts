import { Router } from "@vaadin/router";
import { state } from "../state";
class UserData extends HTMLElement {
  shadowDom = this.attachShadow({ mode: "open" });
  userEmail: string = "";
  constructor() {
    super();
    this.syncWithState();
    state.subscribe(() => {
      this.syncWithState();
    });
  }

  connectedCallback() {
    state.geolocationIsEnabled();
    state.isUserLoggedIn().then((res) => {
      if (res === false) {
        Router.go("/login");
      }
    });
  }

  syncWithState() {
    const getCurrentState = state.getState();
    console.log(getCurrentState);
    this.userEmail = getCurrentState.userEmail;
    this.render();
  }

  render() {
    this.shadowDom.innerHTML = `
    <div class="view">
      <header-comp></header-comp>
      <div class="main-cont">
        <h1 class="title">Mis datos</h1>
        <div class="buttons-cont">
          <button href="/edituserdata" id="update-data">Modificar datos personales</button>
          <button href="/updatepassword" id="update-password">Modificar contraseña</button>
        </div>
        <div class="email-cont">
          <p class="email">${this.userEmail}</p>
          <a class="logout">Cerrar sesión</a>
        </div>
      </div>
    </div>
    <style>
      * {
        box-sizing: border-box;
      }

      .view {
        height: 100vh;
        width: 100%;
        background-color: #def4f0;
        display: flex;
        flex-direction: column;
      }

      .main-cont {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
      }

      .title {
        font-family: "Poppins";
        font-size: 38px;
      }

      .buttons-cont {
        display: flex;
        flex-direction: column;
        gap: 25px;
      }

      button {
        height: 50px;
        width: 335px;
        background-color: #5a8fec;
        border: none;
        border-radius: 7px;
        color: white;
        font-family: "Poppins";
        font-weight: 500;
        font-size: 15px;
      }

      button:hover {
        cursor: pointer;
        filter: brightness(0.9);
      }

      .email-cont {
        font-family: "Poppins";
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .email {
        font-size: 17px;
      }

      .logout {
        color: blue;
        text-decoration: underline;
        cursor:pointer;
      }

      .logout:hover{
      filter:brightness(0.5);
      }

      @media (min-width: 728px) {
        .title {
          font-size: 45px;
        }

        button {
          width: 420px;
          height: 70px;
          font-size: 18px;
        }

        .email {
          font-size: 20px;
        }

        .logout {
          font-size: 18px;
        }

        @media (min-width: 1268px) {
          .title {
            font-size: 55px;
          }

          button {
            height: 90px;
            width: 550px;
            font-size: 23px;
          }

          .email {
            font-size: 22px;
          }

          .logout {
            font-size: 20px;
          }
        }
      }
    </style>
    `;

    const updateData = this.shadowDom.querySelector(
      "#update-data"
    ) as HTMLElement;

    const updatePassword = this.shadowDom.querySelector(
      "#update-password"
    ) as HTMLElement;

    const logout = this.shadowDom.querySelector(".logout") as HTMLElement;

    updateData.addEventListener("click", () => {
      Router.go("/edituserdata");
    });

    updatePassword.addEventListener("click", () => {
      Router.go("/updatepassword");
    });

    logout.addEventListener("click", () => {
      state.logOutUser();
    });
  }
}

customElements.define("user-data", UserData);
