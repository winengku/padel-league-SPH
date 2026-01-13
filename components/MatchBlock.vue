<script setup lang="ts">
import ScoreBoard from "~/components/ScoreBoard.vue";
import PlayerList from "~/components/PlayerList.vue";

defineProps<{
  match: {
    id: number;
    time: string;
    court: string;
    teamA: string;
    teamB: string;
    scoreA: number;
    scoreB: number;
    category: string;
    players: {
      name: string;
      team: string;
    }[];
  };
}>();
</script>

<template>
  <div class="space-y-4">
    <!-- TIME + COURT -->
    <div class="text-sm text-gray-600 font-medium">
      {{ match.time }} · {{ match.court }} · {{ match.category }}
    </div>

    <!-- SCOREBOARD -->
    <ScoreBoard
      :teamA="match.teamA"
      :teamB="match.teamB"
      :scoreA="match.scoreA"
      :scoreB="match.scoreB"
    />

    <!-- PLAYER LIST -->
    <PlayerList :players="match.players" />
  </div>
</template>
