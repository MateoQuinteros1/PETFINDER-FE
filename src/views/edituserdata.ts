import { Router } from "@vaadin/router";
import { state } from "../state";

class EditUserData extends HTMLElement {
  shadowDom = this.attachShadow({ mode: "open" });
  userName: string = "";
  constructor() {
    super();
    this.syncWithState();
    state.subscribe(() => {
      this.syncWithState();
    });
  }

  syncWithState() {
    const getCurrentState = state.getState();
    this.userName = getCurrentState.userName;
    this.render();
  }

  connectedCallback() {
    state.geolocationIsEnabled();
    state.isUserLoggedIn().then((res) => {
      if (res === false) {
        Router.go("login");
      }
    });
  }

  render() {
    this.shadowDom.innerHTML = `
    <div class="view">
      <header-comp></header-comp>
      <div class="main-cont">
        <button class="goback">< Mis datos</button>
        <h1 class="title">Datos Personales</h1>
        <form class="form">
          <div class="group">
            <div class="succes-cont">
              <p>Nombre actualizado con éxito ✅</p>
            </div>
            <div class="error-cont">
              <p>Error al actualizar los datos ❌</p>
            </div>
            <label for="name">NOMBRE</label>
            <input
              placeholder="Tu nombre: ${this.userName}"
              required
              name="name"
              id="name"
              type="text"
              minlength="3"
              maxlength="15"
              pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+"
              title="Solo se permiten letras (3 a 15 caracteres)"
            />
          </div>
          <button class="update">Guardar</button>
        </form>
      </div>
    </div>
    <style>
      * {
        box-sizing: border-box;
        font-family: "Poppins";
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
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .goback {
        align-self: start;
        margin: 10px;
        background-color: #80a8ed;
        border: none;
        border-radius: 5px;
        height: 30px;
        width: 120px;
        color: white;
        font-family: "Poppins";
        cursor: pointer;
      }

      .goback:hover {
        filter: brightness(0.9);
      }

      .title {
        font-size: 36px;
        margin-top: 55px;
      }

      .form {
        margin-top: 100px;
        display: flex;
        flex-direction: column;
        gap: 100px;
        width: 300px;
      }

      .succes-cont {
        height: 50px;
        width: 100%;
        display: none;
        align-items: center;
        padding-left: 7px;
        background-color: #a8ffaa;
        color: green;
        font-family: "Poppins";
        font-size: 14px;
        font-weight: 500;
        border: 1px solid green;
        margin-bottom: 10px;
      }
      .error-cont {
        height: 50px;
        width: 100%;
        display: none;
        align-items: center;
        padding-left: 7px;
        background-color: #ffcfcf;
        color: #d62020;
        font-family: "Poppins";
        font-size: 14px;
        font-weight: 500;
        border: 1px solid #d62020;
        margin-bottom: 10px;
      }

      .group {
        display: flex;
        flex-direction: column;
      }

      #name {
        height: 50px;
        border-radius: 4px;
        font-size: 16px;
        padding-left: 7px;
        border: 1px solid;
      }

      .update {
        height: 50px;
        border: none;
        background-color: #5a8fec;
        border-radius: 7px;
        color: white;
        font-size: 16px;
        font-weight: 500;
      }

      .update:hover {
        cursor: pointer;
        filter: brightness(0.9);
      }

      @media (min-width: 728px) {
        .goback {
          height: 40px;
          width: 160px;
          font-size: 17px;
        }
        .title {
          font-size: 45px;
        }
        .form {
          margin-top: 200px;
          width: 350px;
        }

        .succes-cont {
          height: 65px;
          font-size: 16px;
        }
        .error-cont {
          height: 65px;
          font-size: 16px;
        }

        #name {
          height: 60px;
          font-size: 18px;
        }

        .update {
          height: 60px;
        }

        @media (min-width: 1150px) {
          .goback {
            height: 60px;
            width: 180px;
            font-size: 19px;
          }
          .title {
            font-size: 60px;
          }
          .form {
            width: 500px;
          }

          .succes-cont {
            height: 80px;
            font-size: 20px;
            padding-left: 13px;
          }
          .error-cont {
            height: 80px;
            font-size: 20px;
            padding-left: 13px;
          }

          #name {
            height: 80px;
            font-size: 23px;
            padding-left: 12px;
          }

          .update {
            height: 80px;
            font-size: 20px;
          }
        }
      }
    </style>
    `;

    const form = this.shadowDom.querySelector(".form") as HTMLFormElement;
    const nameInput = this.shadowDom.querySelector("#name") as HTMLInputElement;
    const submitButton = this.shadowDom.querySelector(".update") as HTMLElement;
    const goBack = this.shadowDom.querySelector(".goback") as HTMLElement;
    const error = this.shadowDom.querySelector(".error-cont") as HTMLElement;
    const succes = this.shadowDom.querySelector(".succes-cont") as HTMLElement;

    goBack.addEventListener("click", () => {
      Router.go("/userdata");
    });

    nameInput.addEventListener("input", () => {
      const name = nameInput.value.trim();
      if (name === this.userName) {
        submitButton.style.pointerEvents = "none";
        submitButton.style.opacity = "0.5";
      } else {
        submitButton.style.pointerEvents = "";
        submitButton.style.opacity = "1";
      }
    });

    form.addEventListener("submit", (ev) => {
      ev.preventDefault();

      error.style.display = "none";
      succes.style.display = "none";

      const name = nameInput.value.trim();
      state
        .updateUserData(name)
        .then(() => {
          succes.style.display = "flex";
        })
        .catch(() => {
          error.style.display = "flex";
        });
    });
  }
}

customElements.define("edit-user-data", EditUserData);
