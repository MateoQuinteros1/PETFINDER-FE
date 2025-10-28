import { state } from "../state";
class ForgotPassword extends HTMLElement {
  shadowDom = this.attachShadow({ mode: "open" });

  constructor() {
    super();
    this.render();
  }

  connectedCallback() {
    state.geolocationIsEnabled();
  }

  render() {
    this.shadowDom.innerHTML = `
        <div class="view">
      <div class="form-cont">
        <img class="form__img" src="/candado.svg" />
        <h1 class="form__title">¿Olvidaste tu contraseña?</h1>
        <h2 class="form__subtitle">
          Ingresa tu correo electrónico y te enviaremos un enlace para
          reestablecer tu contraseña
        </h2>
        <form class="form">
          <div class="succes-cont">
            <p class="succes-text">✅ Correo enviado con éxito</p>
          </div>
          <div class="form__group">
            <label for="email">Correo electrónico</label>
            <input
              placeholder="tu@email.com"
              required
              name="email"
              id="email"
              type="email"
            />
            <p class="email-error">No existe una cuenta con ese correo</p>
          </div>
          <button class="send">Enviar enlace de recuperación</button>
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
          min-height: 550px;
        }

        .form__img {
          width: 90px;
        }

        .form {
          width: 570px;
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
        .succes-cont {
          height: 60px;
          font-size: 16px;
        }

        .send {
          height: 60px;
          font-size: 20px;
        }

        .goback {
          font-size: 16px;
          margin: 45px 0;
        }
      }
    </style>
    `;

    const getForm = this.shadowDom.querySelector(".form") as HTMLFormElement;
    const getEmailInput = this.shadowDom.querySelector(
      "#email"
    ) as HTMLInputElement;
    const getEmailError = this.shadowDom.querySelector(
      ".email-error"
    ) as HTMLElement;
    const getSuccesCont = this.shadowDom.querySelector(
      ".succes-cont"
    ) as HTMLElement;

    getForm.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const email = getEmailInput.value.trim();
      state.sendForgotPasswordEmail(email).then((res) => {
        if (res === false) {
          getEmailError.style.display = "initial";
        } else {
          getSuccesCont.style.display = "Flex";
          if (getEmailError.style.display === "initial") {
            getEmailError.style.display = "none";
          }
        }
      });
    });
  }
}

customElements.define("forgot-password", ForgotPassword);
