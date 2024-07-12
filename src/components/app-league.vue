<template>
    <div class="league">
        <div
            class="league-title"
            :style="colorTitle.includes('text-shadow') ? colorTitle : `color:${colorTitle}`"
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
                    :style="`transform: rotate(${state.collapse ? '180deg' : '0deg'})`"
                />
            </div>
        </div>
        <div class="league-matchs">
            <template v-if="state.league.length > 0 && state.league[0]?.content">
                <app-table
                    v-for="(match, idx) in state.league[0].content"
                    :key="'match' + idx"
                    :collapse="state.collapse"
                    :score="match.opponent_0.score + ' - ' + match.opponent_1.score"
                    :time="match.process_time"
                    :idx="idx"
                    :opponent0="match.opponent_0.name"
                    :opponent1="match.opponent_1.name"
                    @send-color="sendColor"
                    :match="state.league"
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
import { reactive, ref } from 'vue';
import type { League, LeagueStorage } from '@/interfaces';
const { name, colorTitle } = defineProps(['name', 'colorTitle'])
import { leagueStorage } from '@/services/socketIo';

const colorList = ref<string[]>(['#fff', '#fff', '#fff', '#fff', '#fff'])
const emit = defineEmits(['sendColorList'])

const state = reactive({
    collapse: false,
    league: [] as League[],
});

const sendColor = (color: string) => {
    colorList.value?.unshift(color)
    colorList.value?.length > 5 ? colorList.value.pop() : ''
    emit('sendColorList', colorList.value)
}

const leagueMapping: Record<string, keyof LeagueStorage> = {
    'IPBL Pro Division Women': 'IPBL Pro Division Women',
    'IPBL Pro Division': 'IPBL Pro Division',
    'Rocket Basketball League Women': 'Rocket Basketball League Women',
    'Rocket Basketball League': 'Rocket Basketball League',
};

// Функция для загрузки переменной
const loadVariable = async (name: string) => {
    try {
        const variableName = leagueMapping[name];
        if (variableName) {
            state.league = leagueStorage[variableName].value;
        } else {
            console.error('Unknown league name:', name);
        }
    } catch (error) {
        console.error('Error loading variable:', error);
    }
};

loadVariable(name)
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
    height: 100%;
}

.arrow-icon {
    transition: 0.3s;
}

.league-matchs--match {
    max-width: 100%;
    width: 100%;

}
</style>
