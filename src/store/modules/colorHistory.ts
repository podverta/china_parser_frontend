import { type Module } from 'vuex';

interface ColorHistoryItem {
  colorPanel: string[];
  color: string;
}

export type ColorHistory = Record<string, ColorHistoryItem>;

const state = (): ColorHistory => ({
  'IPBL Pro Division': {
    colorPanel: ['#fff','#fff','#fff','#fff','#fff'],
    color: 'background:#0094FF'
  },
  'Rocket Basketball League': {
    colorPanel: ['#fff','#fff','#fff','#fff','#fff'],
    color: 'background:#FF5C00'
  },
  'IPBL Pro Division Women': {
    colorPanel: ['#fff','#fff','#fff','#fff','#fff'],
    color: 'background: #FFF;box-shadow: 0px 0px 1.5px 0px rgba(0, 0, 0, 0.20);'
  },
  'Rocket Basketball League Women': {
    colorPanel: ['#fff','#fff','#fff','#fff','#fff'],
    color: 'background:#FF00C7'
  }
});

const mutations = {
  setColorHistory(state: ColorHistory, payload: { name: string; color: string }) {
    if (state[payload.name]) {
      state[payload.name].colorPanel = [payload.color, ...state[payload.name].colorPanel];
      if (state[payload.name].colorPanel.length > 5) {
        state[payload.name].colorPanel = state[payload.name].colorPanel.slice(0, 5);
      }
    } else {
      console.error(`League ${payload.name} not found`);
    }
  }
};

const actions = {
  setColorHistory({ commit }: { commit: Function }, payload: { name: string; color: string }) {
    commit('setColorHistory', payload);
  }
};

const getters = {
  getColorHistory: (state: ColorHistory) => (name: string) => {
    return state[name];
  }
};

const historyColor: Module<ColorHistory, any> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};

export default historyColor;
