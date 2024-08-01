<template v-if="item">
	<div
		class="table-row"
		:class="{ gray: item?.site === 'fb.com' }"
	>

		<div class="table-row--item">{{ item?.site }}</div>
		<div
			class="table-row--item"
			:style="`background: ${getColor(item?.content[matchIdx]?.opponent_0?.handicap_bet)}`"
		>
			{{ item?.content[matchIdx]?.opponent_0?.handicap_bet || '-' }}
		</div>
		<div
			class="table-row--item"
			:style="`background: ${getColor(item?.content[matchIdx]?.opponent_1?.handicap_bet)}`"
		>
			{{ item?.content[matchIdx]?.opponent_1?.handicap_bet || '-' }}
		</div>
		<div
			class="table-row--item"
			:style="`background: ${getColor(item?.content[matchIdx]?.opponent_0?.total_bet)}`"
		>
			{{ item?.content[matchIdx]?.opponent_0?.total_bet || '-' }}
		</div>
		<div
			class="table-row--item"
			:style="`background: ${getColor(item?.content[matchIdx]?.opponent_1?.total_bet)}`"
		>
			{{ item?.content[matchIdx]?.opponent_1?.total_bet || '-' }}
		</div>
		<div
			class="table-row--item"
			style="font-size: 14px;"
		>
			{{ item?.content[matchIdx]?.server_time ? formatDateTime(item?.content[matchIdx]?.server_time) : '-' }}
		</div>
	</div>
</template>

<script setup lang="ts">
const { matchIdx, item } = defineProps(['matchIdx', 'item', 'name', 'updated'])

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

const formatDateTime = (input: string): string => {
	const date = new Date(input)
	let hours = date.getHours()
	const minutes = date.getMinutes().toString().padStart(2, '0')
	const seconds = date.getSeconds().toString().padStart(2, '0')

	hours = hours % 12 || 12 // Преобразование "0" в "12" для 12-часового формата

	return `${hours}:${minutes}:${seconds}`
}
</script>

<style scoped>
.table-row {
	display: grid;
	grid-template-columns: 2fr repeat(4, 1fr) 1fr;
}

.gray {
	background: '#D0DEEA';
}

.table-row:not(:last-of-type) {
	border-bottom: 1px solid #1f2b3e;
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
</style>