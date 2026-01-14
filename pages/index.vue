<script setup lang="ts">
import { ref, computed, onMounted, watchEffect } from "vue";
const supabase = useSupabase();

/**
 * TYPE
 */
type RoundRow = {
  id: number;
  round_name: string;
  start_date: string;
  teamA: { team_name: string } | null;
  teamB: { team_name: string } | null;
  court: number;
};

/**
 * STATE (ROUND)
 */
const rounds = ref<RoundRow[]>([]);
const activeDate = ref<string>("");

/**
 * STATE (LADDERBOARD)
 */
const teams = ref<any[]>([]);
const matches = ref<any[]>([]);

/**
 * FETCH DATA
 */
onMounted(async () => {
  /**
   * FETCH ROUND
   */
  const { data: roundData } = await supabase
    .from("Round")
    .select(
      `
      id,
      round_name,
      start_date,
      teamA:Team!round_team_a_fkey ( team_name ),
      teamB:Team!round_team_b_fkey ( team_name ),
      court
    `
    )
    .order("id");

  rounds.value = roundData || [];
  if (rounds.value.length > 0) {
    activeDate.value = rounds.value[0].start_date;
  }

  /**
   * FETCH TEAMS
   */
  const { data: teamData } = await supabase.from("Team").select(`
      id,
      team_name,
      group:Group!Team_group_id_fkey (
      group_name
    )
    `);

  teams.value = teamData || [];

  /**
   * FETCH MATCHES (SCORED ONLY)
   */
  const { data: matchData } = await supabase
    .from("Match")
    .select(
      `
      team_A,
      team_B,
      score_A,
      score_B
    `
    )
    .not("score_A", "is", null)
    .not("score_B", "is", null);

  matches.value = matchData || [];
});

/**
 * DATE TAB
 */
const dateTabs = computed(() => {
  return [...new Set(rounds.value.map((r) => r.start_date))];
});

watchEffect(() => {
  if (!activeDate.value && dateTabs.value.length > 0) {
    activeDate.value = dateTabs.value[0];
  }
});

/**
 * FILTER ROUND
 */
const filteredRounds = computed(() => {
  return rounds.value.filter(
    (r) => r.start_date === activeDate.value && r.teamA && r.teamB
  );
});

/**
 * FORMAT DATE
 */
const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });

/**
 * LADDERBOARD PER GROUP (SAFE)
 */
const ladderByGroup = computed(() => {
  const result: Record<string, any[]> = {};

  /** INIT TEAM */
  teams.value.forEach((team) => {
    const groupName = team.group?.group_name ?? "Ungrouped";

    if (!result[groupName]) {
      result[groupName] = [];
    }

    result[groupName].push({
      teamId: team.id,
      teamName: team.team_name,
      diff: 0,
      point: 0,
    });
  });

  /** PROCESS MATCH */
  matches.value.forEach((match) => {
    const allTeams = Object.values(result).flat();

    const teamA = allTeams.find((t) => t.teamId === match.team_A);
    const teamB = allTeams.find((t) => t.teamId === match.team_B);

    if (!teamA || !teamB) return;

    teamA.diff += match.score_A - match.score_B;
    teamB.diff += match.score_B - match.score_A;

    if (match.score_A > match.score_B) {
      teamA.point += 1;
    } else if (match.score_B > match.score_A) {
      teamB.point += 1;
    }
  });

  /** SORT */
  Object.keys(result).forEach((group) => {
    result[group].sort((a, b) => {
      if (b.point !== a.point) return b.point - a.point;
      return b.diff - a.diff;
    });
  });

  return result;
});
</script>

<template>
  <div class="space-y-6">
    <!-- HERO -->
    <section class="h-44">
      <img src="/hero-tournament.jpg" class="w-full h-full object-cover" />
    </section>

    <!-- DATE TAB -->
    <section class="px-4">
      <div class="flex gap-3 overflow-x-auto hide-scrollbar">
        <button
          v-for="date in dateTabs"
          :key="date"
          @click="activeDate = date"
          class="px-4 py-2 rounded-full border font-medium whitespace-nowrap"
          :class="
            activeDate === date
              ? 'border-orange-500 text-orange-500'
              : 'border-gray-300 text-gray-600'
          "
        >
          {{ formatDate(date) }}
        </button>
      </div>
    </section>

    <!-- ROUND CARD -->
    <section class="px-4">
      <div class="flex gap-4 overflow-x-auto hide-scrollbar">
        <NuxtLink
          v-for="round in filteredRounds"
          :key="round.id"
          :to="`/round/${round.id}`"
          class="min-w-[200px] bg-green-800 text-white rounded-xl p-4 text-center min-h-40"
        >
          <div class="text-sm opacity-80">Court {{ round.court }}</div>
          <div class="mt-3 text-sm font-semibold">
            {{ round.teamA.team_name }}
          </div>
          <div class="text-orange-400 my-1 text-xs">VS</div>
          <div class="text-sm font-semibold">{{ round.teamB.team_name }}</div>
        </NuxtLink>
      </div>
    </section>

    <!-- LADDERBOARD -->
    <section class="px-4 space-y-6">
      <div
        v-for="(rows, groupName) in ladderByGroup"
        :key="groupName"
        class="bg-white rounded-2xl p-4 shadow-sm"
      >
        <div class="font-semibold text-lg mb-4">
          {{ groupName }}
        </div>

        <div
          class="grid grid-cols-[28px_1fr_48px_48px] text-xs text-gray-400 pb-2 border-b"
        >
          <div>#</div>
          <div>Team</div>
          <div class="text-right">Diff</div>
          <div class="text-right">Pts</div>
        </div>

        <div
          v-for="(row, index) in rows"
          :key="row.teamId"
          class="grid grid-cols-[28px_1fr_48px_48px] py-2 text-sm"
        >
          <div>{{ index + 1 }}</div>
          <NuxtLink
            :to="`/team/${row.teamId}`"
            class="truncate text-green-700 font-medium"
          >
            {{ row.teamName }}
          </NuxtLink>

          <div class="text-right">{{ row.diff }}</div>
          <div class="text-right font-semibold">{{ row.point }}</div>
        </div>
      </div>
    </section>

    <div class="h-20"></div>
  </div>
</template>
