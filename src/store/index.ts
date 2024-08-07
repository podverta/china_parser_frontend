import { type InjectionKey } from 'vue';
import { createStore, Store } from 'vuex';
import historyColor from '@/store/modules/colorHistory';
import matchColorHistory from '@/store/modules/matchsColorHistory';

export const store = createStore({
  modules: {
    historyColor,
    matchColorHistory
  }
});

export const key: InjectionKey<Store<RootState>> = Symbol();

export interface RootState {
  historyColor: ColorHistory;
  matchColorHistory: MatchColorHistory;
}

export function useStore(): Store<RootState> {
  return store;
}

interface ColorHistoryItem {
  colorPanel: string[];
  color: string;
  type?: string;
  time?: string;
}

type ColorHistory = Record<string, ColorHistoryItem>;

type LeagueColorHistory = Record<string, ColorHistoryItem[]>;

type MatchColorHistory = Record<string, LeagueColorHistory>;
