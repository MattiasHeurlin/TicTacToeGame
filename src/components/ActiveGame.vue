<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { Players } from "./PlayerSelect.vue";

const props = defineProps({
  players: {
    type: Array as () => Players[],
    required: true,
  },
  settings: {
    type: Object as () => {
      draw: boolean;
    },
    required: true,
  },
  alreadyActiveGame: {
    type: Object as () => {
      players: Players[];
      boxLayout: number[];
      moveHistory: {
        player1: number[];
        player2: number[];
      };
      settings: {
        draw: boolean;
      };
    } | null,
    required: false,
  },
});
const currentlySelecting = ref(1);
const emit = defineEmits(["game-over", "draw", "goBack-fromGame"]);
export interface GameSession {
  players: Players[];
  boxLayout: number[];
  moveHistory: {
    player1: number[];
    player2: number[];
  };
  settings: {
    draw: boolean;
  };
}
const gameSession = reactive({
  players: props.players,
  boxLayout: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  moveHistory: {
    player1: [] as number[],
    player2: [] as number[],
  },
  settings: props.settings,
});

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

onMounted(() => {
  console.log("mounted");
  console.log(props.alreadyActiveGame);
  loadGame();
});
function saveCurrentStateOfGame() {
  sessionStorage.setItem("gameSession", JSON.stringify(gameSession));
}

function loadGame() {
  if (props.alreadyActiveGame) {
    console.log("loading game");
    console.log(props.alreadyActiveGame);
    gameSession.players = props.alreadyActiveGame.players;
    gameSession.boxLayout = props.alreadyActiveGame.boxLayout;
    gameSession.moveHistory = props.alreadyActiveGame.moveHistory;
    gameSession.settings = props.alreadyActiveGame.settings;
    currentlySelecting.value =
      gameSession.moveHistory.player1.length >
      gameSession.moveHistory.player2.length
        ? 2
        : 1;
    console.log(gameSession);
  }
}

function checkWinner(player: number) {
  return winningCombinations.some((combination) =>
    combination.every((index) => gameSession.boxLayout[index] === player)
  );
}

function handleClick(box: number): void {
  if (gameSession.boxLayout[box] !== 0) {
    return;
  }

  const currentPlayer = `player${currentlySelecting.value}` as
    | "player1"
    | "player2";

  if (gameSession.settings.draw) {
    if (gameSession.moveHistory[currentPlayer].length === 3) {
      emit("draw");
      return;
    }
  }
  // If the player has already placed 3, remove the first one
  if (gameSession.moveHistory[currentPlayer].length === 3) {
    const firstMove = gameSession.moveHistory[currentPlayer].shift();
    gameSession.boxLayout[firstMove as number] = 0;
  }
  gameSession.moveHistory[currentPlayer].push(box);

  gameSession.boxLayout[box] = currentlySelecting.value;

  if (checkWinner(currentlySelecting.value)) {
    sessionStorage.removeItem("gameSession");
    console.log(
      "winner" + gameSession.players[currentlySelecting.value - 1].name
    );
    saveGame(gameSession.players[currentlySelecting.value - 1].name);
    emit("game-over", gameSession.players[currentlySelecting.value - 1]);
    return;
  }

  currentlySelecting.value = currentlySelecting.value === 1 ? 2 : 1;
  saveCurrentStateOfGame();
}

function saveGame(playerWhoWon: string) {
  const gameToBeSaved = {
    gameSession: gameSession,
    winner: playerWhoWon,
  };
  if (localStorage.getItem("gameHistory") === null) {
    localStorage.setItem("gameHistory", JSON.stringify([gameToBeSaved]));
  } else {
    const gameHistory = JSON.parse(
      localStorage.getItem("gameHistory") as string
    );
    gameHistory.unshift(gameToBeSaved);
    localStorage.setItem("gameHistory", JSON.stringify(gameHistory));
  }
}

function goBack() {
  sessionStorage.removeItem("gameSession");
  emit("goBack-fromGame");
}
</script>

<template>
  <main>
    <h2 class="text-center m-4 text-xl">
      Your turn:
      <span :style="{ color: gameSession.players[0].color }" class="text-accent"
        ><span v-show="currentlySelecting === 1">{{
          gameSession.players[0].name
        }}</span>
        <span
          :style="{ color: gameSession.players[1].color }"
          v-show="currentlySelecting === 2"
          >{{ gameSession.players[1].name }}</span
        ></span
      >
    </h2>
    <section class="gameContainer mb-6 shadow w-72">
      <div
        class=""
        @click="
          () => {
            handleClick(index);
          }
        "
        v-for="(box, index) in gameSession.boxLayout"
      >
        <div v-if="box === 0"></div>
        <div
          v-if="box === 1"
          :style="{ backgroundColor: gameSession.players[0].color }"
        >
          X
        </div>
        <div
          v-if="box === 2"
          :style="{ backgroundColor: gameSession.players[1].color }"
        >
          O
        </div>
      </div>
    </section>
    <button class="btn btn-outline btn-error w-40 center" @click="goBack">
      RETURN
    </button>
  </main>
</template>

<style scoped>
.center {
  margin: 0 auto;
}
.gameContainer {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 10px;
}
.gameContainer > div {
  background-color: aliceblue;
  height: 100px;
  width: 100px;
  color: black;
  display: grid;
  place-items: center;
  font-size: 3rem;
}

.gameContainer > div > div {
  height: 100%;
  width: 100%;
  display: grid;
  place-items: center;
  color: white;
  font-weight: bold;
}

main {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
