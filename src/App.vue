<script setup lang="ts">
import {
    useSocket,
} from '@/services/socketIo'
import appLeague from './components/app-league.vue'
import appPanel from '@/components/league/app-panel.vue'
import { ref, onUnmounted } from 'vue'

const { openSocket, closeSocket } = useSocket(import.meta.env.VITE_API_URL)

openSocket()

onUnmounted(() => {
    closeSocket();
});

interface Panel {
    colorsList: string[]
    color: string
}

const colorsIPBL篮球专业组 = ref<Panel>({
    colorsList: ['#fff', '#fff', '#fff', '#fff', '#fff'],
    color: 'background: #0094FF;'
})
const colorsIPBL女子篮球专业组 = ref<Panel>({
    colorsList: ['#fff', '#fff', '#fff', '#fff', '#fff'],
    color: 'background: #FFF;box-shadow: 0px 0px 1.5px 0px rgba(0, 0, 0, 0.20);'
})
const colors火箭女子篮球联盟 = ref<Panel>({
    colorsList: ['#fff', '#fff', '#fff', '#fff', '#fff'],
    color: 'background: #FF00C7;'
})
const colors火箭篮球联盟 = ref<Panel>({
    colorsList: ['#fff', '#fff', '#fff', '#fff', '#fff'],
    color: 'background: #FF5C00;'
})
</script>

<template>
    <div class="app-wrp">
        <app-league
            class="league"
            :name="'IPBL Pro Division'"
            :color-title="'#0094FF'"
            @send-color-list="(colorsList: any) => {
                colorsIPBL篮球专业组.colorsList = colorsList
            }
                "
        />
        <app-league
            class="league"
            :name="'Rocket Basketball League'"
            :color-title="'#FF5C00'"
            @send-color-list="(colorsList: any) => {
                colors火箭篮球联盟.colorsList = colorsList
            }
                "
        />
        <app-league
            class="league"
            :name="'IPBL Pro Division Women'"
            :color-title="'text-shadow: 0px 0px 1px #000;'"
            @send-color-list="(colorsList: any) => {
                colorsIPBL女子篮球专业组.colorsList = colorsList
            }
                "
        />
        <app-league
            class="league"
            :name="'Rocket Basketball League Women'"
            :color-title="'#FF00C7'"
            @send-color-list="(colorsList: any) => {
                colors火箭女子篮球联盟.colorsList = colorsList
            }
                "
        />

        <div class="panel-wrp">
            <div>new</div>
            <div class="panel">
                <app-panel :colors="colorsIPBL篮球专业组" />
                <app-panel :colors="colors火箭篮球联盟" />
                <app-panel :colors="colorsIPBL女子篮球专业组" />
                <app-panel :colors="colors火箭女子篮球联盟" />
            </div>
            <div>old</div>
        </div>
    </div>
</template>

<style scoped>
.app-wrp {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    width: 100%;
    height: 100%;
    position: relative;
    overflow-x: auto;
}

.league {
    width: 100%;
    display: flex;
    flex-direction: column;
    grid-gap: 14px;
    height: 50vh;
    justify-self: center;
    padding: 33px 14px 33px 18px;
}

.league:first-of-type {
    border-bottom: 1px solid #d0deea;
    border-right: 1px solid #d0deea;
}

.league:last-of-type {
    border-top: 1px solid #d0deea;
    border-left: 1px solid #d0deea;
}

.league:nth-child(2) {
    border-left: 1px solid #d0deea;
    border-bottom: 1px solid #d0deea;
}

.league:nth-child(3) {
    border-top: 1px solid #d0deea;
    border-right: 1px solid #d0deea;
}

.league-title {
    border-radius: 3px;
    background: var(--LightBlue, #d0deea);
    color: #0094ff;
    text-align: center;
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

.panel-wrp {
    position: absolute;
    transform: translateY(-50%) translateX(-50%);
    top: 50%;
    left: 50%;
    display: flex;
    grid-gap: 2px;
    color: var(--Blue-Black, #2d3643);
    text-align: center;
    font-family: Ubuntu;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
}

.panel {
    border-radius: 10px;
    background: var(--LightBlue, #d0deea);
    display: flex;
    padding: 7px 2px;
}

.panel-part {
    display: flex;
    grid-gap: 9px;
    padding: 0 10px;
    border-right: 1px solid #f9f9f9;
    border-left: 1px solid #f9f9f9;
}

.panel-part:first-of-type {
    border-left: unset;
}

.panel-part:last-of-type {
    border-right: unset;
}

.panel-part--coef-color {
    background-color: #f00;
    width: 16px;
    height: 14px;
    border-radius: 7px;
    box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.25) inset;
}
</style>
