<template>
  <div class="side-bar__panel side-bar__panel--menu">
    <menu-entry @click.native="saveToMembank">
      <icon-download slot="icon"></icon-download>
      <div>Save to Membank</div>
      <span>Save to Membank</span>
    </menu-entry>
    <menu-entry @click.native="cleanDisplayedMemories">
      <icon-download slot="icon"></icon-download>
      <div>Clean displayed memories</div>
      <span>Clean displayed memories</span>
    </menu-entry>
    <menu-entry @click.native="loadAllMemories">
      <icon-download slot="icon"></icon-download>
      <div>Load all memories</div>
      <span>Load all memories</span>
    </menu-entry>
    <menu-entry @click.native="loadAMemory">
      <icon-download slot="icon"></icon-download>
      <div>Load a memory</div>
      <span>Load a memory</span>
    </menu-entry>
    <menu-entry @click.native="cleanTrash">
      <icon-download slot="icon"></icon-download>
      <div>Clean trash</div>
      <span>Clean cleanTrash</span>
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

    cleanTrash() {
      store.getters['file/items']
        .filter(file => file.parentId === 'trash') // If file is in the trash
        .forEach((file) => {
          store.dispatch('deleteFile', file.id);
        });
    },

    cleanDisplayedMemories() {
      // Clean files
      store.getters['file/items']
        .filter(file => file.name.includes('[Membank]')) // If file is loaded from membank
        .forEach((file) => {
          store.dispatch('deleteFile', file.id);
        });
    },

    loadAllMemories() {
      const person = 'Dante';
      membankSvc.loadAllMemories(person)
      .then((content) => {
        const contentObj = JSON.parse(content);
        contentObj.memory_ids.forEach((memoryId) => {
          this.loadAMemory(memoryId);
        });
      });
    },

    loadAMemory(memoryId) {
      membankSvc.loadAMemory(memoryId)
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
          name: `[${contentObj.date_created}]_[${memoryId}]_[Membank]`,
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
