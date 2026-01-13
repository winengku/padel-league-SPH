<script setup lang="ts">
defineProps<{
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
}>();
</script>

<template>
  <div
    class="bg-gradient-to-br from-green-800 to-green-900 text-white rounded-2xl p-5 flex items-center justify-between shadow-md"
  >
    <!-- TEAM A -->
    <div class="flex flex-col items-center gap-1 w-28 text-center">
      <img
        src="/team-a.png"
        alt="Team A"
        class="w-11 h-11 rounded-full object-cover"
      />
      <div class="text-xs font-medium leading-snug line-clamp-2">
        {{ teamA }}
      </div>
    </div>

    <!-- SCORE -->
    <div class="text-2xl font-extrabold tracking-wide">
      {{ scoreA }}
      <span class="mx-2 text-orange-400">:</span>
      {{ scoreB }}
    </div>

    <!-- TEAM B -->
    <div class="flex flex-col items-center gap-1 w-28 text-center">
      <img
        src="/team-a.png"
        alt="Team B"
        class="w-11 h-11 rounded-full object-cover"
      />
      <div class="text-xs font-medium leading-snug line-clamp-2">
        {{ teamB }}
      </div>
    </div>
  </div>
</template>
