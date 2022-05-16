<template>
  <q-header elevated>
    <q-toolbar>
      <q-toolbar-title> Информационный экран </q-toolbar-title>

      <q-btn-dropdown stretch flat label="Экран">
        <q-list>
          <q-item
            v-for="(item, index) in screens"
            :key="item.id"
            clickable
            v-close-popup
            tabindex="0"
            @click="selectScreen(item)"
          >
            <q-item-section avatar>
              <q-avatar
                icon="desktop_windows"
                color="secondary"
                text-color="white"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>Экран {{ index }}</q-item-label>
              <q-item-label caption
                >{{ item.size.width }}x{{ item.size.height }}</q-item-label
              >
            </q-item-section>
            <q-item-section side v-if="selectedScreen == item">
              <q-icon name="done" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-btn
        flat
        round
        dense
        icon="play_arrow"
        @click="play"
        v-if="!playStore.isPlay"
      />
      <q-btn
        flat
        round
        dense
        icon="stop"
        @click="stop"
        v-if="playStore.isPlay"
      />
    </q-toolbar>
  </q-header>
  <q-card>
    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab name="settings" label="Настройки" />
      <q-tab name="marquee" label="Бегущая строка" />
      <q-tab name="news" label="Новости" />
      <q-tab name="slides" label="Слайды" />
      <q-tab name="video" label="Видео" />
    </q-tabs>

    <q-separator />
    <!--Настройки-->
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="settings" class="q-gutter-md">
        <div class="text-h6">Настройки</div>
        <div class="row q-gutter-md">
          <!--Логотип-->
          <q-card class="my-card">
            <q-card-section>
              <div class="text-h6">Логотип</div>
            </q-card-section>
            <q-card-section>
              <q-img :src="logo"></q-img>
            </q-card-section>
            <q-card-section>
              <q-btn @click="selectLogo()">Изменить</q-btn>
            </q-card-section>
          </q-card>
          <!--Цвет-->
          <q-card class="my-card">
            <q-card-section>
              <div class="text-h6">Цвет фона</div>
              <q-color
                class="my-picker"
                v-model="color.back"
                @update:model-value="setColor()"
              />
            </q-card-section>
          </q-card>
          <q-card class="my-card">
            <q-card-section>
              <div class="text-h6">Цвет текста</div>
              <q-color
                class="my-picker"
                v-model="color.text"
                @update:model-value="setColor()"
              />
            </q-card-section>
          </q-card>
        </div>
      </q-tab-panel>

      <q-tab-panel name="marquee" class="q-gutter-md">
        <div class="text-h6">{{ marquee.text }}</div>
        <q-input label="Текст бегущей строки" v-model="marquee.text"></q-input>
        <q-input
          label="Длительность, с"
          type="number"
          v-model.number="marquee.duration"
        ></q-input>
        <q-input
          label="Размер шрифта, px"
          type="number"
          v-model.number="marquee.fontSize"
        ></q-input>
        <q-btn @click="saveMarquee">Сохранить</q-btn>
      </q-tab-panel>

      <q-tab-panel name="news" class="q-gutter-md">
        <div class="text-h6">Новости</div>
        <q-card v-for="(item, index) in news" :key="index">
          <q-card-section>
            <div class="text-h6">{{ item.title }}</div>
            <div>{{ item.body }}</div>
          </q-card-section>
          <q-card-section>
            <q-btn @click="deleteOneNews(index)">Удалить</q-btn>
          </q-card-section>
        </q-card>
        <q-card>
          <q-card-section>
            <q-input label="Заголовок" v-model="oneNews.title"></q-input>
            <q-input label="Текст" v-model="oneNews.body"></q-input>
          </q-card-section>
          <q-card-section>
            <q-btn @click="addNews()">Добавить</q-btn>
          </q-card-section>
        </q-card>
      </q-tab-panel>

      <q-tab-panel name="slides">
        <div class="text-h6">Слайды</div>
        <div class="q-pa-md row items-start q-gutter-md">
          <q-card class="my-card" v-for="(item, index) in slides" :key="index">
            <q-img :src="item.url">
              <div class="absolute-bottom">
                <div class="text-h6">{{ item.title }}</div>
              </div>
            </q-img>

            <q-card-actions>
              <q-btn flat @click="deleteSlide(index)">Удалить</q-btn>
            </q-card-actions>
          </q-card>
        </div>
        <q-card>
          <q-card-section>
            <q-input label="Заголовок" v-model="slide.title"></q-input>
            <q-input
              label="Ссылка на изображение"
              v-model="slide.url"
            ></q-input>
          </q-card-section>
          <q-card-section class="q-gutter-md">
            <q-btn @click="addSlide()">Добавить</q-btn>
            <q-btn @click="loadImage()">Загрузить</q-btn>
          </q-card-section>
        </q-card>
      </q-tab-panel>

      <q-tab-panel name="video">
        <q-card>
          <q-card-section v-for="(item, index) in video" :key="index">
            <q-input label="Подпись" v-model="item.title"></q-input>
            <q-input
              label="Ссылка на видео"
              v-model="item.source[0].src"
            ></q-input>
            <q-input filled v-model="item.time" mask="time" :rules="['time']">
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-time v-model="item.time" format24h>
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Закрыть"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-btn @click="loadVideo(index)">Загрузить</q-btn>
            <q-btn @click="deleteVideo(index)">Удалить</q-btn>
          </q-card-section>
          <q-card-section class="q-gutter-md">
            <q-btn @click="addVideo()">Добавить</q-btn>
            <q-btn @click="saveVideo()">Сохранить</q-btn>
          </q-card-section>
        </q-card>
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { usePlayStore } from "src/stores/play";
import { useSettingsStore } from "src/stores/settings";

export default defineComponent({
  name: "IndexPage",

  setup() {
    const playStore = usePlayStore();
    const settingsStore = useSettingsStore();
    const { marquee, news, slides, logo, video, color } =
      storeToRefs(settingsStore);
    const screens = ref([]);
    const selectedScreen = ref({});
    const tab = ref("marquee");
    const oneNews = ref({});
    const slide = ref({});

    const getScreens = async () => {
      let response = await window.myAPI.getScreens();
      screens.value = response.screens;
      selectedScreen.value = screens.value[0];
    };

    onMounted(getScreens);

    return {
      screens,
      getScreens,
      selectedScreen,
      tab,
      playStore,
      marquee,
      news,
      oneNews,
      slides,
      slide,
      logo,
      video,
      color,

      selectScreen(item) {
        selectedScreen.value = item;
      },

      async play() {
        const position = {
          x: selectedScreen.value.bounds.x,
          y: selectedScreen.value.bounds.y,
        };
        let response = await window.myAPI.play(position);
        let message = response.message;
        playStore.play();
      },
      async stop() {
        let response = await window.myAPI.stop();
        console.log(response.message);
        playStore.stop();
      },

      saveMarquee() {
        settingsStore.setMarquee(marquee.value);
      },

      addNews() {
        news.value.push({
          title: oneNews.value.title,
          body: oneNews.value.body,
        });
        oneNews.value = {};
        settingsStore.setNews(news.value);
      },

      deleteOneNews(index) {
        news.value.splice(index, 1);
        settingsStore.setNews(news.value);
      },

      addSlide() {
        slides.value.push({
          title: slide.value.title,
          url: slide.value.url,
        });
        slide.value = {};
        settingsStore.setSlides(slides.value);
      },

      deleteSlide(index) {
        slides.value.splice(index, 1);
        settingsStore.setSlides(slides.value);
      },

      async selectLogo() {
        let response = await window.myAPI.openImage();
        console.log(response.url);
        logo.value = response.url;
        settingsStore.setLogo(logo.value);
      },

      async loadImage() {
        let response = await window.myAPI.openImage();
        slide.value.url = response.url;
      },

      addVideo() {
        let now = new Date();
        let time = { hours: now.getHours(), minutes: now.getMinutes() };
        video.value.push({
          source: [{ src: "", type: "video/mp4" }],
          time: time,
        });
      },

      deleteVideo(index) {
        video.value.splice(index, 1);
      },

      async loadVideo(index) {
        let response = await window.myAPI.openVideo();
        video.value[index].source[0].src = response.url;
      },

      saveVideo() {
        video.value.type = "video/mp4";
        settingsStore.setVideo(video.value);
      },

      setColor() {
        settingsStore.setColor(color.value);
      },
    };
  },
});
</script>

<style scoped>
.my-card {
  width: 100%;
  max-width: 250px;
}

.my-picker {
  max-width: 250px;
}
</style>
