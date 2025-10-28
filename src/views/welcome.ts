import { Router } from "@vaadin/router";

class Welcome extends HTMLElement {
  shadowDom = this.attachShadow({ mode: "open" });
  constructor() {
    super();
    this.render();
  }

  render() {
    this.shadowDom.innerHTML = `
    <div class="elements-cont">
      <img src="/get-user-location-image.svg" />
      <div class="text-cont">
        <h1 class="title">Pet Finder App</h1>
        <p class="description">
          Encontrá y reportá mascotas perdidas cerca de tu ubicación
        </p>
      </div>
      <div class="buttons-cont">
        <button class="give-location">Comenzar</button>
        <button class="petfinder-info">¿Cómo funciona Pet Finder?</button>
      </div>
    </div>
    <style>
      * {
        box-sizing: border-box;
      }

      .elements-cont {
        height: 100vh;
        background: linear-gradient(#ffffff, #def4f0);
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 45px;
      }

      img {
        width: 215px;
        height: 235px;
      }

      .text-cont {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-family: "Poppins";
      }

      .title {
        font-size: 36px;
        font-weight: 700;
        color: #eb6372;
      }

      .description {
        text-align: center;
        font-size: 24px;
        font-weight: 400;
        margin-top: 0;
        margin-bottom: 20px;
      }

      .buttons-cont {
        display: flex;
        flex-direction: column;
        gap: 25px;
      }

      .give-location {
        width: 270px;
        height: 50px;
        background-color: #5a8fec;
        border: none;
        border-radius: 4px;
        color: white;
        font-family: "Roboto";
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        transition: transform 0.2s ease;
      }

      .petfinder-info {
        width: 270px;
        height: 50px;
        background-color: #00a884;
        border: none;
        border-radius: 4px;
        color: white;
        font-family: "Roboto";
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        transition: transform 0.2s ease;
      }
      button:hover {
        transform: scale(1.03);
      }

      @media (min-width: 728px) {

      .elements-cont{
      padding-top:95px;
      }
        img {
          height: 335px;
          width: 355px;
        }

        .title {
          font-size: 45px;
        }

        .description {
          font-size: 29px;
          margin-bottom: 50px;
        }

        .give-location {
          width: 380px;
          height: 70px;
          font-size: 20px;
        }

        .petfinder-info {
          width: 380px;
          height: 70px;
          font-size: 20px;
        }
      }
    </style>`;

    const giveLocationButton = this.shadowDom.querySelector(
      ".give-location"
    ) as HTMLElement;

    const petFinderInfoButton = this.shadowDom.querySelector(
      ".petfinder-info"
    ) as HTMLElement;

    giveLocationButton.addEventListener("click", () => {
      Router.go("/getuserlocation");
    });

    petFinderInfoButton.addEventListener("click", () => {
      Router.go("/petfinderinfo");
    });
  }
}

customElements.define("welcome-page", Welcome);
