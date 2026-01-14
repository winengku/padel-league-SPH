<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
const supabase = useSupabase();

const route = useRoute();
const roundId = Number(route.params.id);

const round = ref<any>(null);
const matches = ref<any[]>([]);
const savingId = ref<number | null>(null);
const players = ref<any[]>([]);

onMounted(async () => {
  const { data: roundData } = await supabase
    .from("Round")
    .select(
      "id, round_name,teamA:Team!round_team_a_fkey ( team_name ),teamB:Team!round_team_b_fkey ( team_name )"
    )
    .eq("id", roundId)
    .single();

  round.value = roundData;

  const { data: matchData } = await supabase
    .from("Match")
    .select(
      `
      id,
      "order",
      start_time,
      player_A1,
      player_A2,
      player_B1,
      player_B2,
      score_A,
      score_B,
      court,
      Category(
      category_name,
      id
      )
    `
    )
    .eq("round_id", roundId)
    .order("order");

  matches.value = matchData || [];

  const { data: playerData, error: playerError } = await supabase.from("Player")
    .select(`
    id,
    player_name,
    team_id,
    category_id
  `);

  if (playerError) {
    console.error("Failed to fetch players:", playerError);
  } else {
    players.value = playerData || [];
  }
});

const saveMatch = async (match: any) => {
  savingId.value = match.id;

  const { error } = await supabase
    .from("Match")
    .update({
      player_A1: match.player_A1,
      player_A2: match.player_A2,
      player_B1: match.player_B1,
      player_B2: match.player_B2,
      score_A: match.score_A,
      score_B: match.score_B,
    })
    .eq("id", match.id);

  savingId.value = null;

  if (error) {
    alert("Failed to save");
  } else {
    alert("Saved");
  }
};

const getPlayersByTeamAndCategory = (teamId: number, categoryId: number) => {
  return players.value.filter(
    (p) => p.team_id === teamId && p.category_id === categoryId
  );
};
</script>

<template>
  <div class="min-h-screen bg-[#f6f3e7] py-10">
    <div class="max-w-xl mx-auto px-4 space-y-6">
      <!-- HEADER -->
      <div class="text-center">
        <div class="text-xs tracking-wide text-gray-500 uppercase">
          Admin Panel
        </div>
        <div class="text-xl font-semibold mt-1">
          {{ round?.round_name }}
        </div>
        <div class="text-s font-semibold mt-1">
          {{ round?.teamA.team_name }} vs {{ round?.teamB.team_name }}
        </div>
      </div>

      <!-- MATCH CARD -->
      <div
        v-for="match in matches"
        :key="match.id"
        class="bg-white rounded-2xl shadow-sm border p-5 space-y-4"
      >
        <!-- COURT HEADER -->
        <div class="flex justify-between items-center text-sm font-medium">
          <div>
            🏟 Court {{ match.court }} · {{ match.Category.category_name }}
          </div>
          <div class="text-gray-500">
            {{ match.start_time?.slice(0, 5) }}
          </div>
        </div>

        <!-- TEAMS -->
        <div class="grid grid-cols-2 gap-4">
          <!-- TEAM A -->
          <div class="space-y-2 gap-4">
            <div class="text-xs font-semibold text-gray-500">
              {{ round?.teamA.team_name }}
            </div>
            <!-- <input
              v-model="match.player_A1"
              placeholder="Player 1"
              class="w-full border rounded-lg px-4 py-2 text-sm placeholder-gray-400"
              style="margin: 8px 0"
            /> -->
            <!-- <input
              v-model="match.player_A2"
              placeholder="Player 2"
              class="w-full border rounded-lg px-4 py-2 text-sm placeholder-gray-400"
              style="margin: 8px 0"
            /> -->
            <select
              v-model="match.player_A1"
              class="w-full border rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="">Select player 1</option>
              <option
                v-for="p in getPlayersByTeamAndCategory(
                  match.team_A,
                  match.Category.id
                )"
                :key="p.id"
                :value="p.player_name"
              >
                {{ p.player_name }}
              </option>
            </select>
            <select
              v-model="match.player_A2"
              class="w-full border rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="">Select player 2</option>
              <option
                v-for="p in getPlayersByTeamAndCategory(
                  match.team_A,
                  match.Category.id
                )"
                :key="p.id"
                :value="p.player_name"
              >
                {{ p.player_name }}
              </option>
            </select>
          </div>

          <!-- TEAM B -->
          <div class="space-y-2">
            <div class="text-xs font-semibold text-gray-500">
              {{ round?.teamB.team_name }}
            </div>
            <!-- <input
              v-model="match.player_B1"
              placeholder="Player 1"
              class="w-full border rounded-lg px-4 py-2 text-sm placeholder-gray-400"
              style="margin: 8px 0"
            /> -->
            <!-- <input
              v-model="match.player_B2"
              placeholder="Player 2"
              class="w-full border rounded-lg px-4 py-2 text-sm placeholder-gray-400"
              style="margin: 8px 0"
            /> -->
            <select
              v-model="match.player_B1"
              class="w-full border rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="">Select player 1</option>
              <option
                v-for="p in getPlayersByTeamAndCategory(
                  match.team_B,
                  match.Category.id
                )"
                :key="p.id"
                :value="p.player_name"
              >
                {{ p.player_name }}
              </option>
            </select>
            <select
              v-model="match.player_B2"
              class="w-full border rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="">Select player 2</option>
              <option
                v-for="p in getPlayersByTeamAndCategory(
                  match.team_B,
                  match.Category.id
                )"
                :key="p.id"
                :value="p.player_name"
              >
                {{ p.player_name }}
              </option>
            </select>
          </div>
        </div>

        <!-- SCORE -->
        <div
          class="bg-gray-50 rounded-xl py-4 flex gap-6"
          style="display: flex; justify-content: center"
        >
          <input
            type="number"
            v-model.number="match.score_A"
            class="w-10 h-10 rounded-lg border text-center text-lg font-semibold"
            style="max-width: 40px; margin: 0 30px; justify-content: center"
          />
          <div class="text-2xl font-extrabold text-gray-400">:</div>
          <input
            type="number"
            v-model.number="match.score_B"
            class="w-10 h-10 rounded-lg border text-center text-lg font-semibold"
            style="max-width: 40px; margin: 0 30px; justify-content: center"
          />
        </div>

        <!-- SAVE -->
        <div class="pt-4 border-t">
          <button
            @click="saveMatch(match)"
            class="w-full bg-green-700 hover:bg-green-800 text-white rounded-xl py-2.5 text-sm font-semibold transition"
            style="background-color: green; padding: 12px 0"
            :disabled="savingId === match.id"
          >
            {{ savingId === match.id ? "Saving..." : "Save Match" }}
          </button>
        </div>
      </div>

      <div class="h-16"></div>
    </div>
  </div>
</template>
