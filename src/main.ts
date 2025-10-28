import "./components/header";
import "./components/lost-pet";
import "./components/editpet";
import "./views/welcome";
import "./views/getuserlocation";
import "./views/lostpets";
import "./views/petfinder-info";
import "./views/login";
import "./views/signup";
import "./views/forgotpassword";
import "./views/resetpassword";
import "./views/userdata";
import "./views/edituserdata";
import "./views/updatepassword";
import "./views/reportpet";
import "./views/reportedpets";
import "./views/editpetreport";

import { state } from "./state";
import { Router } from "@vaadin/router";
import { LostPet } from "./components/lost-pet";

const router = new Router(document.body);

router.setRoutes([
  { path: "/", component: "welcome-page" },
  { path: "/getuserlocation", component: "get-user-location" },
  { path: "/lostpets", component: "lost-pets" },
  { path: "/petfinderinfo", component: "petfinder-info" },
  { path: "/login", component: "login-page" },
  { path: "/signup", component: "sign-up" },
  { path: "/forgotpassword", component: "forgot-password" },
  { path: "/resetpassword", component: "reset-password" },
  { path: "/userdata", component: "user-data" },
  { path: "/edituserdata", component: "edit-user-data" },
  { path: "/updatepassword", component: "update-password" },
  { path: "/reportpet", component: "report-pet" },
  { path: "/reportedpets", component: "reported-pets" },
  { path: "/editpetreport", component: "edit-pet-report" },
]);
