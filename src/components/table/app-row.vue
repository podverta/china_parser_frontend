<template v-if="item">
	<div
		class="table-row"
		:class="{ gray: item?.site === 'fb.com' }"
	>
		<div class="table-row--item">{{ item?.content?.time_game || '-' }}</div>
		<div class="table-row--item gray">{{ item?.content?.rate.total_point || '-' }}</div>
		<div
			class="table-row--item"
			:style="`background: ${getColor(item?.content?.rate?.total_bet_0)}`"
		>
			{{ item?.content?.rate?.total_bet_0 || '-' }}
		</div>
		<div
			class="table-row--item"
			:style="`background: ${getColor(item?.content?.rate?.total_bet_1)}`"
		>
			{{ item?.content?.rate?.total_bet_1 || '-' }}
		</div>
		<div class="table-row--item gray">
			{{ item?.content?.rate?.handicap_point_0 || '-' }}
		</div>
		<div
			class="table-row--item"
			:style="`background: ${getColor(item?.content?.rate?.handicap_bet_0)}`"
		>
			{{ item?.content?.rate?.handicap_bet_0 || '-' }}
		</div>
		<div class="table-row--item gray">
			{{ item?.content?.rate?.handicap_point_1 || '-' }}
		</div>
		<div
			class="table-row--item"
			:style="`background: ${getColor(item?.content?.rate?.handicap_bet_1)}`"
		>
			{{ item?.content?.rate?.handicap_bet_1 || '-' }}
		</div>
		<div class="table-row--item">
			{{ item?.content?.server_time ? item?.content?.server_time : '-' }}
		</div>
	</div>
</template>

<script setup lang="ts">
const { item } = defineProps(['item'])

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
</script>

<style scoped>
.table-row {
	display: grid;
	grid-template-columns: 2fr repeat(7, 1fr) 1fr;
	font-family: Ubuntu;
	font-size: 12px;
	font-style: normal;
	font-weight: 500;
	line-height: normal;
}

.table-row.gray {
	background-color: #D0DEEA;
}

.table-row:not(:last-of-type) {
	border-bottom: 1px solid #3e576c;
}

.table-row--item {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 7px;
}

.table-row--item.gray {
	background-color: #1F2B3E;
	color: #CCE7FF;
}

.table-row--item:not(:last-of-type) {
	border-right: 1px solid #1f2b3e;
}
</style>