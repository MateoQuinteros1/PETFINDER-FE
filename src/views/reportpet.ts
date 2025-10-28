import { state } from "../state";
import { Router } from "@vaadin/router";
import Dropzone from "dropzone";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

class ReportPet extends HTMLElement {
  shadowDom = this.attachShadow({ mode: "open" });
  map: mapboxgl.Map | null = null;
  marker: mapboxgl.Marker | null = null;
  lng: number = 0;
  lat: number = 0;

  constructor() {
    super();
    this.render();
  }

  connectedCallback() {
    state.geolocationIsEnabled();
    state.isUserLoggedIn().then((res) => {
      if (res === false) {
        Router.go("/login");
      }
    });

    // Inicializar mapa después de que el DOM esté listo
    setTimeout(() => {
      this.initMap();
    }, 100);
  }

  initMap() {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

    const mapContainer = this.shadowDom.getElementById("map") as HTMLElement;

    // Crear mapa
    const map = new mapboxgl.Map({
      container: mapContainer,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-58.3816, -34.6037], // [lng, lat]
      zoom: 7,
    });

    map.on("click", (e) => {
      const { lng, lat } = e.lngLat; // objeto con latitud y longitud
      this.lng = lng;
      this.lat = lat;
      console.log({ lng, lat });

      if (this.marker) {
        this.marker.remove();
      }

      // Agregar marcador cuando se hace click
      this.marker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
    });
  }

  async getReadableLocation(lat: number, lng: number) {
    const accessToken =
      "pk.eyJ1IjoibWF0ZW9xMTkiLCJhIjoiY21lbHM5d2l1MGs0cTJucHE5M21oeTVqeCJ9.WEaHTZsWc7b7JC8UGAqrNw";

    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${accessToken}&language=es`
      );
      const data = await res.json();

      console.log("🌍 Respuesta completa de Mapbox:", data); // 👈 muestra toda la respuesta para inspección

      if (!data.features?.length) {
        console.log("❌ No se encontró dirección para esas coordenadas");
        return "Ubicación desconocida";
      }

      // Buscar la feature más detallada disponible
      const preferred =
        data.features.find((f: any) =>
          f.place_type.some((t: any) =>
            ["address", "neighborhood", "locality", "place"].includes(t)
          )
        ) || data.features[0];

      // Construir texto legible
      const parts = [];
      const cleanText = (txt: any) => txt.replace(/\b\d{4,}\b/g, "").trim();

      if (preferred.text) parts.push(cleanText(preferred.text));

      if (preferred.context) {
        const city = preferred.context.find((c: any) =>
          c.id.startsWith("place")
        );
        const region = preferred.context.find((c: any) =>
          c.id.startsWith("region")
        );
        const country = preferred.context.find((c: any) =>
          c.id.startsWith("country")
        );

        if (city) parts.push(cleanText(city.text));
        if (region) parts.push(cleanText(region.text));
        if (country) parts.push(cleanText(country.text));
      }

      const locationString = parts.filter(Boolean).join(", ");

      console.log("📍 Ubicación generada:", locationString); // 👈 muestra el resultado final

      return locationString;
    } catch (error) {
      console.error("⚠️ Error al obtener ubicación:", error);
      return "Ubicación desconocida";
    }
  }

  render() {
    this.shadowDom.innerHTML = `
    <link href="https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css" rel="stylesheet">
    
    <div class="view">
      <header-comp></header-comp>
      <div class="main-cont">
        <div class="container">
          <h1 class="title">Reportar mascota</h1>
          <h2 class="subtitle">
            Ingresá la siguiente información para realizar el reporte de la
            mascota
          </h2>
          <form>
            <div class="group">
              <label for="name">Nombre</label>
              <input
              required
                placeholder="Nombre de la mascota"
                name="name"
                id="name"
                type="text"
              />
            </div>
            <div class="insert-image">
              <label for="">Imagen</label>
              <div id="my-dropzone" class="image-cont">
                <img class="mountain-img" src="/mountain-svgrepo-com.svg" />
              </div>
              <p class="legend">Arrastrá una imagen o hacé clic para subirla</p>
            </div>
            <div class="pet-location">
              <label>Ubicación</label>
              <div id="map"></div>
              <p class="legend">
                Buscá un punto de referencia para reportar la mascota. Por
                ejemplo, la ubicación donde la viste por última vez.
              </p>
            </div>
            <div class="buttons-cont">
            <p class="error">Completá nombre, foto y ubicación antes de continuar.</p>
              <button type="submit" class="submit">Reportar mascota</button>
              <button type="button" class="cancel">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <style>
      * {
        box-sizing: border-box;
        font-family: "Poppins";
      }

      .view {
        width: 100%;
      }

      .main-cont {
        width: 100%;
        padding: 20px;
        background-color: #f5f5f5;
        min-height: calc(100vh - 60px);
      }
      @media (min-width: 728px) {
        .main-cont {
          min-height: calc(100vh - 90px);
        }
      }

      .container {
        max-width: 600px;
        margin: 0 auto;
        background: white;
        border-radius: 15px;
        padding: 25px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }

      .title {
        color: #2c3e50;
        text-align: center;
        font-size: 26px;
        margin-bottom: 0;
      }
      @media (min-width: 651px) {
        .title {
          font-size: 30px;
        }
      }

      .subtitle {
        color: #2c3e50;
        font-size: 14px;
        text-align: center;
        font-weight: 300;
      }

      @media (min-width: 651px) {
        .subtitle {
          font-size: 16px;
        }
      }

      form {
        margin-top: 25px;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      @media (min-width: 651px) {
        form {
          margin-top: 35px;
        }
      }

      .group {
        width: 100%;
      }

      label {
        display: block;
        font-size: 14px;
        font-weight: 400;
      }

      @media (min-width: 651px) {
        label {
          font-size: 16px;
          font-weight: 500;
        }
      }

      input {
        height: 40px;
        width: 100%;
        border-radius: 8px;
        border: 2px solid #e0e0e0;
        padding-left: 5px;
      }
      @media (min-width: 651px) {
        input {
          height: 55px;
          padding-left: 8px;
          font-size: 16px;
        }

        input::placeholder {
          font-size: 16px;
        }
      }

      .image-cont {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #e8e8e8;
        border-radius: 8px;
        min-height: 170px;
      }

      .image-cont:hover {
        cursor: pointer;
        filter: brightness(0.9);
      }

      @media (min-width: 651px) {
        .image-cont {
          min-height: 260px;
        }
      }

      #map {
        width: 100%;
        background-color: #e8e8e8;
        border-radius: 8px;
        min-height: 170px;
        overflow: hidden;
      }
      
      @media (min-width: 651px) {
        #map {
          min-height: 280px;
        }
      }

      .mountain-img {
        width: 110px;
      }

      .legend {
        margin: 0;
        text-align: center;
        font-size: 12px;
      }
      @media (min-width: 651px) {
        .legend {
          font-size: 14px;
        }
      }

      .buttons-cont {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .error{
      margin:0;
      text-align:center;
      font-size:14px;
      color:red;
      display:none;
      }

      @media (min-width: 651px) {
        .buttons-cont {
          gap: 20px;
        }
      }

      .submit {
        background-color: #00a884;
      }

      .cancel {
        background-color: #4a5553;
      }

      button {
        width: 100%;
        border: none;
        border-radius: 5px;
        font-family: "Poppins";
        height: 50px;
        color: white;
        font-weight: 500;
      }

      button:hover {
        cursor: pointer;
        filter: brightness(0.8);
      }

      @media (min-width: 651px) {
        button {
          height: 70px;
          font-size: 16px;
        }
      }
    </style>
    `;

    let imageURL: string | undefined;

    const mountainImg = this.shadowDom.querySelector(
      ".mountain-img"
    ) as HTMLImageElement;
    const form = this.shadowDom.querySelector("form") as HTMLFormElement;
    const inputName = this.shadowDom.getElementById("name") as HTMLInputElement;
    const error = this.shadowDom.querySelector(".error") as HTMLElement;
    const cancel = this.shadowDom.querySelector(".cancel") as HTMLElement;

    cancel.addEventListener("click", () => {
      Router.go("/lostpets");
    });

    const myDropZone = new Dropzone(
      this.shadowDom.getElementById("my-dropzone") as HTMLElement,
      {
        url: "/falsa",
        maxFiles: 1,
        autoProcessQueue: false,
        maxFilesize: 2,
        acceptedFiles: "image/*",
        dictDefaultMessage: "",
        addRemoveLinks: true,
        previewTemplate: `<div class="dz-preview dz-file-preview">
          <div class="dz-image">
            <img data-dz-thumbnail style="min-width: 150px; border-radius: 10px; object-fit: cover;" />
          </div>
        </div>`,
      }
    );

    myDropZone.on("thumbnail", (file) => {
      imageURL = file.dataURL;
      mountainImg.style.display = "none";
    });

    myDropZone.on("maxfilesexceeded", (file) => {
      myDropZone.removeAllFiles();
      myDropZone.addFile(file);
    });

    myDropZone.on("removedfile", () => {
      mountainImg.style.display = "initial";
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = inputName.value.trim();
      if (!name || !imageURL || !this.lat || !this.lng) {
        error.style.display = "block";
        return;
      }

      this.getReadableLocation(this.lat, this.lng).then((res) => {
        state
          .reportPet(name, imageURL as string, "lost", this.lat, this.lng, res)
          .then((res) => {
            if (res === false) {
              return Router.go("/login");
            }

            if (res === true) {
              return Router.go("/lostpets");
            }
          })
          .catch((err) => {
            alert(err);
          });
      });
    });
  }
}

customElements.define("report-pet", ReportPet);

/*
import { state } from "../state";
import { Router } from "@vaadin/router";
import Dropzone from "dropzone";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

class ReportPet extends HTMLElement {
  shadowDom = this.attachShadow({ mode: "open" });
  map: mapboxgl.Map | null = null;
  marker: mapboxgl.Marker | null = null;
  lng: number = 0;
  lat: number = 0;

  constructor() {
    super();
    this.render();
  }

  connectedCallback() {
    state.geolocationIsEnabled();
    state.isUserLoggedIn().then((res) => {
      if (res === false) {
        Router.go("/login");
      }
    });

    // Inicializar mapa después de que el DOM esté listo
    setTimeout(() => {
      this.initMap();
    }, 100);
  }

  initMap() {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

    const mapContainer = this.shadowDom.getElementById("map") as HTMLElement;

    // Crear mapa
    const map = new mapboxgl.Map({
      container: mapContainer,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-58.3816, -34.6037], // [lng, lat]
      zoom: 7,
    });

    map.on("click", (e) => {
      const { lng, lat } = e.lngLat; // objeto con latitud y longitud
      this.lng = lng;
      this.lat = lat;
      console.log({ lng, lat });

      if (this.marker) {
        this.marker.remove();
      }

      // Agregar marcador cuando se hace click
      this.marker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
    });
  }

  render() {
    this.shadowDom.innerHTML = `
    <link href="https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css" rel="stylesheet">
    
    <div class="view">
      <header-comp></header-comp>
      <div class="main-cont">
        <div class="container">
          <h1 class="title">Reportar mascota</h1>
          <h2 class="subtitle">
            Ingresá la siguiente información para realizar el reporte de la
            mascota
          </h2>
          <form>
            <div class="group">
              <label for="name">Nombre</label>
              <input
              required
                placeholder="Nombre de la mascota"
                name="name"
                id="name"
                type="text"
              />
            </div>
            <div class="insert-image">
              <label for="">Imagen</label>
              <div id="my-dropzone" class="image-cont">
                <img class="mountain-img" src="/mountain-svgrepo-com.svg" />
              </div>
              <p class="legend">Arrastrá una imagen o hacé clic para subirla</p>
            </div>
            <div class="pet-location">
              <label>Ubicación</label>
              <div id="map"></div>
              <p class="legend">
                Buscá un punto de referencia para reportar la mascota. Por
                ejemplo, la ubicación donde la viste por última vez.
              </p>
            </div>
            <div class="buttons-cont">
            <p class="error">Completá nombre, foto y ubicación antes de continuar.</p>
              <button type="submit" class="submit">Reportar mascota</button>
              <button type="button" class="cancel">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <style>
      * {
        box-sizing: border-box;
        font-family: "Poppins";
      }

      .view {
        width: 100%;
      }

      .main-cont {
        width: 100%;
        padding: 20px;
        background-color: #f5f5f5;
        min-height: calc(100vh - 60px);
      }
      @media (min-width: 728px) {
        .main-cont {
          min-height: calc(100vh - 90px);
        }
      }

      .container {
        max-width: 600px;
        margin: 0 auto;
        background: white;
        border-radius: 15px;
        padding: 25px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }

      .title {
        color: #2c3e50;
        text-align: center;
        font-size: 26px;
        margin-bottom: 0;
      }
      @media (min-width: 651px) {
        .title {
          font-size: 30px;
        }
      }

      .subtitle {
        color: #2c3e50;
        font-size: 14px;
        text-align: center;
        font-weight: 300;
      }

      @media (min-width: 651px) {
        .subtitle {
          font-size: 16px;
        }
      }

      form {
        margin-top: 25px;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      @media (min-width: 651px) {
        form {
          margin-top: 35px;
        }
      }

      .group {
        width: 100%;
      }

      label {
        display: block;
        font-size: 14px;
        font-weight: 400;
      }

      @media (min-width: 651px) {
        label {
          font-size: 16px;
          font-weight: 500;
        }
      }

      input {
        height: 40px;
        width: 100%;
        border-radius: 8px;
        border: 2px solid #e0e0e0;
        padding-left: 5px;
      }
      @media (min-width: 651px) {
        input {
          height: 55px;
          padding-left: 8px;
          font-size: 16px;
        }

        input::placeholder {
          font-size: 16px;
        }
      }

      .image-cont {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #e8e8e8;
        border-radius: 8px;
        min-height: 170px;
      }

      .image-cont:hover {
        cursor: pointer;
        filter: brightness(0.9);
      }

      @media (min-width: 651px) {
        .image-cont {
          min-height: 260px;
        }
      }

      #map {
        width: 100%;
        background-color: #e8e8e8;
        border-radius: 8px;
        min-height: 170px;
        overflow: hidden;
      }
      
      @media (min-width: 651px) {
        #map {
          min-height: 280px;
        }
      }

      .mountain-img {
        width: 110px;
      }

      .legend {
        margin: 0;
        text-align: center;
        font-size: 12px;
      }
      @media (min-width: 651px) {
        .legend {
          font-size: 14px;
        }
      }

      .buttons-cont {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .error{
      margin:0;
      text-align:center;
      font-size:14px;
      color:red;
      display:none;
      }

      @media (min-width: 651px) {
        .buttons-cont {
          gap: 20px;
        }
      }

      .submit {
        background-color: #00a884;
      }

      .cancel {
        background-color: #4a5553;
      }

      button {
        width: 100%;
        border: none;
        border-radius: 5px;
        font-family: "Poppins";
        height: 50px;
        color: white;
        font-weight: 500;
      }

      button:hover {
        cursor: pointer;
        filter: brightness(0.8);
      }

      @media (min-width: 651px) {
        button {
          height: 70px;
          font-size: 16px;
        }
      }
    </style>
    `;

    let imageURL: string | undefined;

    const mountainImg = this.shadowDom.querySelector(
      ".mountain-img"
    ) as HTMLImageElement;
    const form = this.shadowDom.querySelector("form") as HTMLFormElement;
    const inputName = this.shadowDom.getElementById("name") as HTMLInputElement;
    const error = this.shadowDom.querySelector(".error") as HTMLElement;

    const myDropZone = new Dropzone(
      this.shadowDom.getElementById("my-dropzone") as HTMLElement,
      {
        url: "/falsa",
        maxFiles: 1,
        autoProcessQueue: false,
        maxFilesize: 2,
        acceptedFiles: "image/*",
        dictDefaultMessage: "",
        addRemoveLinks: true,
        previewTemplate: `<div class="dz-preview dz-file-preview">
          <div class="dz-image">
            <img data-dz-thumbnail style="min-width: 150px; border-radius: 10px; object-fit: cover;" />
          </div>
        </div>`,
      }
    );

    myDropZone.on("thumbnail", (file) => {
      imageURL = file.dataURL;
      mountainImg.style.display = "none";
    });

    myDropZone.on("maxfilesexceeded", (file) => {
      myDropZone.removeAllFiles();
      myDropZone.addFile(file);
    });

    myDropZone.on("removedfile", () => {
      mountainImg.style.display = "initial";
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = inputName.value.trim();
      if (!name || !imageURL || !this.lat || !this.lng) {
        error.style.display = "block";
        return;
      }

      console.log({
        name,
        imageURL,
        lat: this.lat,
        lng: this.lng,
      });
    });
  }
}

customElements.define("report-pet", ReportPet);

*/
