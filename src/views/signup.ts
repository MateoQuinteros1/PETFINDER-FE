import { Router } from "@vaadin/router";
import { state } from "../state";
class SignUp extends HTMLElement {
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
      <button class="goback">< Volver al inicio</button>
      <div class="form-cont">
        <h1 class="form__title">Registrarse</h1>
        <h2 class="form__subtitle">Completá los siguientes datos</h2>
        <form class="form">
        <div class="error-cont">
            <p class="error-text">Las contraseñas deben coincidir.</p>
          </div>
          <div class="form__group">
            <label for="name">Nombre</label>
            <input
              placeholder="Tu nombre"
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
          <div class="form__group">
            <label for="email">Email</label>
            <input
              name="email"
              required
              placeholder="tu@email.com"
              id="email"
              type="email"
            />
            <p class="email-error">Ya existe una cuenta con este correo</p>
          </div>
          <div class="form__group">
            <label for="password">Contraseña</label>
            <input
              name="password"
              required
              placeholder="Contraseña"
              id="password"
              type="password"
              pattern="^[^\s]{6,20}$"
              title="Debe contener entre 6 y 20 caracteres, y sin espacios"
            />
          </div>
          <div class="form__group">
            <label for="confirm-password">Confirmar contraseña</label>
            <input
              required
              id="confirm-password"
              name="confirm-password"
              placeholder="Confirmá tu contraseña"
              type="password"
              pattern="^[^\s]{6,20}$"
              title="Debe contener entre 6 y 20 caracteres, y sin espacios"
            />
          </div>
          <button class="submit__btn">Registro</button>
          <p class="existent-account">
            ¿Ya tenés una cuenta? <a href="/login">Iniciar sesión</a>
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
        min-height: 100vh;
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
        margin-top: 60px;
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

      .email-error{
        margin:0;
        font-family:"Poppins";
        font-size:13px;
        color:red;
        display:none;      
      }

      a {
        text-decoration: none;
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

      .existent-account {
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

        .submit__btn {
          height: 70px;
          font-size: 19px;
        }

        .existent-account {
          font-size: 16px;
        }
      }
    </style>
    `;

    const getForm = this.shadowDom.querySelector(".form") as HTMLFormElement;
    const nameInput = this.shadowDom.querySelector("#name") as HTMLInputElement;
    const emailInput = this.shadowDom.querySelector(
      "#email"
    ) as HTMLInputElement;
    const passwordInput = this.shadowDom.querySelector(
      "#password"
    ) as HTMLInputElement;
    const confirmPasswordInput = this.shadowDom.querySelector(
      "#confirm-password"
    ) as HTMLInputElement;

    const getErrorEl = this.shadowDom.querySelector(
      ".error-cont"
    ) as HTMLElement;

    const emailError = this.shadowDom.querySelector(
      ".email-error"
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

    getForm.addEventListener("submit", (ev) => {
      ev.preventDefault();

      const password = passwordInput.value.trim();
      const confirm = confirmPasswordInput.value.trim();
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();

      if (password !== confirm) {
        getErrorEl.style.display = "flex";
        return;
      }

      const data = { name, email, password };
      state.signUpUser(data).then((res) => {
        if (res === false) {
          emailError.style.display = "initial";
        } else {
          Router.go("/login");
        }
      });
    });
  }
}

customElements.define("sign-up", SignUp);
