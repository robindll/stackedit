<template>
  <div class="side-bar__panel side-bar__panel--menu">
    <menu-entry @click.native="saveToMembank">
      <icon-download slot="icon"></icon-download>
      <div>Save to Membank</div>
      <span>Save to Membank</span>
    </menu-entry>
  </div>
</template>


<script>
import MenuEntry from './MenuEntry';
import membankSvc from '../../services/membankSvc';

export default {
  components: {
    MenuEntry,
  },
  methods: {
    saveToMembank() {
      const currentFile = this.$store.getters['file/current'];
      membankSvc.saveToMembank(currentFile.id);
    },
  },
};
</script>
