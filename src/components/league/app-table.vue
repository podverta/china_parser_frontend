<template>
    <div class="match-wrp">
        <div class="match-title">
            <div class="match-title--participants">
                {{ opponent0 + ' - ' + opponent1 }}
            </div>
            <div class="match-title--score">
                {{ score }}
            </div>
            <div class="match-title--time">{{ time }}</div>
        </div>
        <div class="table-wrp">
            <div class="table" v-show="!collapse">
                <div class="table-row table-title">
                    <div class="table-row--item">Сайт</div>
                    <div class="table-row--item">{{ opponent0 }}</div>
                    <div class="table-row--item">{{ opponent1 }}</div>
                    <div class="table-row--item">Время</div>
                </div>
                <div
                    class="table-row"
                    :class="{ gray: item?.site === 'fb.com' }"
                    :style="`background-color: ${item?.site === 'fb.com' ? '#D0DEEA' : '#fff'};`"
                    v-for="item in match"
                    :key="'item' + item"
                >
                    <div class="table-row--item">{{ item?.site }}</div>
                    <div
                        class="table-row--item"
                        :style="`background-color: ${getColor(item?.content[idx]?.opponent_0?.handicap_bet, 'Гандикап', item?.content[idx]?.server_time, true)}`"
                    >
                        {{ item?.content[idx]?.opponent_0?.handicap_bet || '-' }}
                    </div>
                    <div
                        class="table-row--item"
                        :style="`background-color: ${getColor(item?.content[idx]?.opponent_1?.handicap_bet, 'Гандикап', item?.content[idx]?.server_time, true)}`"
                    >
                        {{ item?.content[idx]?.opponent_1?.handicap_bet || '-' }}
                    </div>
                    <div
                        class="table-row--item"
                        :style="`background-color: ${getColor(item?.content[idx]?.opponent_0?.total_bet, 'O/U', item?.content[idx]?.server_time, true)}`"
                    >
                        {{ item?.content[idx]?.opponent_0?.total_bet || '-' }}
                    </div>
                    <div
                        class="table-row--item"
                        :style="`background-color: ${getColor(item?.content[idx]?.opponent_1?.total_bet, 'O/U', item?.content[idx]?.server_time, true)}`"
                    >
                        {{ item?.content[idx]?.opponent_1?.total_bet || '-' }}
                    </div>
                    <div class="table-row--item">
                        {{ formatDateTime(item?.content[idx]?.server_time) }}
                    </div>
                </div>
            </div>

            <div v-show="collapse">
                <template v-if="colorHistory.length">
                    <div class="table">
                        <div
                            class="table-row--collapse"
                            v-for="(color, idx) in colorHistory"
                            :key="'color' + idx"
                        >
                            <div class="table-row--item">{{ color.type }}</div>
                            <div
                                class="table-row--item"
                                :style="`background-color: ${color.color}`"
                            ></div>
                            <div class="table-row--item">
                                {{ formatDateTime(color.time) }}
                            </div>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div class="error">Нет событий</div>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'

const { match, opponent0, opponent1, score, idx, time, collapse } = defineProps([
    'match',
    'opponent0',
    'opponent1',
    'score',
    'idx',
    'time',
    'collapse'
])

interface ColorHistory {
    type: string
    color: string
    time: string
}

const colorHistory = ref<ColorHistory[]>([])

const getColor = (
    item: number | undefined,
    type: string = '',
    time: string = '',
    isSetColorHistory = false
): string | undefined => {
    if (item === undefined) return
    if (item <= 1.59) {
        isSetColorHistory ? setColorHistory({ type: type, color: '#9E00FF', time: time }) : ''
        return '#9E00FF'
    }
    if (item <= 1.63) {
        isSetColorHistory ? setColorHistory({ type: type, color: '#FF0000', time: time }) : ''
        return '#FF0000'
    }
    if (item <= 1.68) {
        isSetColorHistory ? setColorHistory({ type: type, color: '#FF8A00', time: time }) : ''
        return '#FF8A00'
    }
    if (item <= 1.73) {
        isSetColorHistory ? setColorHistory({ type: type, color: '#FAFF00', time: time }) : ''
        return '#FAFF00'
    }
    return
}

const setColorHistory = (item: ColorHistory) => {
    colorHistory.value.unshift(item)
    if (colorHistory.value.length > 10) colorHistory.value.pop()
}

const findAndEmitColor = (newVal: any[], idx: number) => {
    const bets = [
        newVal[0].content[idx].opponent_0?.total_bet,
        newVal[0].content[idx].opponent_0?.handicap_bet,
        newVal[0].content[idx].opponent_1?.total_bet,
        newVal[0].content[idx].opponent_1?.handicap_bet
    ]

    bets.forEach((bet) => {
        const color = getColor(bet)
        if (color) {
            emit('sendColor', color)
        }
    })
}

watch(match, (newVal) => findAndEmitColor(newVal, idx))

const formatDateTime = (input: string): string => {
    if (!input) return '-'
    const date = new Date(input.replace(' ', 'T'))
    let hours = date.getHours()
    const minutes = date.getMinutes().toString().padStart(2, '0')

    hours = hours % 12 || 12 // Преобразование "0" в "12" для 12-часового формата

    return `${hours}:${minutes}`
}

const emit = defineEmits(['sendColor'])
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

.match-title--time {
    justify-self: flex-end;
}

.table-wrp {
    max-height: 292px;
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

.table-row {
    display: grid;
    grid-template-columns: 2fr repeat(4, 1fr) 1fr;
}
.table-row:not(:last-of-type) {
    border-bottom: 1px solid #1f2b3e;
}

.table-row.table-title {
    grid-template-columns: repeat(3, 2fr) 1fr;
    background-color: #1f2b3e;
    color: var(--LightBlue, #d0deea);
    text-align: center;
    font-family: Ubuntu;
    font-size: 14px;
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
