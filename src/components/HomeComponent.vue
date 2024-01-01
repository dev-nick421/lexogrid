<template>
  <div class="home">
    <h1>Welcome to LexoGrid</h1>
    <button @click="searchForGame">Search for Game</button>
    <button @click="createGame">Create Game</button>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const searchForGame = () => {
  // searching for a game
  router.push("/search-game");
};

const createGame = () => {
  // creating a game lobby
  router.push("/create-game");
};
</script>

<style scoped>
.home {
  text-align: center;
  margin-top: 100px;
}

button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>
