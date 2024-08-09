import {ref} from 'vue'

// export const colorHistory = ref()

export const fetchColorHistory = async (site: string, league: string, opponent_0: string, opponent_1: string) => {
	try {
	  const response = await fetch(`http://10.10.10.34:8123/get-game/${site}/${league}/${opponent_0}/${opponent_1}`, {
		method: 'GET',
		headers: {
		  'Content-Type': 'application/json',
		},
	  });
  
	  const data = await response.json(); 
	  return data.games; 
	} catch (error) {
	  console.error('Error fetching color history:', error);
	  throw error;
	}
};