import { io } from 'socket.io-client'
import { type League, type LeagueData } from '@/interfaces'
import { ref } from 'vue'

export const IPBLPro_Division_Woman = ref<League[]>([])
export const IPBLPro_Division = ref<League[]>([])
export const RBLW = ref<League[]>([])
export const RBL = ref<League[]>([])

export const openSocket = (URL: string) => {
    const socket = io(URL, {
        transports: ['websocket', 'polling', 'flashsocket']
    }
        )

    socket.on('connect', () => {
        console.log('connect')
    })

    socket.on('disconnect', () => {
        console.log('disconnect')
    })

    socket.on('message', (data: string) => {
        if (data) {
            processLeagueData(JSON.parse(data), 'akty.com')
            processLeagueData(JSON.parse(data), 'fb.com')
        }
    })
}

const processLeagueData = (data: any, site: string) => {
    const leagues = [
        { key: 'IPBL Pro Division', handler: addToIPBLPro_Division },
        { key: 'IPBL Pro Division Women', handler: addToIPBLPro_Division_Woman },
        { key: 'Rocket Basketball League Women', handler: addToRBLW },
        { key: 'Rocket Basketball League', handler: addToRBL }
    ]

    leagues.forEach((league) => {
        if (data[site]?.[league.key]) {
            league.handler(data[site][league.key], site)
        }
    })
}

const addToIPBLPro_Division = (data: LeagueData[], site: string) => {
    IPBLPro_Division.value?.unshift({ content: data, site: site })
    IPBLPro_Division.value.length > 10 ? IPBLPro_Division.value.pop() : ''
}
const addToIPBLPro_Division_Woman = (data: LeagueData[], site: string) => {
    IPBLPro_Division_Woman.value?.unshift({ content: data, site: site })
    IPBLPro_Division_Woman.value.length > 10 ? IPBLPro_Division_Woman.value.pop() : ''
}
const addToRBLW = (data: LeagueData[], site: string) => {
    RBLW.value?.unshift({ content: data, site: site })
    RBLW.value.length > 10 ? RBLW.value.pop() : ''
}
const addToRBL = (data: LeagueData[], site: string) => {
    RBL.value?.unshift({ content: data, site: site })
    RBL.value.length > 10 ? RBL.value.pop() : ''
}
