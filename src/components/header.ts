import { state } from "../state";
class Header extends HTMLElement {
  shadowDom = this.attachShadow({ mode: "open" });
  userEmail: string = "";
  constructor() {
    super();
    this.syncWithState();
    state.subscribe(() => {
      this.syncWithState();
    });
  }

  syncWithState() {
    const getCurrentState = state.getState();
    this.userEmail = getCurrentState.userEmail;
    this.render();
  }

  render() {
    this.shadowDom.innerHTML = `
    <header class="header">
      <a href="/lostpets">
        <img class="header__logo" src="/pet-logo-svg.svg" alt="logo" />
      </a>
      <div class="burguer-list">
        <div class="burguer-list__item"></div>
        <div class="burguer-list__item"></div>
        <div class="burguer-list__item"></div>
      </div>
      <div class="links-container">
        <a class="link" href="/userdata">Mis datos</a>
        <a class="link" href="/reportedpets">Mis mascotas reportadas</a>
        <a class="link" href="/reportpet">Reportar mascota</a>
      </div>
      <div class="dropdown-menu">
        <img class="close-dropdown-menu" src="/close-dropdown-menu.svg" />
        <div class="dropdown-menu-links__cont">
          <a class="dropdown-menu__link" href="/userdata">Mis datos</a>
          <a class="dropdown-menu__link" href="/reportedpets"
            >Mis mascotas <br />
            reportadas</a
          >
          <a class="dropdown-menu__link" href="/reportpet">Reportar mascota</a>
        </div>
        <div class="email-cont">
          <p class="email">${this.userEmail}</p>
          <a class="logout">Cerrar sesión</a>
        </div>
      </div>
    </header>
    <style>
      * {
        box-sizing: border-box;
      }
      .header {
        width: 100%;
        height: 60px;
        background-color: #26302e;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 15px;
      }
      .header__logo {
        height: 50px;
        width: 50px;
      }

      .header__logo:hover {
        cursor: pointer;
      }

      .burguer-list {
        height: 50px;
        width: 40px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 5px;
      }

      .burguer-list:hover{
      cursor:pointer;
      opacity:0.8;
      }

      .burguer-list__item {
        width: 100%;
        height: 5px;
        background-color: white;
        border-radius: 3px;
      }

      .links-container {
        display: none;
      }

      .dropdown-menu {
        background-color: #13171c;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: none;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 120px;
      }

      .close-dropdown-menu {
        position: inherit;
        top: 20px;
        right: 20px;
        width: 20px;
      }

      .close-dropdown-menu:hover{
      cursor:pointer;
      opacity:0.8;
      }

      .dropdown-menu-links__cont {
        display: flex;
        flex-direction: column;
        gap: 70px;
      }

      .dropdown-menu__link {
        text-align: center;
        text-decoration: none;
        color: whitesmoke;
        font-family: "Poppins";
        font-weight: 700;
        font-size: 29px;
      }

      .email-cont {
        font-family: "Poppins";
        display: flex;
        flex-direction: column;
        align-items: center;
        color: wheat;
      }

      .email {
        font-size: 15px;
      }

      .logout {
        color: #3b97d3;
        text-decoration: underline;
      }

      @media (min-width: 728px) {
        .header {
          height: 90px;
          padding: 0 25px;
        }

        .header__logo {
          height: 67px;
          width: 67px;
        }

        .burguer-list {
          display: none;
        }

        .links-container {
          display: flex;
          gap: 25px;
          font-family: "Poppins";
          font-size: 17px;
        }

        .link {
          text-decoration: none;
          color: white;
        }

        .link:hover {
          opacity: 0.6;
        }
      }
    </style>`;

    const burguerList = this.shadowDom.querySelector(".burguer-list");
    const dropdownMenu = this.shadowDom.querySelector(
      ".dropdown-menu"
    ) as HTMLElement;
    const closeDropDownMenu = this.shadowDom.querySelector(
      ".close-dropdown-menu"
    ) as HTMLElement;

    burguerList?.addEventListener("click", () => {
      dropdownMenu.style.display = "flex";
      document.body.style.overflowY = "hidden";
    });

    closeDropDownMenu?.addEventListener("click", () => {
      dropdownMenu.style.display = "none";
      document.body.style.overflowY = "";
    });

    const email = this.shadowDom.querySelector(".email") as HTMLElement;
    const logoutButton = this.shadowDom.querySelector(".logout") as HTMLElement;

    if (!this.userEmail) {
      email.style.display = "none";
      logoutButton.style.display = "none";
    }

    logoutButton.addEventListener("click", () => {
      state.logOutUser();
    });
  }
}

customElements.define("header-comp", Header);
