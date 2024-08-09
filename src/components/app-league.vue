<template>
    <div class="league">
        <div
            class="league-title"
            :style="`color:${colorTitle}`"
        >
            {{ name }}
            <div
                class="arrow"
                @click="state.collapse = !state.collapse"
            >
                <icon-arrow
                    class="arrow-icon"
                    style="pointer-events: none"
                    @click="state.collapse = !state.collapse"
                    :style="`transform: rotate(${state.collapse ? '720deg' : '0deg'})`"
                />
            </div>
        </div>
        <div class="league-matchs">
            <template v-if="Object.keys(leagueStorage[name].value).length">
                <app-table
                    v-for="(match, key, idx) in leagueStorage[name].value"
                    :key="'match' + idx"
                    :name="name"
                    :collapse="state.collapse"
                    :idx="idx"
                    :opponents="key as string"
                    :match="match"
                    class="league-matchs--match"
                />
            </template>
            <template v-else>
                <div class="error">Матчей пока нет</div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import appTable from '@/components/league/app-table.vue'
import iconArrow from '@/components/icons/iconArrow.vue'
import { reactive } from 'vue';
import type { League } from '@/interfaces';
import { leagueStorage } from '@/services/socketIo';
const { name, colorTitle } = defineProps(['name', 'colorTitle'])

const state = reactive({
    collapse: false,
    league: [] as League[],
});
</script>

<style scoped>
.error {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--Blue-Black, #2d3643);
    font-family: Ubuntu;
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
}

.league-title {
    border-radius: 3px;
    background: var(--LightBlue, #d0deea);
    text-align: center;
    color: #fff;
    font-family: Ubuntu;
    font-size: 26px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    padding: 7px;
    position: relative;
}

.arrow {
    position: absolute;
    padding: 6px 4px;
    top: 50%;
    right: 10px;
    border-radius: 3px;
    background: #f9f9f9;
    display: flex;
    transform: translateY(-50%);
    cursor: pointer;
}

.league-matchs {
    display: flex;
    grid-gap: 16px;
    height: calc(100% - 28px);
}

.arrow-icon {
    transition: 0.5s;
}

.league-matchs--match {
    max-width: 100%;
    width: 100%;
    flex: 1 1 auto;

}
</style>
