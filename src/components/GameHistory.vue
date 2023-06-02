<script setup lang="ts">
import { onMounted, ref, reactive } from "vue";
import { GameSession } from "./ActiveGame.vue";

interface GameHistory {
  gameSession: GameSession;
  winner: string;
}
interface WinningRate {
  player: string;
  wins: number;
}
const state = reactive({
  noHistory: false,
  noWinningRate: false,
});
const gameHistory = ref<GameHistory[]>([]);
const winningRate = ref<WinningRate[]>([]);

onMounted(() => {
  getGameHistory();
  countNumberOfWinsPerName();
});

function countNumberOfWinsPerName() {
  gameHistory.value.forEach((game) => {
    const winner = game.winner;
    const player = winningRate.value.find((player) => player.player === winner);
    if (player) {
      player.wins++;
    } else {
      winningRate.value.push({ player: winner, wins: 1 });
    }
  });
  if (winningRate.value.length > 0) {
    winningRate.value.sort((a, b) => b.wins - a.wins);
  }
}

function getGameHistory() {
  const savedGameSession = localStorage.getItem("gameHistory");
  if (savedGameSession === null) {
    state.noHistory = true;
  } else if (savedGameSession !== null) {
    gameHistory.value = JSON.parse(savedGameSession) as GameHistory[];
  }
  console.log(savedGameSession);
  console.log(gameHistory.value);
}

function historyClear() {
  localStorage.removeItem("gameHistory");
  gameHistory.value = [];
  winningRate.value = [];
  state.noHistory = true;
  state.noWinningRate = true;
}

</script>

<template>
  <main class="flex flex-col">
    <h2 class="text-center text-accent m-6 text-2xl">Past Games:</h2>
    <p v-if="state.noHistory" class="text-center">
      Looks empty... Try playing a game!
    </p>
    <section class=" mb-4 grid grid-cols-2 justify-center gap-2">
      <ul class="flex justify-center flex-wrap gap-4">
        <li class="flex historySlots flex-col" v-for="game in gameHistory">
          <h4 class="text-center">Winner:</h4>
          <h3 class="text-2xl text-center text-success">{{ game.winner }}</h3>
          <div class="flex flex-col">
            <h4 class="text-center mt-2 gap-4">Players:</h4>
            <ul class="flex m-2 gap-4">
              <li v-for="player in game.gameSession.players">
                <span class="mr-2" :style="{ color: player.color }">{{
                  player.name
                }}</span>
                <span v-if="player.symbolIdentifier === 0">X</span>
                <span v-if="player.symbolIdentifier === 1">O</span>
              </li>
            </ul>
          </div>
          <div class="gameContainer">
            <div v-for="box in game.gameSession.boxLayout">
              <div v-if="box === 0"></div>
              <div
                v-if="box === 1"
                :style="{ backgroundColor: game.gameSession.players[0].color }"
              >
                X
              </div>
              <div
                v-if="box === 2"
                :style="{ backgroundColor: game.gameSession.players[1].color }"
              >
                O
              </div>
            </div>
          </div>
        </li>
      </ul>

      <div  v-if="!state.noHistory">
        <h3 class="text-center text-2xl mb-2 text-info">Highscore:</h3>
        <ul class="flex flex-col  gap-2">
          <li class="flex rateContainer justify-between w-24" v-for="player in winningRate">
            <p class="text-success">{{ player.player }}</p>
            <p>{{ player.wins }}</p>
          </li>
        </ul>
        
      </div>
    </section>
    <button v-if="!state.noHistory" class="mt-6 center btn btn-outline btn-error"  @click="historyClear">Clear All History</button>
  </main>
</template>

<style scoped>
.center {
    margin: 0 auto;
    width: fit-content;
}
.gameContainer {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 5px;
  width: fit-content;
  margin: 0 auto;
}
.gameContainer > div {
  background-color: aliceblue;
  height: 40px;
  width: 40px;
  color: black;
  display: grid;
  place-items: center;
  font-size: 3rem;
}
.rateContainer {
    margin: 0 auto;
}
.gameContainer > div > div {
  height: 100%;
  width: 100%;
  font-size: 1.5rem;
  display: grid;
  place-items: center;
  color: white;
}

.historySlots {
  background-color: #02126a;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
</style>
