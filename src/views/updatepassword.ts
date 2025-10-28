import { Router } from "@vaadin/router";
import { state } from "../state";

class UpdatePassword extends HTMLElement {
  shadowDom = this.attachShadow({ mode: "open" });
  constructor() {
    super();
    this.render();
  }

  render() {
    this.shadowDom.innerHTML = `
        <div class="view">
      <header-comp></header-comp>
      <div class="main-cont">
        <button class="goback">← Mis datos</button>
        <h1 class="title">Contraseña</h1>
        <form class="form">
          <div class="succes-cont">
            <p>Contraseña actualizada con éxito ✅</p>
          </div>
          <div class="error-cont">
            <p>Error al actualizar la contraseña ❌</p>
          </div>
          <div class="group">
            <label for="password">Contraseña</label>
            <input
              placeholder="Nueva contraseña"
              required
              name="password"
              id="password"
              type="password"
              pattern="^[^\s]{6,20}$"
              title="Debe contener entre 6 y 20 caracteres, y sin espacios"
            />
          </div>
          <div class="group">
            <label for="confirm-password">Confirmar contraseña</label>
            <input
              placeholder="Confirmá tu contraseña"
              required
              name="confirm-password"
              id="confirm-password"
              type="password"
              pattern="^[^\s]{6,20}$"
              title="Debe contener entre 6 y 20 caracteres, y sin espacios"
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
        margin-top: 60px;
        display: flex;
        flex-direction: column;
        gap: 30px;
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

      input {
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
          margin-top: 120px;
          gap: 50px;
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

        input {
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
            margin-top: 40px;
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

          input {
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

    const goback = this.shadowDom.querySelector(".goback") as HTMLElement;
    const form = this.shadowDom.querySelector(".form") as HTMLFormElement;
    const password = this.shadowDom.getElementById(
      "password"
    ) as HTMLInputElement;
    const confirmpassword = this.shadowDom.getElementById(
      "confirm-password"
    ) as HTMLInputElement;

    const succes = this.shadowDom.querySelector(".succes-cont") as HTMLElement;
    const error = this.shadowDom.querySelector(".error-cont") as HTMLElement;

    goback.addEventListener("click", () => {
      Router.go("/userdata");
    });

    confirmpassword.addEventListener("input", () => {
      const pass = password.value.trim();
      const confirm = confirmpassword.value.trim();
      if (confirm === "" && pass === "") {
        confirmpassword.style.border = "";
        password.style.border = "";
        return;
      }

      if (confirm !== pass) {
        confirmpassword.style.border = "2px solid red";
        password.style.border = "2px solid red";
      } else {
        confirmpassword.style.border = "2px solid green";
        password.style.border = "2px solid green";
      }
    });

    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const pass = password.value.trim();
      const confirm = confirmpassword.value.trim();

      succes.style.display = "none";
      error.style.display = "none";

      if (pass !== confirm) {
        alert("Las contraseñas deben coincidir");
        return;
      }

      state
        .updatePassword(pass)
        .then(() => {
          succes.style.display = "flex";
        })
        .catch(() => {
          error.style.display = "flex";
        });
    });
  }
}

customElements.define("update-password", UpdatePassword);
