<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const supabase = useSupabase();
const route = useRoute();
const router = useRouter();
const teamId = Number(route.params.id);

const team = ref<any>(null);
const players = ref<any[]>([]);

/**
 * FETCH TEAM + PLAYERS
 */
onMounted(async () => {
  // Fetch team
  const { data: teamData } = await supabase
    .from("Team")
    .select(
      `
      id,
      team_name,
      Group ( group_name )
    `
    )
    .eq("id", teamId)
    .single();

  team.value = teamData;

  // Fetch players
  const { data: playerData } = await supabase
    .from("Player")
    .select(
      `
      id,
      player_name,
      Category (
        id,
        category_name
      ),
      role
    `
    )
    .eq("team_id", teamId)
    .order("player_name");

  players.value = playerData || [];
});

/**
 * GROUP PLAYERS BY CATEGORY
 */
const playersByCategory = computed(() => {
  const result: Record<string, any[]> = {};

  players.value.forEach((p) => {
    const categoryName = p.Category?.category_name || "Uncategorized";

    if (!result[categoryName]) {
      result[categoryName] = [];
    }

    result[categoryName].push(p);
  });

  return result;
});
</script>

<template>
  <div class="min-h-screen bg-[#f2f0e3] py-10">
    <div class="max-w-xl mx-auto px-4 space-y-6">
      <!-- HEADER -->
      <div class="flex items-center gap-3">
        <button @click="router.back()">←</button>
        <div class="font-semibold">{{ team?.team_name }}</div>
      </div>
      <div class="text-center space-y-1">
        <div class="text-sm text-gray-500">
          {{ team?.Group?.group_name }}
        </div>
      </div>

      <!-- PLAYER LIST PER CATEGORY -->
      <div
        v-for="(rows, categoryName) in playersByCategory"
        :key="categoryName"
        class="bg-white rounded-2xl p-4 shadow-sm"
      >
        <div class="font-semibold text-sm mb-3">
          {{ categoryName }}
        </div>

        <div class="space-y-2">
          <div
            v-for="player in rows"
            :key="player.id"
            class="flex items-center justify-between border rounded-lg px-3 py-2 text-sm"
          >
            <div>{{ player.player_name }}</div>
            <div class="font-semibold" v-if="player.role == 'Captain'">
              Captain
            </div>
          </div>
        </div>
      </div>

      <div class="h-16"></div>
    </div>
  </div>
</template>
