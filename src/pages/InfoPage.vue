<template>
  <div class="info fullscreen column" :style="{backgroundColor: color.back, color: color.text}">
    <div class="col marquee column justify-center">
      <p
        :style="{
          animationDuration: marquee.duration + 's',
          fontSize: marquee.fontSize + 'px',
        }"
      >
        {{ marquee.text }}
      </p>
    </div>
    <div class="col-11 row q-pa-md">
      <div class="col-3 q-gutter-md q-pa-md">
        <q-card v-for="(item, index) in news" :key="index">
          <q-card-section>
            <div class="text-h6">{{ item.title }}</div>
            <div>{{ item.body }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-7 q-pa-md column justify-center">
        <q-carousel
          autoplay="true"
          infinite
          animated
          v-model="slide"
          class="full-height"
          v-if="centerMode=='slides'"
        >
          <q-carousel-slide
            v-for="(item, index) in slides"
            :key="index"
            :name="index"
            :img-src="item.url"
          >
            <div class="absolute-bottom custom-caption">
              <div class="text-h2">{{ item.title }}</div>
            </div>
          </q-carousel-slide>
        </q-carousel>
        <q-video v-if="centerMode=='video'" :src="video" :ratio="16/9"></q-video>
      </div>
      <div class="col-2 column q-pa-md">
        <div class="col">
          <q-img :src="logo" fit="contain" height="100%"></q-img>
        </div>
        <div class="col column justify-center">
          <div class="text-h2 text-center">
            {{ datetime.hours }}.{{ datetime.minutes }}.{{ datetime.seconds }}
          </div>
        </div>
        <div class="col column justify-center">
          <div class="text-h2 text-center">
            {{ datetime.day }}.{{ datetime.month }}.{{ datetime.year }}
          </div>
          <div class="text-h3 text-center">{{ datetime.dayOfWeek }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { useSettingsStore } from "src/stores/settings";
import { storeToRefs } from "pinia";
import { defineComponent } from "vue";
//import { LocalStorage } from "quasar";
export default defineComponent({
  name: "InfoPage",

  setup() {
    const settingsStore = useSettingsStore();
    const { marquee, news, slides, logo, video, centerMode, color } = storeToRefs(settingsStore);
    const slide = ref(0);
    const datetime = ref({});
    const days = [
      "Воскресенье",
      "Понедельник",
      "Вторник",
      "Среда",
      "Четверг",
      "Пятница",
      "Суббота",
    ];

    const getTime = () => {
      let date = new Date();
      datetime.value.year = date.getFullYear();
      datetime.value.month =
        date.getMonth() + 1 > 9
          ? date.getMonth() + 1
          : "0" + (date.getMonth() + 1);
      datetime.value.day =
        date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
      datetime.value.dayOfWeek = days[date.getDay()];
      datetime.value.hours =
        date.getHours() > 9 ? date.getHours() : "0" + date.getHours();
      datetime.value.minutes =
        date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes();
      datetime.value.seconds =
        date.getSeconds() > 9 ? date.getSeconds() : "0" + date.getSeconds();
    };

    const updateTime = () => {
      setInterval(getTime, 1000);
    };

    onMounted(updateTime);

    return {
      marquee,
      news,
      slides,
      slide,
      datetime,
      logo,
      video,
      centerMode,
      color,

      getTime,
      updateTime,
    };
  },
});
</script>

<style>
.marquee {
  overflow: hidden;
}

.marquee p {
  margin: 0;
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

.custom-caption {
  text-align: center;
  padding: 12px;
  color: white;
  background-color: rgba(0, 0, 0, 0.3);
}
</style>
