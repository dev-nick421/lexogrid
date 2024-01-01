<template>
  <div class="create-game">
    <h1>Create a Game</h1>
    <form @submit.prevent="createGame">
      <label for="gameName">Lobby Name:</label>
      <input type="text" id="gameName" v-model="gameName" required />

      <label for="maxPlayers">Max Players (1-10):</label>
      <input
        type="number"
        id="maxPlayers"
        v-model.number="maxPlayers"
        min="1"
        max="10"
        required
      />

      <button type="submit">Create Game</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { v4 as uuidv4 } from "uuid";

const router = useRouter();

const gameName = ref("");
const maxPlayers = ref(1);

const createGame = () => {
  // Generate a unique identifier for the game
  const gameId = uuidv4();

  // Create the game object
  const newGame = {
    id: gameId,
    name: gameName.value,
    maxPlayers: maxPlayers.value,
    created_at: new Date(),
  };

  // Add the new game to the list (for demo purposes)
  games.value.push(newGame);

  // Navigate to the created game
  router.push(`/game/${gameId}`);
};

const games = ref([
  // this doesnt make any sense we need to work on the API
]);
</script>

<style scoped>
.create-game {
  text-align: center;
  margin-top: 20px;
}

form {
  width: 30%;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 8px;
}

input {
  padding: 8px;
  margin-bottom: 16px;
}

button {
  background-color: #2196f3;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0b7dda;
}
</style>
