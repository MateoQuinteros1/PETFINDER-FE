import { Router } from "@vaadin/router";

class PetFinderInfo extends HTMLElement {
  shadowDom = this.attachShadow({ mode: "open" });

  constructor() {
    super();
    this.render();
  }

  render() {
    this.shadowDom.innerHTML = `
        <div class="view">
      <button class="goback"><</button>
      <div class="presentation-cont">
        <img src="/track-cat-svgrepo-com.svg" class="logo" />
        <div class="text-cont">
          <h1 class="title">Pet Finder</h1>
          <h2 class="subtitle">Reuniendo familias con sus mascotas perdidas</h2>
        </div>
      </div>
      <div class="boxes-cont">
        <div class="box">
          <div class="box__img">📍</div>
          <div class="box__text-cont">
            <h1 class="box__title">Reporta mascotas perdidas</h1>
            <p class="box__text">
              Publica información con foto y ubicación para que la comunidad te
              ayude a encontrarla.
            </p>
          </div>
        </div>
        <div class="box">
          <div class="box__img">👀</div>
          <div class="box__text-cont">
            <h1 class="box__title">Encuentra mascotas cerca</h1>
            <p class="box__text">
              Revisa los reportes en tu zona y ayuda a reunir familias con sus
              mejores amigos.
            </p>
          </div>
        </div>
        <div class="box">
          <div class="box__img">💬</div>
          <div class="box__text-cont">
            <h1 class="box__title">Reporta información</h1>
            <p class="box__text">
              Si viste alguna mascota, contactate con el dueño para facilitar el
              reencuentro.
            </p>
          </div>
        </div>
      </div>
    </div>
    <style>
      * {
        box-sizing: border-box;
      }

      .view {
        height: 100vh;
        width: 100vw;
        background-color: #e8e9ed;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 30px;
      }

      .goback {
        width: 50px;
        height: 50px;
        background-color: #2c3e50;
        border: none;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        position: fixed;
        top: 20px;
        left: 20px;
        color: white;
        font-size: 18px;
        cursor: pointer;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        z-index: 1000;
      }

      .goback:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
        background: #34495e;
      }

      .presentation-cont {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 30px;
      }

      .logo {
        width: 70px;
      }

      .text-cont {
      }

      .title {
        text-align: center;
        margin-bottom: 0;
        font-family: "Poppins";
        font-weight: 700;
        color: #2c3e50;
      }

      .subtitle {
        margin: 0;
        text-align: center;
        font-weight: 300;
        font-family: "Poppins";
        font-size: 21px;
      }

      .boxes-cont {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        max-width: 940px;
        gap: 20px;
        justify-content: space-between;
      }

      .box {
        background-color: #d4d8df;
        height: 110px;
        border-radius: 10px;
        display: flex;
        padding: 10px;
        gap: 6px;
        width: 100%;
      }

      .box__img {
        align-self: center;
        font-size: 30px;
      }

      .box__text-cont {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .box__title {
        font-size: 17px;
        margin: 0;
        font-weight: 500;
        font-family: "Poppins";
        color: #2c3e50;
      }

      .box__text {
        font-family: "Poppins";
        color: #2c3e50;
        font-size: 13px;
        margin: 0;
      }

      @media (min-width: 600px) {
        .logo {
          width: 130px;
        }

        .title {
          font-size: 38px;
        }

        .subtitle {
          font-size: 25px;
          margin-bottom: 30px;
        }

        .box {
          height: 150px;
          gap: 10px;
        }

        .box__img {
          font-size: 37px;
        }

        .box__text-cont {
          gap: 10px;
        }

        .box__title {
          font-size: 23px;
        }

        .box__text {
          font-size: 17px;
        }

        @media (min-width: 100px) {
          .goback {
            height: 80px;
            width: 80px;
            font-size: 29px;
          }
          .logo {
            width: 150px;
          }

          .title {
            font-size: 42px;
          }

          .subtitle {
            font-size: 28px;
          }

          .box__img {
            font-size: 43px;
          }
          .box__text-cont {
            gap: 15px;
          }

          .box__title {
            font-size: 26px;
          }

          .box__text {
            font-size: 18px;
          }
        }
      }
    </style>
    `;

    const goBackButtonEl = this.shadowDom.querySelector(
      ".goback"
    ) as HTMLElement;

    goBackButtonEl.addEventListener("click", () => {
      Router.go("/");
    });
  }
}

customElements.define("petfinder-info", PetFinderInfo);
