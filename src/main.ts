// main.ts
import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";
import HomeComponent from "./components/HomeComponent.vue";
import GameComponent from "./components/GameComponent.vue";
import SearchGameComponent from "./components/SearchGameComponent.vue";
import CreateGameComponent from "./components/CreateGameComponent.vue";

const routes = [
  { path: "/", component: HomeComponent },
  { path: "/game", component: GameComponent },
  { path: "/search-game", component: SearchGameComponent },
  { path: "/create-game", component: CreateGameComponent },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);
app.use(router);
app.mount("#app");
