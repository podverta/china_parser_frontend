<script setup lang="ts">
import {
    useSocket,
} from '@/services/socketIo'
import appLeague from './components/app-league.vue'
import appPanel from '@/components/league/app-panel.vue'
import { onUnmounted, ref } from 'vue'

const { openSocket, closeSocket } = useSocket(import.meta.env.VITE_API_URL)

const isAuth = ref(false)
const login = ref('')
const password = ref('')
const leagues = ['IPBL Pro Division', 'Rocket Basketball League', 'IPBL Pro Division Women', 'Rocket Basketball League Women']

onUnmounted(() => {
    closeSocket();
});

const logIn = () => {
    if (login.value === import.meta.env.VITE_APP_LOGIN && password.value === import.meta.env.VITE_APP_PASSWORD) {
        isAuth.value = true
        openSocket()
    } 
}
</script>

<template>
    <template v-if="!isAuth">
        <div class="authorization-wrp">
            <form class="authorization-form">
                <input
                    class="custom-input"
                    type="text"
                    placeholder="Логин"
                    v-model="login"
                >
                <input
                    class="custom-input"
                    type="password"
                    placeholder="Пароль"
                    v-model="password"
                >
                <div
                    class="btn"
                    @click="logIn"
                >Войти</div>
            </form>
        </div>
    </template>
    <template v-else>

        <div class="app-wrp">
            <app-league
                class="league"
                :name="'IPBL Pro Division'"
                :color-title="'#0094FF'"
            />
            <app-league
                class="league"
                :name="'Rocket Basketball League'"
                :color-title="'#FF5C00'"
            />
            <app-league
                class="league"
                :name="'IPBL Pro Division Women'"
                :color-title="'text-shadow: 0px 0px 1px #000;'"
            />
            <app-league
                class="league"
                :name="'Rocket Basketball League Women'"
                :color-title="'#FF00C7'"
            />
            <div class="panel-wrp">
                <div>new</div>
                <div class="panel">
                    <app-panel
                        v-for="(name, idx) in leagues"
                        :key="'league' + idx"
                        :name="name"
                    />

                </div>
                <div>old</div>
            </div>
        </div>
    </template>
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

.authorization-wrp {
    height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.authorization-form {
    max-height: 300px;
    border-radius: 3px;
    border: 2px solid var(--LightBlack, #1F2B3E);
    background: #F9F9F9;
    display: flex;
    flex-direction: column;
    grid-gap: 16px;
    padding: 20px;
}

.custom-input {
    display: block;
    margin: 0;
    padding: 10px 15px;
    color: inherit;
    width: 100%;
    font-family: inherit;
    font-size: 20px;
    font-weight: inherit;
    line-height: 100%;
    border: none;
    border-radius: 0.4rem;
    transition: box-shadow .3s;
}

.custom-input:placeholder {
    color: #B0BEC5;
}

.custom-input:focus {
    outline: none;
    box-shadow: 4px 8px 6px 0px rgba(34, 60, 80, 0.14);
}

.btn {
    border-radius: 3px;
    font-size: 20px;
    background: var(--LightBlue, #D0DEEA);
    width: 100%;
    padding: 10px;
    cursor: pointer;
    text-align: center;
}
</style>
