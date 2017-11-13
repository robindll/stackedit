<template>
  <div class="side-bar__panel side-bar__panel--menu">
    <menu-entry @click.native="saveToMembank">
      <icon-download slot="icon"></icon-download>
      <div>Save to Membank</div>
      <span>Save to Membank</span>
    </menu-entry>
    <menu-entry @click.native="LoadAMemory">
      <icon-download slot="icon"></icon-download>
      <div>Load a memory</div>
      <span>Load a memory</span>
    </menu-entry>
  </div>
</template>


<script>
import emptyContent from '../../data/emptyContent';
import membankSvc from '../../services/membankSvc';
import MenuEntry from './MenuEntry';
import store from '../../store';
import utils from '../../services/utils';

export default {
  components: {
    MenuEntry,
  },
  methods: {
    saveToMembank() {
      const currentFile = this.$store.getters['file/current'];
      membankSvc.saveToMembank(currentFile.id);
    },

    LoadAMemory() {
      const mId = '5a091737587f691dd4c8d36d';
      membankSvc.loadAMemory(mId)
      .then((content) => {
        const contentObj = JSON.parse(content);
        const text = contentObj.content;
        console.log(`text = ${text}`);

        const result = emptyContent();
        result.text = text;
        result.history = [];
        result.hash = utils.hash(utils.serializeObject({
          ...result,
          hash: undefined,
        }));

        this.$store.dispatch('createFile', {
          ...result,
          name: `MemId_${mId}`,
        })
        .then((item) => {
          this.$store.commit('file/setCurrentId', item.id);
          store.dispatch('notification/info', `${store.getters['file/current'].name} was imported from Membank.`);
        });
      })
      .catch((e) => {
        console.log(`${e.message}`);
      });
    },
  },
};
</script>
