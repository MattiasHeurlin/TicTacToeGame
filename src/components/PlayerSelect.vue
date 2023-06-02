<script setup lang="ts">
import { reactive } from "vue";

const emit = defineEmits(["start-game"]);
const state = reactive({
  currentlySelecting: 0,
});
export interface Players {
  name: string;
  symbolIdentifier: number;
  color: string;
}

export interface GameInfo {
  players: Players[];
  settings: {
    draw: boolean;
  };
}
const gameInfo = reactive({
  players: [
    {
      name: "Player 1",
      symbolIdentifier: 0,
      color: "#0264cc",
    },
    {
      name: "Player 2",
      symbolIdentifier: 1,
      color: "#009150",
    },
  ],
  settings: {
    draw: false,
  },
});

function startGame() {
  console.log("start game");
  emit("start-game", gameInfo);
}
</script>

<template>
  <main class="flex flex-col justify-center text-center">
    <div v-if="state.currentlySelecting === 0">
      <div>
        <h2 class="text-2xl m-2">
          <span class="text-accent">{{ gameInfo.players[0].name }}</span> -
          Please Select Your Name
        </h2>
        <input
          class="input input-bordered input-accent w-full max-w-xs"
          type="text"
          v-model="gameInfo.players[0].name"
        />
      </div>
    </div>
    <div v-else-if="state.currentlySelecting === 1">
      <h2 class="text-2xl m-2">
        <span class="text-accent"> {{ gameInfo.players[1].name }}</span> -
        Please Select Your Name
      </h2>
      <input
        class="input input-bordered input-accent w-full max-w-xs"
        type="text"
        v-model="gameInfo.players[1].name"
      />
    </div>

    <div v-if="state.currentlySelecting === 2" class="grid grid-cols-2">
      <div>
        <h2 class="text-2xl m-2">
          <span :style="{color: gameInfo.players[0].color}" class="">{{ gameInfo.players[0].name }}</span> -
          Please Select A Color:
        </h2>
        <input
          class="input input-bordered input-accent w-full max-w-xs"
          type="color"
          v-model="gameInfo.players[0].color"
        />
      </div>
      <div>
        <h2 class="text-2xl m-2">
          <span :style="{color: gameInfo.players[1].color}" class="">{{ gameInfo.players[1].name }}</span> -
          Please Select A Color:
        </h2>
        <input
          class="input input-bordered input-accent w-full max-w-xs"
          type="color"
          v-model="gameInfo.players[1].color"
        />
      </div>
    </div>
    <div v-if="state.currentlySelecting === 3">
      <h2 class="text-info text-2xl">Settings:</h2>
      <label class="text-xl mr-2" for="">Possiblity Of Draw: </label>
      <input class="checkbox checkbox-info" v-model="gameInfo.settings.draw" type="checkbox" />
    </div>
    <div class=" flex justify-center gap-4 mt-4">
      <button @click="state.currentlySelecting--" v-show="state.currentlySelecting > 0" class="btn btn-outline btn-error">Go Back</button>
      <button
        @click="state.currentlySelecting++"
        v-if="state.currentlySelecting <= 3"
        class="btn btn-outline btn-success"
      >
        Next
      </button>
      <button class="btn btn-outline btn-success" @click="startGame" v-else>
        Start Game
      </button>
    </div>
  </main>
</template>

<style scoped></style>
