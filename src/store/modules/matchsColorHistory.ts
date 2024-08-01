import { type Module } from 'vuex';

interface MatchColorHistoryItem {
  type: string;
  color: string;
  time: string;
}

type LeagueColorHistory = Record<string, MatchColorHistoryItem[]>;

type MatchColorHistory = Record<string, LeagueColorHistory>;

const state = (): MatchColorHistory => ({
  'IPBL Pro Division': {},
  'Rocket Basketball League': {},
  'IPBL Pro Division Women': {},
  'Rocket Basketball League Women': {}
});

const mutations = {
  setMatchColorHistory(state: MatchColorHistory, { league, key, item }: { league: string, key: string, item: MatchColorHistoryItem }) {
    if (!state[league]) {
      state[league] = {};
    }
    if (!state[league][key]) {
      state[league][key] = [];
    }
    state[league][key] = [item, ...state[league][key]];
    if (state[league][key].length > 50) {
      state[league][key] = state[league][key].slice(0, 50);
    }
  },
}

const actions = {
  setMatchColorHistory({ commit }: any, payload: any) {
    commit('setMatchColorHistory', payload);
  },
}

const getters = {
  getColorHistory: (state: MatchColorHistory) => (league: string, key: string) => state[league][key],
}

const matchColorHistoryModule: Module<MatchColorHistory, any> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};

export default matchColorHistoryModule;
