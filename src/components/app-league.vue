<template>
    <div class="league">
        <div
            class="league-title"
            :style="colorTitle.includes('text-shadow') ? colorTitle : `color:${colorTitle}`"
        >
            {{ name }}
            <div class="arrow" @click="collapse = !collapse">
                <icon-arrow
                    class="arrow-icon"
                    style="pointer-events: none"
                    @click="collapse = !collapse"
                    :style="`transform: rotate(${collapse ? '180deg' : '0deg'})`"
                />
            </div>
        </div>
        <div class="league-matchs">
            <template v-if="league[0]?.content">
                <app-table
                    v-for="(match, idx) in league[0]?.content"
                    :key="'match' + idx"
                    :collapse="collapse"
                    :score="
                        league[0]?.content[idx].opponent_0?.score +
                        ' - ' +
                        league[0]?.content[idx].opponent_1?.score
                    "
                    :match="league"
                    :time="league[0]?.content[idx].process_time"
                    :idx="idx"
                    :opponent0="league[0]?.content[idx].opponent_0?.name"
                    :opponent1="league[0]?.content[idx].opponent_1?.name"
                    @send-color="sendColor"
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
import { ref } from 'vue'
const { league, name, colorTitle } = defineProps(['league', 'name', 'colorTitle'])

const colorList = ref<string[]>(['#fff', '#fff', '#fff', '#fff', '#fff'])
const emit = defineEmits(['sendColorList'])

const collapse = ref(false)

const sendColor = (color: string) => {
    colorList.value?.unshift(color)
    colorList.value?.length > 5 ? colorList.value.pop() : ''
    emit('sendColorList', colorList.value)
}
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
