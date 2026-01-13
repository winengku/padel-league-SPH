<script setup lang="ts">
defineProps<{
  players: {
    name: string;
    team: string;
  }[];
}>();
</script>

<template>
  <div class="bg-white rounded-xl border">
    <!-- HEADER -->
    <div
      class="grid grid-cols-[32px_1fr_90px] px-4 py-2 text-xs text-gray-500 border-b"
    >
      <div>No</div>
      <div>Player</div>
      <div class="text-right">Team</div>
    </div>

    <!-- EMPTY STATE -->
    <div
      v-if="players.length === 0"
      class="px-4 py-4 text-center text-sm text-gray-400"
    >
      No players assigned
    </div>

    <!-- LIST -->
    <div
      v-for="(player, index) in players"
      :key="index"
      class="grid grid-cols-[32px_1fr_90px] px-4 py-2 text-sm border-b last:border-b-0"
    >
      <div>{{ index + 1 }}</div>
      <div class="truncate">{{ player.name }}</div>
      <div class="text-right truncate">
        {{ player.team }}
      </div>
    </div>
  </div>
</template>
