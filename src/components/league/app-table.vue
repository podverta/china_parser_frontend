<template>
    <div class="match-wrp">
        <div class="match-title">
            <div class="match-title--participants">
                {{ props.opponents }}
            </div>
            <div class="match-title--score">
                {{ props.match[0].content.score_game }}
            </div>
            <div class="match-title--counter">
                <div
                    class="count"
                    v-for="(color, idx) in colors"
                    :key="'color' + idx"
                >
                    <div :style="'background-color: ' + color"></div>
                    {{ getColorHistory(props.name, props.opponents, color) }}
                </div>
            </div>
        </div>
        <div class="table-wrp">
            <div
                class="table"
                v-if="!collapse"
            >
                <template
                    v-for="(item, index) in props.match"
                    :key="'item' + index"
                >
                    <app-row
                        v-if="item"
                        :item="item"
                        :name="name"
                    ></app-row>
                </template>

            </div>
            <div v-else>
                <div
                    class="table"
                    v-if="colorHistory"
                >
                    <template
                        v-for="(color, idx) in colorHistory"
                        :key="'color' + idx"
                    >
                        <template
                            v-for="(item, key) in color"
                            :key="'item' + key"
                        >
                            <div
                                class="table-row--collapse"
                                v-if="key !== 'server_time' && key !== 'total_point' && key !== 'handicap_point_0' && key != 'handicap_point_1' && getColor(item)"
                            >
                                <div class="table-row--item">{{ getKey(key as string, color) }}</div>
                                <div
                                    class="table-row--item"
                                    :style="{ backgroundColor: getColor(item) }"
                                >{{ item }}</div>

                                <div
                                    class="table-row--item"
                                    style="font-size: 14px;"
                                >
                                    {{ color.server_time }}
                                </div>
                            </div>
                        </template>
                    </template>
                </div>
                <div v-else>
                    нет событий
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import appRow from '@/components/table/app-row.vue'
import { useStore } from 'vuex'
import { computed, ref, watch } from 'vue'
import type { League, RateData } from '@/interfaces';
import { fetchColorHistory } from '@/services';
import { getColor } from '@/services/socketIo';

interface PropsTable {
    name: string,
    opponents: string,
    collapse: boolean,
    match: League[]
}
const props = defineProps<PropsTable>()

const colors = ['#FAFF00', '#FF8A00', '#FF0000', '#9E00FF']

const opponent_0 = ref(props.match[0].content.opponent_0)
const opponent_1 = ref(props.match[0].content.opponent_1)

const colorHistory = ref<RateData[]>([])

watch(() => props.collapse, async (newValue) => {
    if (newValue) {
        Promise.allSettled([
            fetchColorHistory('fb.com', props.name, opponent_0.value, opponent_1.value),
            fetchColorHistory('akty.com', props.name, opponent_0.value, opponent_1.value)
        ])
            .then(results => {
                const [result1, result2] = results;

                if (result1.status === 'fulfilled') {
                    colorHistory.value = result1.value;
                } else {
                    console.error('Ошибка при запросе fb.com:', result1.reason);
                }

                if (result2.status === 'fulfilled') {
                    colorHistory.value = [...result2.value, ...colorHistory.value];
                } else {
                    console.error('Ошибка при запросе akty.com:', result2.reason);
                }

                colorHistory.value.sort((a, b) => {
                    return b.server_time.localeCompare(a.server_time);
                });
            })
            .catch(error => {
                console.error('Произошла ошибка при обработке запросов:', error);
            });

    } else {
        colorHistory.value = []
    }
});


const store = useStore()

const getColorHistory = (league: string, key: string, color: string) => {
    return computed(() => store.getters['matchColorHistory/getColorHistory'](league, key, color));
};
const getKey = (key: string, item: RateData) => {
    if (key === 'total_bet_0') return item.total_point + ' O'
    if (key === 'total_bet_1') return item.total_point + ' U'
    if (key === 'handicap_bet_0') return item.handicap_point_0
    if (key === 'handicap_bet_1') return item.handicap_point_1
}
</script>


<style scoped>
.match-title {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    border-radius: 3px;
    background: var(--LightBlue, #d0deea);
    padding: 3px 10px;
    margin-bottom: 10px;
    color: var(--Blue-Black, #2d3643);
    font-family: Ubuntu;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    text-wrap: nowrap;
}

.match-title--score {
    align-self: center;
    justify-self: center;
}

.match-title--counter {
    display: flex;
    align-items: center;
    grid-gap: 4px;
    justify-self: flex-end;
}

.match-title--counter .count {
    display: flex;
    align-items: center;
    grid-gap: 4px;
    border-radius: 3px;
    padding: 2px 4px;
    background: var(--LightBlack, #1F2B3E);
    color: var(--LightBlue, #D0DEEA);


}

.match-title--counter .count div {
    width: 16px;
    height: 14px;
    border-radius: 7px;
}

.table-wrp {
    max-height: 78%;
    height: 100%;
    overflow-y: auto;
    padding-right: 2px;
    background: #fff;
}

.table {
    border-radius: 3px;
    background: #fff;
    border: 2px solid var(--LightBlack, #1f2b3e);
    display: flex;
    flex-direction: column;
}

.table-row.table-title {
    grid-template-columns: repeat(3, 2fr) 1fr;
    background-color: #1f2b3e;
    color: var(--LightBlue, #d0deea);
    text-align: center;
    font-family: Ubuntu;
    font-size: 12px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
}

.table-row--item {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 7px;
}

.table-row--item:not(:last-of-type) {
    border-right: 1px solid #1f2b3e;
}

.table-row--collapse {
    display: grid;
    grid-template-columns: 3fr 6fr 1fr;
}

.table-row--collapse:not(:last-of-type) {
    border-bottom: 1px solid #1f2b3e;
}

.table-row--collapse--item {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1px 16px;
}

.table-row--collapse--item:not(:last-of-type) {
    border-right: 1px solid #1f2b3e;
}

.table-title--collapse--item {
    display: flex;
    align-items: center;
}

.error {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    color: var(--Blue-Black, #2d3643);
    font-family: Ubuntu;
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
}
</style>
