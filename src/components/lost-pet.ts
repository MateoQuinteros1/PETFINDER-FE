import { state, type ReportPet } from "../state";

export class LostPet extends HTMLElement {
  shadowDom = this.attachShadow({ mode: "open" });
  petImageURL: string;
  petName: string;
  petLocation: string;
  petId: number;

  constructor(
    petId: number,
    petImageURL: string,
    petName: string,
    petLocation: string
  ) {
    super();
    this.petId = petId;
    this.petImageURL = petImageURL;
    this.petName = petName;
    this.petLocation = petLocation;
    this.setAttribute("id", String(this.petId));
    this.render();
  }

  render() {
    this.shadowDom.innerHTML = `
   <div class="card">
      <img class="card__img" src="${this.petImageURL}" />
      <div class="card__elements-cont">
        <div class="info">
          <p class="pet-name">${this.petName}</p>
          <p class="pet-location">${this.petLocation}</p>
        </div>
        <button class="report">Reportar 🚨</button>
      </div>
    </div>
    
    <div class="form-cont">
      <img class="close-form" src="/close-dropdown-menu.svg" />
      <h1 class="form__title">
        Reportar info <br />
        de ${this.petName}
      </h1>
      <form class="form">
        <div class="form__group">
          <label for="name">NOMBRE</label>
          <input required name="reporter_name" id="name" type="text" />
        </div>
        <div class="form__group">
          <label for="phone_number">TELÉFONO</label>
          <input required name="reporter_phone_number" id="phone_number" type="text" />
        </div>
        <div class="form__group">
          <label for="report_info">¿DÓNDE LO/LA VISTE?</label>
          <textarea required name="report_info" id="report_info"></textarea>
        </div>
        <button class="send_form" type="submit">
          <span class="button-text">Enviar información</span>
          <span class="loader hidden"></span>
          <span class="success-icon hidden">✓</span>
        </button>
      </form>
      
      <!-- Mensaje de éxito -->
      <div class="success-message hidden">
        <div class="success-icon-large">✓</div>
        <h2>¡Reporte enviado con éxito!</h2>
        <p>Gracias por ayudar a encontrar a ${this.petName}</p>
      </div>
    </div>
    
    <style>
      * {
        box-sizing: border-box;
      }

      .card {
        background-color: #26302e;
        width: 335px;
        height: 234px;
        border-radius: 10px;
        padding: 6px;
        display: flex;
        flex-direction: column;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }

      .card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        cursor: pointer;
      }

      .card__img {
        min-height: 137px;
        border-radius: 3px;
        width: 100%;
        object-fit: cover;
      }

      .card__elements-cont {
        display: flex;
        justify-content: space-between;
        padding: 0 9px;
      }

      .pet-name {
        margin-top: 6px;
        margin-bottom: 0;
        font-family: "Poppins";
        font-weight: 700;
        color: white;
        font-size: 36px;
        max-width: 174px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      .pet-location {
        margin-top: 3px;
        margin-bottom: 0;
        font-family: "Roboto";
        color: white;
        font-weight: 400;
        max-width: 183px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      .report {
        width: 120px;
        height: 40px;
        background-color: #eb6372;
        border: none;
        border-radius: 4px;
        font-family: "Roboto";
        font-weight: 400;
        color: white;
        font-size: 16px;
        align-self: center;
        transition: opacity 0.3s ease;
      }

      .report:hover {
        cursor: pointer;
        opacity: 0.7;
      }

      @media (min-width: 500px) {
        .card {
          width: 450px;
          height: 300px;
        }

        .pet-name {
          font-size: 40px;
          max-width: 270px;
        }

        .pet-location {
          max-width: 290px;
          font-size: 18px;
        }
        .report {
          height: 60px;
          width: 140px;
          font-size: 18px;
        }
      }

      @media (min-width: 700px) {
        .card {
          width: 580px;
          height: 350px;
        }
        .pet-name {
          max-width: 350px;
        }

        .pet-location {
          max-width: 370px;
        }

        .report {
          height: 60px;
          width: 160px;
          font-size: 19px;
        }
      }

      @media (min-width: 1000px) {
        .card {
          width: 760px;
          height: 430px;
        }
        .pet-name {
          max-width: 510px;
        }

        .pet-location {
          max-width: 520px;
          font-size: 19px;
        }

        .report {
          height: 65px;
          width: 180px;
          margin-top: 10px;
          font-size: 20px;
        }
      }

      .form-cont {
        display: flex;
        width: 314px;
        background-color: #2c3e50;
        border-radius: 10px;
        flex-direction: column;
        padding: 20px;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) translateY(-30px);
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.4s ease, transform 0.4s ease;
        z-index: 1000;
        max-height: 90vh;
        overflow-y: auto;
      }

      .form-cont.visible {
        opacity: 1;
        visibility: visible;
        transform: translate(-50%, -50%) translateY(0);
      }

      .close-form {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 20px;
        z-index: 10;
      }

      .close-form:hover {
        cursor: pointer;
        opacity: 0.8;
      }

      .form__title {
        font-family: "Poppins";
        font-weight: 700;
        font-size: 36px;
        color: white;
        text-align: center;
        max-width: 274px;
        align-self: center;
        line-height: 1.2;
      }

      form {
        display: flex;
        flex-direction: column;
        gap: 25px;
      }

      .form__group {
        display: flex;
        flex-direction: column;
        width: 100%;
      }

      label {
        font-family: "Poppins";
        font-weight: 400;
        font-size: 16px;
        color: white;
      }

      input {
        background-color: #4a5553;
        border: none;
        border-radius: 4px;
        min-height: 50px;
        font-family: "Poppins";
        color: white;
        font-size: 16px;
        padding-left: 8px;
      }

      textarea {
        background-color: #4a5553;
        border: none;
        border-radius: 4px;
        min-height: 131px;
        font-family: "Poppins";
        color: white;
        font-size: 16px;
        padding: 8px;
        resize: none;
      }

      .send_form {
        height: 50px;
        background-color: #00a884;
        border: none;
        border-radius: 4px;
        color: white;
        font-family: "Roboto";
        font-weight: 500;
        font-size: 16px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.3s ease, opacity 0.3s ease;
      }

      .send_form:hover:not(:disabled) {
        opacity: 0.8;
        cursor: pointer;
      }

      .send_form:disabled {
        cursor: not-allowed;
        opacity: 0.7;
      }

      /* LOADING SPINNER */
      .loader {
        width: 20px;
        height: 20px;
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      /* SUCCESS ICON EN BOTÓN */
      .success-icon {
        font-size: 24px;
        color: white;
        animation: checkmark 0.5s ease;
      }

      @keyframes checkmark {
        0% {
          transform: scale(0);
        }
        50% {
          transform: scale(1.2);
        }
        100% {
          transform: scale(1);
        }
      }

      /* HIDDEN CLASS */
      .hidden {
        display: none !important;
      }

      /* MENSAJE DE ÉXITO */
      .success-message {
        text-align: center;
        padding: 20px;
        animation: fadeIn 0.5s ease;
      }

      .success-message.hidden {
        display: none;
      }

      .success-icon-large {
        width: 80px;
        height: 80px;
        background-color: #00a884;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 50px;
        color: white;
        margin: 0 auto 20px;
        animation: successPop 0.6s ease;
      }

      @keyframes successPop {
        0% {
          transform: scale(0);
          opacity: 0;
        }
        50% {
          transform: scale(1.1);
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }

      .success-message h2 {
        color: white;
        font-family: "Poppins";
        font-size: 24px;
        margin-bottom: 10px;
      }

      .success-message p {
        color: rgba(255, 255, 255, 0.8);
        font-family: "Roboto";
        font-size: 16px;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* LOADING STATE - Deshabilitar inputs */
      .form.loading input,
      .form.loading textarea {
        opacity: 0.6;
        pointer-events: none;
      }

      @media (min-width: 500px) {
        .form-cont {
          width: 380px;
        }

        .form__title {
          max-width: 320px;
          font-size: 38px;
        }

        .success-icon-large {
          width: 100px;
          height: 100px;
          font-size: 60px;
        }

        .success-message h2 {
          font-size: 28px;
        }

        .success-message p {
          font-size: 18px;
        }
      }

      @media (min-width: 700px) {
        .form-cont {
          width: 580px;
        }

        .form__title {
          max-width: 570px;
          font-size: 42px;
        }

        input {
          height: 60px;
          font-size: 18px;
        }

        .send_form {
          height: 60px;
          font-size: 18px;
        }

        textarea {
          font-size: 18px;
        }

        .loader {
          width: 24px;
          height: 24px;
          border-width: 4px;
        }

        .success-icon {
          font-size: 28px;
        }
      }
    </style>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    const reportButtonEl = this.shadowDom.querySelector(
      ".report"
    ) as HTMLElement;
    const formContainerEl = this.shadowDom.querySelector(
      ".form-cont"
    ) as HTMLElement;
    const closeFormEl = this.shadowDom.querySelector(
      ".close-form"
    ) as HTMLElement;
    const cardEl = this.shadowDom.querySelector(".card") as HTMLElement;
    const formEl = this.shadowDom.querySelector(".form") as HTMLFormElement;
    const sendButtonEl = this.shadowDom.querySelector(
      ".send_form"
    ) as HTMLButtonElement;
    const buttonTextEl = this.shadowDom.querySelector(
      ".button-text"
    ) as HTMLElement;
    const loaderEl = this.shadowDom.querySelector(".loader") as HTMLElement;
    const successIconEl = this.shadowDom.querySelector(
      ".success-icon"
    ) as HTMLElement;
    const successMessageEl = this.shadowDom.querySelector(
      ".success-message"
    ) as HTMLElement;

    // Abrir formulario
    reportButtonEl.addEventListener("click", () => {
      formContainerEl.classList.add("visible");
      cardEl.style.pointerEvents = "none";
    });

    // Cerrar formulario
    closeFormEl.addEventListener("click", () => {
      this.closeForm(formContainerEl, cardEl, formEl, successMessageEl);
    });

    // Enviar formulario
    formEl.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Mostrar loading
      this.showLoading(sendButtonEl, buttonTextEl, loaderEl, formEl);

      try {
        const formData = new FormData(formEl);
        const obj = Object.fromEntries(formData.entries());
        const requestData = { ...obj, pet_id: Number(this.petId) } as ReportPet;

        // Llamada asíncrona
        await state.reportLostPet(requestData);

        // Mostrar éxito
        this.showSuccess(
          sendButtonEl,
          buttonTextEl,
          loaderEl,
          successIconEl,
          formEl,
          successMessageEl
        );

        // Cerrar automáticamente después de 3 segundos
        setTimeout(() => {
          this.closeForm(formContainerEl, cardEl, formEl, successMessageEl);
        }, 3000);
      } catch (error) {
        // Manejar error
        this.showError(sendButtonEl, buttonTextEl, loaderEl, formEl);
        console.error("Error al reportar mascota:", error);
      }
    });
  }

  showLoading(
    button: HTMLButtonElement,
    buttonText: HTMLElement,
    loader: HTMLElement,
    form: HTMLFormElement
  ) {
    button.disabled = true;
    buttonText.classList.add("hidden");
    loader.classList.remove("hidden");
    form.classList.add("loading");
  }

  showSuccess(
    button: HTMLButtonElement,
    buttonText: HTMLElement,
    loader: HTMLElement,
    successIcon: HTMLElement,
    form: HTMLFormElement,
    successMessage: HTMLElement
  ) {
    loader.classList.add("hidden");
    successIcon.classList.remove("hidden");
    button.style.backgroundColor = "#00a884";
    form.classList.remove("loading");

    // Después de 1 segundo, mostrar mensaje completo
    setTimeout(() => {
      form.classList.add("hidden");
      successMessage.classList.remove("hidden");
    }, 1000);
  }

  showError(
    button: HTMLButtonElement,
    buttonText: HTMLElement,
    loader: HTMLElement,
    form: HTMLFormElement
  ) {
    button.disabled = false;
    loader.classList.add("hidden");
    buttonText.classList.remove("hidden");
    buttonText.textContent = "Error. Intentar de nuevo";
    button.style.backgroundColor = "#eb6372";
    form.classList.remove("loading");

    // Restaurar texto original después de 3 segundos
    setTimeout(() => {
      buttonText.textContent = "Enviar información";
      button.style.backgroundColor = "#00a884";
    }, 3000);
  }

  closeForm(
    formContainer: HTMLElement,
    card: HTMLElement,
    form: HTMLFormElement,
    successMessage: HTMLElement
  ) {
    formContainer.classList.remove("visible");
    card.style.pointerEvents = "initial";

    // Resetear formulario y estados después de cerrar
    setTimeout(() => {
      form.reset();
      form.classList.remove("hidden");
      successMessage.classList.add("hidden");

      const button = this.shadowDom.querySelector(
        ".send_form"
      ) as HTMLButtonElement;
      const buttonText = this.shadowDom.querySelector(
        ".button-text"
      ) as HTMLElement;
      const loader = this.shadowDom.querySelector(".loader") as HTMLElement;
      const successIcon = this.shadowDom.querySelector(
        ".success-icon"
      ) as HTMLElement;

      button.disabled = false;
      buttonText.classList.remove("hidden");
      buttonText.textContent = "Enviar información";
      loader.classList.add("hidden");
      successIcon.classList.add("hidden");
      button.style.backgroundColor = "#00a884";
    }, 400); // Esperar a que termine la animación de cierre
  }
}

customElements.define("lost-pet", LostPet);
