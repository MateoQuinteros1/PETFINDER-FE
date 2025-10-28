import { state } from "../state";

class ResetPassword extends HTMLElement {
  shadowDom = this.attachShadow({ mode: "open" });

  constructor() {
    super();
    this.render();
  }

  render() {
    this.shadowDom.innerHTML = `
       <div class="view">
      <div class="form-cont">
        <img class="form__img" src="/candado.svg" />
        <h1 class="form__title">Reestablecer contraseña</h1>
        <h2 class="form__subtitle">
          Escribí a continuación tu <span>nueva contraseña</span> para
          reemplazarla por la anterior
        </h2>
        <form class="form">
        <div class="succes-cont">
        <p>Contraseña actualizada con éxito.</p>
        </div>
          <div class="error-cont">
            <p class="error-text">Las contraseñas deben coincidir.</p>
          </div>
          <div class="expired-cont">
            <p class="expired-text">🔒 El enlace para restablecer tu contraseña ha expirado. Solicitá uno nuevo para continuar.</p>
          </div>
          <div class="form__group">
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
          <div class="form__group">
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
          <button class="send">Actualizar contraseña</button>
        </form>
      <a class="goback" href="/login">← Volver a inicio de sesión</a>
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
        justify-content: center;
        align-items: center;
      }
      .form-cont {
        border-radius: 20px;
        background-color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 360px;
        padding: 10px;
        min-height: 400px;
      }

      .form__img {
        width: 60px;
      }

      .form__title {
        font-family: "Poppins";
        font-weight: 700;
        font-size: 24px;
        margin-bottom: 0;
        text-align: center;
      }

      span {
        font-weight: bold;
      }

      .form__subtitle {
        font-family: "Poppins";
        font-weight: 300;
        font-size: 15px;
        margin-top: 0;
        text-align: center;
      }

      .form {
        display: flex;
        flex-direction: column;
        justify-content: left;
        gap: 20px;
        margin-top: 25px;
        width: 100%;
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
      }
      .expired-cont {
        height: 65px;
        width: 100%;
        display: none;
        align-items: center;
        padding-left: 7px;
        background-color: #FFFF94;
        color: #757500;
        font-family: "Poppins";
        font-size: 14px;
        font-weight: 500;
        border: 2px solid #B3B300;
      }

      .form__group {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }

      .email-error {
        font-family: "Poppins";
        font-size: 13px;
        color: red;
        margin: 0;
        display: none;
      }

      label {
        font-family: "Poppins";
      }

      input {
        height: 45px;
        border-radius: 6px;
        border: none;
        background-color: #ededed;
        padding-left: 7px;
        font-size: 15px;
        font-family: "Poppins";
      }

      .send {
        border: none;
        border-radius: 6px;
        height: 50px;
        background-color: #45b39c;
        color: white;
        font-family: "Poppins";
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        box-shadow: 0 4px 15px rgba(53, 140, 53, 0.3);
      }

      .send:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(53, 140, 53, 0.4);
      }

      .goback {
        text-decoration: none;
        font-family: "Poppins";
        font-size: 13px;
        margin: 20px 0;
      }

      @media (min-width: 768px) {
        .form-cont {
          min-width: 680px;
          min-height: 680px;
        }

        .form__img {
          width: 90px;
        }

        .form {
          width: 570px;
        }
        .error-cont {
          height: 60px;
          font-size: 16px;
          display: none;
        }
        .succes-cont {
          height: 60px;
          font-size: 16px;
        }
        .expired-cont {
          height: 60px;
          font-size: 16px;
        }

        .form__title {
          font-size: 40px;
        }

        .form__subtitle {
          font-size: 18px;
        }

        label {
          font-size: 18px;
        }

        input {
          height: 60px;
          font-size: 18px;
          padding-left: 10px;
        }

        .email-error {
          font-size: 16px;
        }

        .send {
          height: 60px;
          font-size: 20px;
          margin-top: 20px;
        }

        .goback {
          font-size: 16px;
          margin: 45px 0;
        }
      }
    </style> 
    `;

    const form = this.shadowDom.querySelector(".form") as HTMLFormElement;
    const error = this.shadowDom.querySelector(".error-cont") as HTMLElement;
    const succes = this.shadowDom.querySelector(".succes-cont") as HTMLElement;
    const passwordInput = this.shadowDom.getElementById(
      "password"
    ) as HTMLInputElement;
    const confirmPasswordInput = this.shadowDom.getElementById(
      "confirm-password"
    ) as HTMLInputElement;

    const expiredToken = this.shadowDom.querySelector(
      ".expired-cont"
    ) as HTMLElement;

    confirmPasswordInput.addEventListener("input", () => {
      const pass = passwordInput.value.trim();
      const confirm = confirmPasswordInput.value.trim();
      if (confirm === "" && pass === "") {
        confirmPasswordInput.style.border = "";
        passwordInput.style.border = "";
        return;
      }

      if (confirm !== pass) {
        confirmPasswordInput.style.border = "2px solid red";
        passwordInput.style.border = "2px solid red";
      } else {
        confirmPasswordInput.style.border = "2px solid green";
        passwordInput.style.border = "2px solid green";
      }
    });

    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const pass = passwordInput.value.trim();
      const confirm = confirmPasswordInput.value.trim();

      if (pass !== confirm) {
        error.style.display = "flex";
        return;
      }

      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      state.resetPassword(token, pass).then((res) => {
        if (res === true) {
          succes.style.display = "flex";
          if (error.style.display === "flex") {
            error.style.display = "none";
          }
          return;
        }

        if (res === false) {
          expiredToken.style.display = "flex";
        }
      });
    });
  }
}

customElements.define("reset-password", ResetPassword);
