import { Router } from "@vaadin/router";
import { algoliaClient } from "./lib/algolia";
const apiDomain = import.meta.env.VITE_DOMAIN;

export interface Pet {
  id?: number;
  objectID: number;
  name: string;
  status: "lost" | "found";
  lat: string;
  lng: string;
  location: string;
  imageURL: string;
}

interface UserDataResponse {
  userExists: boolean;
  user: {
    id: number;
    name: string;
    email: string;
    pets: Pet[];
  };
}

export interface ReportPet {
  reporter_name: string;
  reporter_phone_number: string;
  report_info: string;
  pet_id: number;
}

interface Register {
  name: string;
  email: string;
  password: string;
}

export interface userCredentials {
  email: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
}

export interface UpdatePetReport {
  pet_id?: number;
  name?: string;
  lng?: number;
  lat?: number;
  imageURL?: string;
  location?: string;
}

export const state = {
  data: {
    userId: 0,
    userName: "",
    userEmail: "",
    userPets: [] as Array<Pet>,
    _geoloc: {
      lat: "",
      lng: "",
    },
    lostPets: [] as Array<Pet>,
    editPetDataId: 0,
  },
  listeners: [] as Array<() => void>,
  callListeners() {
    for (const cb of this.listeners) {
      cb();
    }
  },
  getState() {
    return this.data;
  },
  setState(newState: any) {
    this.data = newState;
    this.callListeners();
  },
  subscribe(cb: () => void) {
    this.listeners.push(cb);
  },
  getUserLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        alert("La geolocalización no está disponible");
        reject("No disponible");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          console.log("Coordenadas:", latitude, longitude);

          const getCurrentState = this.getState();
          const newState = {
            ...getCurrentState,
            _geoloc: {
              lat: latitude,
              lng: longitude,
            },
          };
          this.setState(newState);

          resolve(newState._geoloc);
        },
        (err) => {
          if (err.code === err.PERMISSION_DENIED) {
            alert("Pet Finder necesita tu ubicación para funcionar");
          } else {
            alert("Error al obtener la ubicación: " + err.message);
          }
          reject(err);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
        }
      );
    });
  },
  async geolocationIsEnabled() {
    const status = await navigator.permissions.query({ name: "geolocation" });
    if (status.state === "prompt" || status.state === "denied") {
      if (window.location.pathname != "/getuserlocation") {
        Router.go("/getuserlocation");
      } else {
        await this.getUserLocation();
      }
      return false;
    }

    if (status.state === "granted") {
      try {
        const coords = await this.getUserLocation();
        console.log("Coords desde geolocationIsEnabled:", coords);
        return true;
      } catch (e) {
        return false;
      }
    }
  },
  async getUserData() {
    const res = await fetch(`${apiDomain}/users`, {
      headers: {
        Authorization: `bearer ${localStorage.getItem("token")}`,
      },
    });

    if (res.status === 404 || res.status === 401) {
      Router.go("/login");
      return;
    }

    const data: UserDataResponse = await res.json();

    const getCurrentState = this.getState();
    const newState = {
      ...getCurrentState,
      userId: data.user.id,
      userName: data.user.name,
      userEmail: data.user.email,
      userPets: data.user.pets,
    };
    this.setState(newState);
  },
  async findNearbyPets() {
    const getCurrentState = this.getState();
    const coordinates = `${getCurrentState._geoloc.lat},${getCurrentState._geoloc.lng}`;
    const searchResults = await algoliaClient.searchSingleIndex({
      indexName: "pets",
      searchParams: {
        aroundLatLng: coordinates,
        aroundRadius: 100000, //100 km
      },
    });
    const newState = { ...getCurrentState, lostPets: searchResults.hits };
    this.setState(newState);
  },
  async reportLostPet(report: ReportPet) {
    fetch(`${apiDomain}/reports`, {
      method: "POST",
      body: JSON.stringify(report),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(() => {
        console.log("Mail enviado");
      })
      .catch((err) => {
        console.log("Error es:", err);
      });
  },
  geolocationIsEmpty() {
    const getCurrentState = this.getState();
    if (!getCurrentState._geoloc.lat && !getCurrentState._geoloc.lng) {
      return true;
    } else {
      return false;
    }
  },

  async signUpUser(userData: Register) {
    const res = await fetch(`${apiDomain}/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (res.status === 409) {
      return false;
    } else {
      return true;
    }
  },

  async logInUser(userData: userCredentials) {
    const reqBodyData = await fetch(`${apiDomain}/auth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const json = await reqBodyData.json();
    if (reqBodyData.status === 401) {
      return false;
    } else {
      localStorage.setItem("token", json.response.token);
      const getCurrentState = this.getState();
      const newState = {
        ...getCurrentState,
        userId: json.response.userData.id,
        userName: json.response.userData.name,
        userEmail: json.response.userData.email,
        userPets: json.response.userData.pets,
      };

      this.setState(newState);
    }
  },
  logOutUser() {
    this.clearAuthToken();
    this.clearState();
  },
  saveAuthToken(token: string) {
    localStorage.setItem("token", token);
  },
  clearAuthToken() {
    localStorage.removeItem("token");
  },
  async isUserDataLoaded() {
    const getCurrentState = this.getState();
    if (getCurrentState.userId === 0 && localStorage.getItem("token")) {
      await this.getUserData();
    }
  },
  clearState() {
    const getCurrentState = this.getState();
    const newState = {
      ...getCurrentState,
      userId: 0,
      userName: "",
      userEmail: "",
      userPets: [],
    };
    this.setState(newState);
  },
  async isUserLoggedIn(): Promise<boolean> {
    const getCurrentState = this.getState();
    const token = localStorage.getItem("token");
    if (token && getCurrentState.userId === 0) {
      await this.getUserData();
      return true;
    } else if (token) {
      return true;
    }

    return false;
  },
  async sendForgotPasswordEmail(email: string) {
    const res = await fetch(`${apiDomain}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (res.status === 404) {
      return false;
    } else {
      return true;
    }
  },

  async resetPassword(token: string | null, password: string) {
    const res = await fetch(`${apiDomain}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, password }),
    });

    if (res.status === 401) {
      return false;
    }

    return true;
  },

  async updateUserData(name: string) {
    const getCurrentState = this.getState();
    fetch(`${apiDomain}/users/${getCurrentState.userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ name }),
    })
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  },
  async updatePassword(password: string) {
    const res = await fetch(`${apiDomain}/users`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ password }),
    });

    if (!res.ok) {
      throw new Error("Error al actualizar la contraseña");
    }
    return true;
  },
  async reportPet(
    name: string,
    imageURL: string,
    status: string,
    lat: number,
    lng: number,
    location: string
  ) {
    const res = await fetch(`${apiDomain}/pets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ name, imageURL, status, lat, lng, location }),
    });

    if (res.status === 401) {
      return false;
    }

    if (!res.ok) {
      throw new Error("Error al reportar mascota");
    }
    return true;
  },
  async updatePetReport(data: UpdatePetReport) {
    const userPets = this.getState().userPets;

    const petExists = userPets.some((p) => p.id === data.pet_id);

    if (!petExists) {
      alert("No podés actualizar una mascota que no es tuya");
      return;
    }
    const res = await fetch(`${apiDomain}/pets`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Error al reportar mascota");
    }

    return true;
  },
  async deletePetReport(pet_id: number) {
    const userPets = this.getState().userPets;

    const petExists = userPets.some((p) => p.id === pet_id);

    if (!petExists) {
      alert("No podés eliminar una mascota que no es tuya");
      return;
    }

    const res = await fetch(`${apiDomain}/pets/${pet_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${localStorage.getItem("token")}`,
      },
    });

    if (res.status === 401) {
      Router.go("/login");
      return;
    }

    if (!res.ok) {
      throw new Error("Error al reportar mascota");
    }

    return true;
  },
};

/*

  getUserLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        alert("La geolocalización no está disponible");
        reject("No disponible");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          console.log("Coordenadas:", latitude, longitude);

          const getCurrentState = this.getState();
          const newState = {
            ...getCurrentState,
            _geoloc: {
              lat: latitude,
              lng: longitude,
            },
          };
          this.setState(newState);

          resolve(newState._geoloc);
        },
        (err) => {
          if (err.code === err.PERMISSION_DENIED) {
            alert("Pet Finder necesita tu ubicación para funcionar");
          } else {
            alert("Error al obtener la ubicación: " + err.message);
          }
          reject(err);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
        }
      );
    });
  },
  async geolocationIsEnabled() {
    const status = await navigator.permissions.query({ name: "geolocation" });

    if (status.state === "prompt" || status.state === "denied") {
      Router.go("/getuserlocation");
      return false;
    }

    if (status.state === "granted") {
      try {
        const coords = await this.getUserLocation();
        console.log("Coords desde geolocationIsEnabled:", coords);
        return true;
      } catch (e) {
        return false;
      }
    }
  }
 */
