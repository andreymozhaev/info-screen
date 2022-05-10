<template>
  <div class="info fullscreen column">
    <div class="col marquee">
      <p
        :style="{
          animationDuration: marquee.duration + 's',
          fontSize: marquee.fontSize + 'px',
        }"
      >
        {{ marquee.text }}
      </p>
    </div>
    <div class="col-10 row">
      <div class="col-3"></div>
      <div class="col-7"></div>
      <div class="col-2 column">
        <div class="col"></div>
        <div class="col"></div>
        <div class="col"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { useSettingsStore } from "src/stores/settings";
import { storeToRefs } from "pinia";
import { defineComponent } from "vue";
import { LocalStorage } from 'quasar';
export default defineComponent({
  name: "InfoPage",

  setup() {
    const settingsStore = useSettingsStore();
    const { marquee } = storeToRefs(settingsStore);
    console.log(LocalStorage.getItem('marquee'));

    return{
      marquee
    }
  },
});
</script>

<style>
.marquee{
  overflow: hidden;
}

.marquee p {
  text-align: center;
  text-transform: uppercase;
  animation: text 5s infinite linear;
  padding-left: 100%;
  white-space: nowrap;
  font-size: x-large;
}
@keyframes text {
  0% {
    transform: translate(0, 0);
  }

  100% {
    transform: translate(-160%, 0);
  }
}
</style>
