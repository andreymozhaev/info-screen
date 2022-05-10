<template>
  <q-header elevated>
    <q-toolbar>
      <q-btn
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        @click="toggleLeftDrawer"
      />

      <q-toolbar-title> Quasar App </q-toolbar-title>

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
      <q-tab name="marquee" label="Бегущая строка" />
      <q-tab name="alarms" label="Alarms" />
      <q-tab name="movies" label="Movies" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="marquee" class="q-gutter-md">
        <div class="text-h6">{{ marquee.text }}</div>
        <q-input
          label="Текст бегущей строки"
          v-model="marquee.text"
        ></q-input>
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

      <q-tab-panel name="alarms">
        <div class="text-h6">Alarms</div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </q-tab-panel>

      <q-tab-panel name="movies">
        <div class="text-h6">Movies</div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </q-tab-panel>
    </q-tab-panels>
  </q-card>

  <!--q-drawer v-model="leftDrawerOpen" show-if-above bordered>
    <q-list>
      <q-item-label header> Essential Links </q-item-label>
    </q-list>
  </q-drawer-->
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { usePlayStore } from "src/stores/play";
import { useSettingsStore } from "src/stores/settings";
import { LocalStorage } from "quasar";

export default defineComponent({
  name: "IndexPage",

  setup() {
    const playStore = usePlayStore();
    const settingsStore = useSettingsStore();
    const { marquee } = storeToRefs(settingsStore);
    const leftDrawerOpen = ref(false);
    const screens = ref([]);
    const selectedScreen = ref({});
    const tab = ref("mails");

    const getScreens = async () => {
      let response = await window.myAPI.getScreens();
      screens.value = response.screens;
      selectedScreen.value = screens.value[0];
    };

    onMounted(getScreens);

    return {
      leftDrawerOpen,
      screens,
      getScreens,
      selectedScreen,
      tab,
      playStore,
      marquee,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
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
        playStore.stop();
      },

      saveMarquee(){
        settingsStore.setMarquee(marquee.value);
        console.log(LocalStorage.getItem('marquee'));
      }
    };
  },
});
</script>
