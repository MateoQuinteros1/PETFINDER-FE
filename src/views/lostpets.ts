import { state } from "../state";
import type { Pet } from "../state";
import { LostPet } from "../components/lost-pet";

class LostPets extends HTMLElement {
  shadowDom = this.attachShadow({ mode: "open" });
  petsList: Pet[] = [];

  constructor() {
    super();
    // Cada vez que cambia el state, actualizamos la lista y renderizamos
    state.subscribe(() => {
      this.syncWithState();
    });
  }

  connectedCallback() {
    // Cuando el componente entra al DOM, pedimos datos iniciales
    this.loadData();
    state.isUserLoggedIn();
    this.syncWithState(); // primer render
  }

  async loadData() {
    const noGeo = state.geolocationIsEmpty();
    if (noGeo === false) {
      await state.findNearbyPets();
    } else {
      const geoOk = await state.geolocationIsEnabled();
      if (geoOk) {
        await state.findNearbyPets();
      }
    }
  }

  syncWithState() {
    const getCurrentState = state.getState();
    this.petsList = getCurrentState.lostPets;
    this.render();
  }

  render() {
    this.shadowDom.innerHTML = `
      <section class="view">
        <header-comp></header-comp>
        <div class="main-cont">
          <h1 class="title">Mascotas <span>perdidas</span> cerca</h1>
          <div class="lostpets-cont"></div>
          <div class="empty-state">
            <img
              class="empty-state__img"
              src="/real-estate-dog-svgrepo-com.svg"
            />
            <h2 class="empty-state__title">¡Qué suerte! 🐶🐱</h2>
            <p class="empty-state__text">
              No se encontraron mascotas perdidas cerca de tu ubicación.
            </p>
          </div>
        </div>
      </section>
      <style>
        * { box-sizing: border-box; }
        .view {
          min-height: 100vh;
          background-color: #def4f0;
          padding-bottom: 70px;
        }
        .title {
          font-family: "Poppins";
          font-weight: 500;
          font-size: 25px;
          text-align: center;
          margin: 40px 0;
          display: none;
        }
        span { font-weight: bold; }
        .lostpets-cont {
          width: 100%;
          display: none;
          place-items: center;
          gap: 42px;
        }
        .empty-state {
          width: 100%;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        }
        .empty-state__img { width: 240px; }
        .empty-state__title {
          font-family: "Poppins";
          font-size: 27px;
          color: #1e3d32;
        }
        .empty-state__text {
          font-family: "Poppins";
          font-size: 20px;
          text-align: center;
          max-width: 360px;
          margin-top: 0;
          color: #1e3d32;
        }
        @media (min-width: 500px) {
          .title { font-size: 30px; }
        }
        @media (min-width: 650px) {
          .empty-state__img { width: 300px; }
          .empty-state__title { font-size: 32px; }
          .empty-state__text { font-size: 25px; max-width: 455px; }
        }
        @media (min-width: 700px) {
          .title { font-size: 36px; }
        }
        @media (min-width: 1000px) {
          .title { font-size: 43px; margin-bottom: 80px; }
        }
        @media (min-width: 1260px) {
          .title { font-size: 50px; }
          .empty-state__img { width: 350px; }
          .empty-state__title { font-size: 36px; }
          .empty-state__text { font-size: 29px; max-width: 500px; }
        }
        @media (min-width: 1600px) {
          .title { font-size: 57px; }
        }
        @media (min-width: 1630px) {
          .lostpets-cont {
            grid-template-columns: repeat(auto-fit, minmax(760px, 1fr));
            row-gap: 80px;
            justify-content: center;
          }
        }
      </style>
    `;

    const title = this.shadowDom.querySelector(".title") as HTMLElement;
    const lostPetsCont = this.shadowDom.querySelector(
      ".lostpets-cont"
    ) as HTMLElement;
    const emptyStateEl = this.shadowDom.querySelector(
      ".empty-state"
    ) as HTMLElement;

    if (this.petsList.length > 0) {
      title.style.display = "inherit";
      lostPetsCont.style.display = "grid";
      emptyStateEl.style.display = "none";

      for (const p of this.petsList) {
        const newLostPetComp = new LostPet(
          p.objectID,
          p.imageURL,
          p.name,
          p.location
        );
        lostPetsCont.appendChild(newLostPetComp);
      }
    }
  }
}

customElements.define("lost-pets", LostPets);

/*

import { state } from "../state";
import type { Pet } from "../state";
import { LostPet } from "../components/lost-pet";
class LostPets extends HTMLElement {
  shadowDom = this.attachShadow({ mode: "open" });

  petsList: Pet[] = [];

  constructor() {
    super();
    this.syncWithState();
    state.subscribe(() => {
      this.syncWithState();
    });
  }

  syncWithState() {
    const getCurrentState = state.getState();
    this.petsList = getCurrentState.lostPets;
    this.render();
  }

  async render() {
    this.shadowDom.innerHTML = `
    <section class="view">
      <header-comp></header-comp>
      <div class="main-cont">
        <h1 class="title">Mascotas <span>perdidas</span> cerca</h1>
        <div class="lostpets-cont"></div>
        <div class="empty-state">
          <img
            class="empty-state__img"
            src="/real-estate-dog-svgrepo-com.svg"
          />
          <h2 class="empty-state__title">¡Qué suerte! 🐶🐱</h2>
          <p class="empty-state__text">
            No se encontraron mascotas perdidas cerca de tu ubicación.
          </p>
        </div>
      </div>
    </section>
    <style>
      * {
        box-sizing: border-box;
      }

      .view {
        min-height: 100vh;
        background-color: #def4f0;
        padding-bottom: 70px;
      }

      .title {
        font-family: "Poppins";
        font-weight: 500;
        font-size: 25px;
        text-align: center;
        margin: 40px 0;
        display: none;
      }
      span {
        font-weight: bold;
      }
      .lostpets-cont {
        width: 100%;
        display: none;
        place-items: center;
        gap: 42px;
      }

      .empty-state {
        width: 100%;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
      }

      .empty-state__img {
        width: 240px;
      }

      .empty-state__title {
        font-family: "Poppins";
        font-size: 27px;
        color: #1e3d32;
      }

      .empty-state__text {
        font-family: "Poppins";
        font-size: 20px;
        text-align: center;
        max-width: 360px;
        margin-top: 0;
        color: #1e3d32;
      }

      @media (min-width: 500px) {
        .title {
          font-size: 30px;
        }
      }

      @media (min-width: 650px) {
        .empty-state__img {
          width: 300px;
        }

        .empty-state__title {
          font-size: 32px;
        }

        .empty-state__text {
          font-size: 25px;
          max-width: 455px;
        }
      }

      @media (min-width: 700px) {
        .title {
          font-size: 36px;
        }
      }
      @media (min-width: 1000px) {
        .title {
          font-size: 43px;
          margin-bottom: 80px;
        }
      }
      @media (min-width: 1260px) {
        .title {
          font-size: 50px;
        }

        .empty-state__img {
          width: 350px;
        }

        .empty-state__title {
          font-size: 36px;
        }

        .empty-state__text {
          font-size: 29px;
          max-width: 500px;
        }
      }

      @media (min-width: 1600px) {
        .title {
          font-size: 57px;
        }
      }

      @media (min-width: 1630px) {
        .lostpets-cont {
          grid-template-columns: repeat(auto-fit, minmax(760px, 1fr));
          row-gap: 80px;
          justify-content: center;
        }
      }
    </style>
    `;

    const res = state.geolocationIsEmpty();
    if (res === false) {
      console.log("Entro acá");
      await state.findNearbyPets();
    } else {
      console.log("Entró acá");
      const res = await state.geolocationIsEnabled();
      if (res === true) {
        await state.findNearbyPets();
      }
    }

    const title = this.shadowDom.querySelector(".title") as HTMLElement;
    const lostPetsCont = this.shadowDom.querySelector(
      ".lostpets-cont"
    ) as HTMLElement;
    const emptyStateEl = this.shadowDom.querySelector(
      ".empty-state"
    ) as HTMLElement;

    if (this.petsList.length > 0) {
      title.style.display = "inherit";
      lostPetsCont.style.display = "grid";
      emptyStateEl.style.display = "none";
      for (const p of this.petsList) {
        const newLostPetComp = new LostPet(
          p.objectID,
          p.imageURL,
          p.name,
          p.location
        );
        lostPetsCont.appendChild(newLostPetComp);
      }
    }
  }
}

customElements.define("lost-pets", LostPets);

*/
