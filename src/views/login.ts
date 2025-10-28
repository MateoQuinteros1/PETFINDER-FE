import { state } from "../state";
import { Router } from "@vaadin/router";
class Login extends HTMLElement {
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
      <button class="goback">← Volver al inicio</button>
      <div class="form-cont">
        <h1 class="form__title">Iniciar sesión</h1>
        <h2 class="form__subtitle">Bienvenido de nuevo a Pet Finder</h2>
        <form class="form">
          <div class="error-cont">
            <p class="error-text">Email o contraseña incorrectos.</p>
          </div>
          <div class="form__group">
            <label for="email">Email</label>
            <input
              name="email"
              required
              placeholder="tu@email.com"
              id="email"
              type="text"
            />
          </div>
          <div class="form__group">
            <label for="password">Contraseña</label>
            <input
              name="password"
              required
              placeholder="Contraseña"
              id="password"
              type="password"
            />
          </div>
          <a href="/forgotpassword" class="forgot-password__link"
            >Olvidé mi contraseña</a
          >
          <button class="submit__btn">Acceder</button>
          <p class="no-account">
            ¿Todavía no tenes una cuenta? <a href="/signup">Registrate</a>
          </p>
        </form>
      </div>
    </div>
    <style>
      * {
        box-sizing: border-box;
      }

      .goback {
        position: fixed;
        top: 14px;
        left: 10px;
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
        min-width: 330px;
        padding: 20px;
      }

      .form__title {
        font-family: "Poppins";
        font-weight: 700;
        font-size: 36px;
        margin-bottom: 0;
      }

      .form__subtitle {
        font-family: "Poppins";
        font-weight: 300;
        font-size: 17px;
        margin-top: 0;
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

      .form__group {
        display: flex;
        flex-direction: column;
        gap: 5px;
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

      a {
        text-decoration: none;
      }

      .forgot-password__link {
        align-self: center;
        font-family: "Poppins";
        font-size: 13px;
        font-weight: 500;
      }

      .submit__btn {
        height: 55px;
        border: none;
        border-radius: 10px;
        background-color: #80a8ed;
        color: white;
        font-family: "Poppins";
        font-size: 17px;
        font-weight: 700;
      }

      .submit__btn:hover {
        filter: brightness(0.9);
        cursor: pointer;
      }

      .no-account {
        font-family: "Poppins";
        font-size: 13px;
        align-self: center;
      }

      @media (min-width: 768px) {
        .goback {
          height: 60px;
          width: 180px;
          font-size: 18px;
          top: 25px;
          left: 25px;
        }

        .form-cont {
          min-width: 580px;
        }

        .form__title {
          font-size: 42px;
        }

        .form__subtitle {
          font-size: 20px;
        }

        .error-cont {
          height: 60px;
          font-size: 16px;
        }
        label {
          font-size: 20px;
        }

        input {
          height: 60px;
          font-size: 18px;
          padding-left: 10px;
        }

        .forgot-password__link {
          font-size: 16px;
        }

        .submit__btn {
          height: 70px;
          font-size: 19px;
        }

        .no-account {
          font-size: 16px;
        }
      }
    </style>`;

    const getForm = this.shadowDom.querySelector(".form") as HTMLFormElement;
    const getErrorEl = this.shadowDom.querySelector(
      ".error-cont"
    ) as HTMLElement;
    const goBackButton = this.shadowDom.querySelector(".goback") as HTMLElement;
    getForm.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const formData = new FormData(getForm);
      const data = {
        email: formData.get("email"),
        password: formData.get("password"),
      };
      const res = await state.logInUser(data);
      if (res === false) {
        getErrorEl.style.display = "flex";
      } else {
        Router.go("/lostpets");
      }
    });

    goBackButton.addEventListener("click", () => {
      Router.go("/lostpets");
    });
  }
}

customElements.define("login-page", Login);
