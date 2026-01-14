<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
const supabase = useSupabase();
import MatchBlock from "~/components/MatchBlock.vue";

const route = useRoute();
const router = useRouter();
const roundId = Number(route.params.id);

const round = ref<any>(null);
const matches = ref<any[]>([]);
const loading = ref(true);

onMounted(async () => {
  loading.value = true;

  /** =====================
   * FETCH ROUND
   ===================== */
  const { data: roundData, error: roundError } = await supabase
    .from("Round")
    .select(
      `
      id,
      round_name,
      teamA:Team!round_team_a_fkey ( team_name ),
      teamB:Team!round_team_b_fkey ( team_name )
    `
    )
    .eq("id", roundId)
    .single();

  if (roundError) {
    console.error(roundError);
    loading.value = false;
    return;
  }

  round.value = roundData;

  /** =====================
   * FETCH MATCH (NO JOIN)
   ===================== */
  const { data, error } = await supabase
    .from("Match")
    .select(
      `
      id,
      "order",
      start_time,
      score_A,
      score_B,
      player_A1,
      player_A2,
      player_B1,
      player_B2,
      court,
      Category(
      category_name
      )
    `
    )
    .eq("round_id", roundId)
    .order("order");

  if (error) {
    console.error(error);
    loading.value = false;
    return;
  }

  matches.value = data.map((m: any) => ({
    id: m.id,
    time: m.start_time?.slice(0, 5) ?? "-",
    court: `Court ${m.court}`,
    category: m.Category.category_name,
    teamA: round.value.teamA.team_name,
    teamB: round.value.teamB.team_name,
    scoreA: m.score_A ?? 0,
    scoreB: m.score_B ?? 0,
    players: [
      { name: m.player_A1, team: round.value.teamA.team_name },
      { name: m.player_A2, team: round.value.teamA.team_name },
      { name: m.player_B1, team: round.value.teamB.team_name },
      { name: m.player_B2, team: round.value.teamB.team_name },
    ].filter((p) => p.name),
  }));

  loading.value = false;
});
</script>

<template>
  <div class="p-4 space-y-6">
    <!-- HEADER -->
    <div class="flex items-center gap-3">
      <button @click="router.back()">←</button>
      <div class="font-semibold">{{ round?.round_name }}</div>
    </div>

    <div v-if="loading" class="text-center text-gray-400">
      Loading matches...
    </div>

    <MatchBlock v-for="match in matches" :key="match.id" :match="match" />
  </div>
</template>
