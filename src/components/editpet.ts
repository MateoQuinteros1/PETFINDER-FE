import { Router } from "@vaadin/router";

export class EditPet extends HTMLElement {
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
        <button class="report">Editar ✏️</button>
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
        background-color: #5a8fec;
        border: none;
        border-radius: 4px;
        font-family: "Roboto";
        font-weight: 400;
        color: white;
        font-size: 16px;
        align-self: center;
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
          font-size: 22px;
        }
      }
    </style>`;

    const report = this.shadowDom.querySelector(".report") as HTMLElement;
    report.addEventListener("click", () => {
      Router.go(`/editpetreport?id=${this.getAttribute("id")}`);
    });
  }
}

customElements.define("edit-pet", EditPet);
