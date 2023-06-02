<script setup lang="ts">
import { reactive, onMounted } from "vue";
import PlayerSelect from './components/PlayerSelect.vue';
import GameHistory from "./components/gameHistory.vue";
import { Players, GameInfo } from './components/PlayerSelect.vue';
import ActiveGame from './components/ActiveGame.vue';
import { GameSession } from "./components/ActiveGame.vue";

const state = reactive({
  players: [] as Players[],
  settings: {
    draw: false,
  },
  playerInfo: true,
  gameRunning: false,
  gameOver: false,
  theVictor: null as Players | null,
  draw: false,
  update: 0,
  alreadyActiveGame: null as GameSession | null,
});

function hasActiveSession() {
  const gameSession = sessionStorage.getItem('gameSession');
  if (gameSession) {
    const gameSessionParsed = JSON.parse(gameSession);
    state.alreadyActiveGame = gameSessionParsed;
    state.players = gameSessionParsed.players;
    state.settings = gameSessionParsed.settings;
    state.playerInfo = false;
    state.gameRunning = true;
  }
}
onMounted(() => {
  hasActiveSession();

})
function startGame(gameInfo: GameInfo) {
 
  state.players = gameInfo.players;
  state.settings = gameInfo.settings;
  state.playerInfo = false;
  state.gameRunning = true;
}

function gameOver(winner: Players) {
  console.log(winner);
  state.theVictor = winner;
  state.gameRunning = false;
  state.gameOver = true;
}

function restartGame() {
  state.gameOver = false;
  state.draw = false;
  state.playerInfo = true;
}

function goBackFromGame() {
  state.gameRunning = false;
  state.playerInfo = true;
}
function drawGameOver() {
  state.gameRunning = false;
  state.draw = true;
}
</script>

<template>
  <header>
    <h1 class="text-center text-primary text-6xl">Tic Tac Toe</h1>
  </header>
  <main>
      
     <PlayerSelect v-if="state.playerInfo"  @start-game="startGame"></PlayerSelect>
      <ActiveGame :key="state.update" @draw="drawGameOver" @game-over="gameOver" @goBack-fromGame="goBackFromGame" v-if="state.gameRunning" :settings="state.settings" :alreadyActiveGame="state.alreadyActiveGame" :players="state.players"></ActiveGame>
      <section class="flex flex-col justify-center text-center" v-if="state.gameOver">
        <h2 class="text-3xl text-primary mb-4">Game Over</h2>
        <div class="">
          <h3 class="text-2xl">Winner: <span :style="{color: state.theVictor!.color}">{{ state.theVictor!.name }}</span></h3>
          <div :style="{backgroundColor: state.theVictor!.color}" class="victorSymbolContainer" v-if="state.theVictor!.symbolIdentifier === 0">X</div>
          <div :style="{backgroundColor: state.theVictor!.color}" class="victorSymbolContainer" v-else>O</div>
        </div>
        <button @click="restartGame" class="btn btn-outline btn-primary">Another Game</button>
      </section>
      <section class="text-center" v-if="state.draw">
        <h2 class="text-3xl text-primary mb-4">Game Over</h2>
        <p class="text-2xl text-error mb-4">Draw</p>
        <button class="btn btn-outline btn-primary" @click="restartGame">Another Game</button>
      </section>
  </main>
  <footer v-if="!state.gameRunning">
    <GameHistory :key="state.update"></GameHistory>
  </footer>
</template>

<style scoped>
  header {
    text-align: center;
  }
  main {
    display: flex;
    justify-content: center;
  }
  footer {
    display: flex;
    justify-content: center;
  }

  .victorSymbolContainer {
    font-size: 5rem;
    height: 120px;
    width: 120px;
    border-radius: 10px;
    margin: 10px auto;
    display: grid;
    place-items: center;
  }
  
</style>