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
            <div
                class="table"
                v-if="!collapse"
            >
                <div class="table-row table-title">
                    <div class="table-row--item">Сайт</div>
                    <div class="table-row--item">{{ opponent0 }}</div>
                    <div class="table-row--item">{{ opponent1 }}</div>
                    <div class="table-row--item">Время</div>
                </div>
                <template
                    v-for="(item, index) in match"
                    :key="'item' + index"
                >
                    <app-row
                        v-if="item"
                        :match-idx="idx"
                        :item="item"
                        :index="index"
                        :name="name"
                    ></app-row>
                </template>

            </div>

            <div v-else>
                <template v-if="matchColorHistory?.length">
                    <div class="table">
                        <div
                            class="table-row--collapse"
                            v-for="(color, idx) in matchColorHistory"
                            :key="'color' + idx"
                        >
                            <div class="table-row--item">{{ color.type }}</div>
                            <div
                                class="table-row--item"
                                :style="{ backgroundColor: color.color }"
                            ></div>
                            <div
                                class="table-row--item"
                                style="font-size: 14px;"
                            >
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
import appRow from '@/components/table/app-row.vue'
import { useStore } from 'vuex';
import { computed } from 'vue'

const store = useStore()


const { match, opponent0, opponent1, score, idx, time, name, collapse } = defineProps([
    'match',
    'opponent0',
    'opponent1',
    'score',
    'idx',
    'time',
    'collapse', 'name'
])

const matchColorHistory = computed(() => {
    return store.getters['matchColorHistory/getColorHistory'](name, `key-${idx}`)
})

const formatDateTime = (input: string): string => {
    const date = new Date(input)
    let hours = date.getHours()
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')

    hours = hours % 12 || 12 // Преобразование "0" в "12" для 12-часового формата

    return `${hours}:${minutes}:${seconds}`
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

.match-title--time {
    justify-self: flex-end;
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
