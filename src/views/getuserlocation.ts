import { state } from "../state";
import { Router } from "@vaadin/router";
class GetUserLocation extends HTMLElement {
  shadowDom = this.attachShadow({ mode: "open" });
  constructor() {
    super();
    this.render();
  }

  async render() {
    this.shadowDom.innerHTML = `
        <section class="view">
      <img
        class="location-pin-img"
        src="/location-pin-svgrepo-com.svg"
        alt="locationpin"
      />
      <div class="text-cont">
        <p class="text">
          Para que Pet Finder funcione correctamente y pueda mostrarte mascotas
          cercanas, por favor <span>activá tu ubicación y refrescá la página</span>.
        </p>
      </div>
    </section>
    <style>
    *{
    box-sizing:border-box;
    }
      .view {
        width: 100%;
        height: 100vh;
        background-color: #def4f0;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 30px 25px;
      }

      .location-pin-img {
        height: 320px;
        width: 320px;
      }

      .text-cont {
        width: 100%;
        max-width: 543px;
      }

      .text {
        text-align: center;
        font-family: "Poppins";
        font-size: 22px;
        font-weight: 500;
        color: #1e3d32;
      }

      span {
        font-weight: bold;
        color: #203c32;
      }

      @media (min-width: 728px) {
        .location-pin-img {
          height: 420px;
          width: 420px;
        }

        .text {
          font-size: 30px;
        }
      }

      @media (min-width: 1120px) {
        .location-pin-img {
          height: 450px;
          width: 450px;
        }

        .text {
          font-size: 36px;
        }
      }
    </style>
    `;

    const res = await state.geolocationIsEnabled();
    if (res === true) {
      Router.go("/lostpets");
    }

    /*     try {
      const status = await navigator.permissions.query({ name: "geolocation" });

      if (status.state === "prompt") {
        navigator.geolocation.getCurrentPosition(
          () => {
            // El usuario aceptó compartir ubicación
            console.log("El usuario tiene activada la ubicación.");
          },
          (error) => {
            if (error.code === error.PERMISSION_DENIED) {
              console.log("El usuario no tiene activada la ubicación");
            } else {
              console.log("Error al obtener la ubicación:", error.message);
            }
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
          }
        );
      }

      status.onchange = () => {
        console.log("Nuevo estado de permisos:", status.state);
        if (status.state === "granted") {
          console.log("El usuario activó la ubicación ✅");
        }
        if (status.state === "denied") {
          console.log("El usuario desactivó la ubicación ❌");
        }
      };
    } catch (err) {
      console.error("No se pudo verificar el permiso:", err);
    } */
  }
}

customElements.define("get-user-location", GetUserLocation);
