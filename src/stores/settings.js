import { defineStore } from "pinia";
import { LocalStorage } from "quasar";

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    marquee: LocalStorage.getItem("marquee")
      ? LocalStorage.getItem("marquee")
      : { text: "Бегущая строка", duration: 10, fontSize: 16 },
  }),

  getters: {
    getMarquee(state) {
      return state.marquee;
    },
  },

  actions: {
    setMarquee(value) {
      LocalStorage.set('marquee', value);
    },
  },
});
