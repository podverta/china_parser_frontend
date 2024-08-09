import { io, Socket } from 'socket.io-client';
import { type LeagueData, type LeagueStorage, type RateData } from '@/interfaces';
import { reactive, ref } from 'vue';
import { store} from '@/store';

export const leagueStorage: LeagueStorage = reactive({
    'IPBL Pro Division': { value: {}, maxLength: 100 },
    'IPBL Pro Division Women': { value: {}, maxLength: 100 },
    'Rocket Basketball League Women': { value: {}, maxLength: 100 },
    'Rocket Basketball League': { value: {}, maxLength: 100 },
});

export const getColor = (
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

const addToHistory = (rate: RateData, name: string, matchKey:string,  )=>{
    for (const key in rate) {
        if(key === 'server_time' || key === 'total_point' || key === 'handicap_point_0' || key === 'handicap_point_1') continue
        if (Object.prototype.hasOwnProperty.call(rate, key)) {
            const element = rate[key];
            const color = element ? getColor(element) : ''
            if(color){
                store.dispatch('matchColorHistory/setMatchColorHistory', {
                    league: name,
                    key: matchKey,
                    color
                });
            }
        }
    }
}

const isMatchEnd = (data: LeagueData)=>{
    const { rate, time_game } = data;

    for (const key in rate) {
      if (key !== 'server_time' && rate[key] !== '') {
        return false; 
      }
    }
  
    return time_game.includes('IV 00');
}

const addToLeague = (name: string, data: LeagueData[], site: string) => {
    try {
        const league = leagueStorage[name];

        data.forEach((match)=>{   
            const matchKey = `${match.opponent_0}-${match.opponent_1}`;
            if(isMatchEnd(match)){
                if(league.value[matchKey]){
                    console.log('end');
                    delete league.value[matchKey];
                    store.dispatch('matchColorHistory/removeMatchColorHistory', {
                        league: name,
                        key: matchKey,
                      });
                }
            } else{
                const newEntry = { content: match, site };
                const buffer = ref(league?.value[matchKey] ? league?.value[matchKey]: []);
                league.value[matchKey] = [newEntry, ...buffer.value];
                
                if (league.value[matchKey].length > league.maxLength) {
                    league.value[matchKey].length = league.maxLength;
                }
                
                addToHistory(match.rate, name, matchKey)
            }    
        })
            
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
