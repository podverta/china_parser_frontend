import {ref} from 'vue'

export const colorHistory = ref()

export const fetchColorHistory = async () => {
	try {
	  const response = await fetch('https://example.com/api/color-history', {
		method: 'GET',
		headers: {
		  'Content-Type': 'application/json',
		},
	  });
  
	  if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	  }
  
	  const data = await response.json(); 
	  colorHistory.value = data
	  return data; 
	} catch (error) {
	  console.error('Error fetching color history:', error);
	  throw error;
	}
  };