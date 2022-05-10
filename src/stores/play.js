import { defineStore } from 'pinia';

export const usePlayStore = defineStore('play', {
  state: () => ({
    isPlay: false
  }),

  getters: {
    playState (state) {
      return state.isPlay
    }
  },

  actions: {
    play () {
      this.isPlay = true
    },
    stop () {
      console.log("stop");
      this.isPlay = false
    }
  }
})
