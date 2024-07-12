import { io, Socket } from 'socket.io-client';
import { type LeagueData, type LeagueStorage } from '@/interfaces';
import { reactive, ref, onUnmounted, nextTick, watch } from 'vue';

export const leagueStorage: LeagueStorage = reactive({
    'IPBL Pro Division': { value: [], maxLength: 10 },
    'IPBL Pro Division Women': { value: [], maxLength: 10 },
    'Rocket Basketball League Women': { value: [], maxLength: 10 },
    'Rocket Basketball League': { value: [], maxLength: 10 },
});

const addToLeague = (name: string, data: LeagueData[], site: string) => {
    try {
        const league = leagueStorage[name];
        if (!Array.isArray(league.value)) {
            throw new Error(`${name} не является массивом`);
        }

        nextTick(() => {
            league.value.unshift({ content: data, site });

            if (league.value.length > league.maxLength) {
                league.value.pop();
            }
        });
    } catch (error) {
        console.error(`Ошибка при обновлении ${name}:`, error);
    }
};

export const useSocket = (URL: string) => {
    const socket = ref<Socket | null>(null);

    const openSocket = () => {
        socket.value = io(URL, {
            transports: ['websocket', 'polling', 'flashsocket'],
        });

        socket.value.on('connect', () => {
            console.log('Соединение установлено');
        });

        socket.value.on('disconnect', () => {
            console.log('Соединение разорвано');
        });

        socket.value.on('message', (data: string) => {
            try {
                if (data) {
                    const parsedData = JSON.parse(data);
                    parsedData['akty.com'] ? processLeagueData(parsedData, 'akty.com') : processLeagueData(parsedData, 'fb.com');
                }
            } catch (error) {
                console.error('Ошибка при обработке сообщения сокета:', error);
            }
        });

        socket.value.on('error', (error: any) => {
            console.error('Ошибка сокета:', error);
        });
    };

    const closeSocket = () => {
        if (socket.value) {
            socket.value.disconnect();
            socket.value = null;
        }
    };

    return {
        openSocket,
        closeSocket,
    };
};

const processLeagueData = (data: any, site: string) => {
    try {
        for (const key in data[site]) {
            if (leagueStorage[key]) {
                addToLeague(key, data[site][key], site);
            }
        }
    } catch (error) {
        console.error('Ошибка при обработке данных лиги:', error);
    }
};

// Пример использования watch для отслеживания изменений
watch(
    () => leagueStorage,
    (newVal, oldVal) => {
        console.log('Данные лиги обновлены:', newVal);
    },
    { deep: true }
);
