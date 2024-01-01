<template>
  <div class="search-game">
    <h1>Active Games</h1>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Players</th>
          <th>Playing since</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="game in games" :key="game.id">
          <td>{{ game.name }}</td>
          <td>{{ game.players }} / 10</td>
          <td>{{ calculateLobbyAge(game.created_at) }}</td>
          <td>
            <button @click="joinGame(game.id)">Join</button>
            <button @click="watchGame(game.id)">Spectate</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from "vue";

const games = ref([
  { id: 1, name: "Game 1", players: 3, created_at: new Date() },
  { id: 2, name: "Game 2", players: 5, created_at: new Date() },
  // samples
]);

const joinGame = (gameId) => {
  // TODO: Implement logic to join the selected game
  console.log(`Joining game with ID ${gameId}`);
};

const watchGame = (gameId) => {
  // TODO: Players can also just spectate later
  console.log(`Spectating game with ID ${gameId}`);
};

const calculateLobbyAge = (createdAt) => {
  // Calc age of lobby
  const currentTime = new Date();
  const ageInMilliseconds = currentTime - new Date(createdAt);
  // Convert milliseconds to minutes
  const ageInMinutes = Math.floor(ageInMilliseconds / (1000 * 60));
  return `${ageInMinutes} min`;
};
</script>

<style scoped>
.search-game {
  text-align: center;
  margin-top: 20px;
}

table {
  width: 80%;
  margin: 20px auto;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #ec7632;
}

button {
  background-color: #4caf50;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>
