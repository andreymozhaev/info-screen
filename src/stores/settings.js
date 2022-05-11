import { defineStore } from "pinia";
import { LocalStorage } from "quasar";

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    marquee: LocalStorage.getItem("marquee")
      ? LocalStorage.getItem("marquee")
      : { text: "Бегущая строка", duration: 10, fontSize: 16 },
    logo: LocalStorage.getItem("logo")||{image: null, imageUrl:""},
    news: LocalStorage.getItem("news")||[],
    slides: LocalStorage.getItem("slides")||[],
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
    setLogo(value){
      LocalStorage.set('logo', value);
    },
    setNews(value){
      LocalStorage.set('news', value);
    },
    setSlides(value){
      LocalStorage.set('slides', value);
    }
  },
});
