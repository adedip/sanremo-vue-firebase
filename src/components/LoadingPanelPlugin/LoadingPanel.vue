<template>
  <div class="overlay flex flex-column items-center justify-center" v-if="panelSet">
    <vue-simple-spinner
      :size="panelSet.size"
      :line-size="panelSet.lineSize"
      :line-bg-color="panelSet.lineBgColor"
      :line-fg-color="panelSet.lineFgColor"
      :speed="panelSet.speed"
      :spacing="panelSet.spacing"
      :message="panelSet.message"
      :font-size="panelSet.fontSize"
      :text-fg-color="panelSet.textFgColor"
      :class="panelSet.class">
    </vue-simple-spinner>
  </div>
</template>

<script>
import Spinner from 'vue-simple-spinner'
export default {
  data () {
    return {
      panel: this.$loadingPanel.panel
    }
  },
  components: {
    'vue-simple-spinner': Spinner
  },
  computed: {
    panelSet () {
      if (this.panel.length > 0) {
        return this.panel[0]
      }

      return false
    }
  }
}
</script>

<style scoped>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 50;
    background: hsla(0,0%,100%,.7);
  }

  .justify-center {
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center
  }

  .items-center {
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center
  }

  .flex-column {
    -webkit-box-orient: vertical;
    -ms-flex-direction: column;
    flex-direction: column
  }

  .flex-column,.flex-row {
    -webkit-box-direction: normal
  }

  .flex {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex
  }
</style>
