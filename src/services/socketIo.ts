import { io, Socket } from 'socket.io-client';
import { type LeagueData, type LeagueStorage } from '@/interfaces';
import { reactive, ref } from 'vue';
import { store} from '@/store';

export const leagueStorage: LeagueStorage = reactive({
    'IPBL Pro Division': { value: {}, maxLength: 100 },
    'IPBL Pro Division Women': { value: {}, maxLength: 100 },
    'Rocket Basketball League Women': { value: {}, maxLength: 100 },
    'Rocket Basketball League': { value: {}, maxLength: 100 },
});

const getColor = (
    item: string | undefined,
): string | undefined => {
    if (!item) return
    const itemBuff = +item
    if (itemBuff <= 1.73 && itemBuff >= 1.69) {
        return '#FAFF00'; // Желтый
    }
    else if (itemBuff <= 1.68 && itemBuff >= 1.64) {
        return '#FF8A00'; // Оранжевый
    }
    else if (itemBuff <= 1.63 && itemBuff > 1.59) {
        return '#FF0000'; // Красный
    }
    else if (itemBuff <= 1.59) {
        return '#9E00FF'; // Фиолетовый
    } else {
        return
    }
}


const addToLeague = (name: string, data: LeagueData[], site: string) => {
    try {
        const league = leagueStorage[name];
        // if (!Array.isArray(league.value)) {
        //     throw new Error(`${name} не является массивом`);
        // }

        data.forEach((match, idx)=>{
            if(match.changed){
                const newEntry = { content: match, site };  
                const matchKey = `${match.opponent_0}-${match.opponent_1}`;
                const test = ref(league?.value[matchKey] ? league?.value[matchKey]: []);
                league.value[matchKey] = [newEntry, ...test.value];
                
                if (league.value[matchKey].length > league.maxLength) {
                    league.value[matchKey].length = league.maxLength;
                }
            }
        })
        
        // newEntry.content.forEach((match, idx) => {

            // for (const key in match) {
                // if (key === 'opponent_0' || key === 'opponent_1') {
                //     for (const oppenent_key in match[key]) {
                //         let color: string | undefined = '';
                //         let type = '';
        
                //         if (oppenent_key === 'handicap_bet') {
                //             type = 'Гандикап';
                //             color = getColor(match[key][oppenent_key]);
                //         } else if (oppenent_key === 'total_bet') {
                //             type = 'O/U';
                //             color = getColor(match[key][oppenent_key]);
                //         }
        
                //         if (color) {
                //             store.dispatch('historyColor/setColorHistory', {
                //                 name,
                //                 color
                //               });                         
                //             if (type) {
                //                 store.dispatch('matchColorHistory/setMatchColorHistory', {
                //                     league: name,
                //                     key: `key-${idx}`,
                //                     item: {
                //                       time: match.server_time,
                //                       color,
                //                       type
                //                     }
                //                 });
                //             }
                //         }
                //     }
                // }
            // }
        // });

        // if (!league.value.some(item => item.content === data && item.site === site)) {
        //     league.value = [newEntry, ...test.value];
        // }

        // if (league.value.length > league.maxLength) {
        //     league.value.length = league.maxLength;
        // }
      
    } catch (error) {
        console.error(`Ошибка при обновлении ${name}:`, error);
    }
};



export const useSocket = (URL: string) => {
    const socket = ref<Socket | null>(null);

    const openSocket = () => {
        socket.value = io(URL, {
            transports: ['websocket', 'polling', 'flashsocket'], 
            auth: {
                socket_key: '1951a1a5-e017-4299-be60-022e52a0d099',
              }
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
        })
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
