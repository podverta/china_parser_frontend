<template>
    <div class="match-wrp">
        <div class="match-title">
            <div class="match-title--participants">
                {{ opponents }}
            </div>
            <div class="match-title--score">
                {{ match[0].content.score_game }}
            </div>
            <div class="match-title--counter">
                <div
                    class="count"
                    v-for="(color, idx) in colors"
                    :key="'color' + idx"
                >
                    <div :style="'background-color: ' + color"></div>
                    {{ getColorHistory(name, opponents, color) }}
                </div>
            </div>
        </div>
        <div class="table-wrp">
            <div
                class="table"
                v-if="!collapse"
            >
                <template
                    v-for="(item, index) in match"
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
                <div class="table">
                    <div
                        class="table-row--collapse"
                        v-for="(color, idx) in 3"
                        :key="'color' + idx"
                    >
                        <div class="table-row--item"></div>
                        <div class="table-row--item"></div>
                        <!-- :style="{ backgroundColor: color.color }" -->
                        <div
                            class="table-row--item"
                            style="font-size: 14px;"
                        >
                            <!-- {{ time }} -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import appRow from '@/components/table/app-row.vue'
import { useStore } from 'vuex'
import { computed } from 'vue'
const { match, opponents, name, collapse } = defineProps([
    'match',
    'opponents', 'collapse',
    'name'
])

const colors = ['#FAFF00', '#FF8A00', '#FF0000', '#9E00FF']

const store = useStore()

const getColorHistory = (league: string, key: string, color: string) => {
    return computed(() => store.getters['matchColorHistory/getColorHistory'](league, key, color));
};
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
