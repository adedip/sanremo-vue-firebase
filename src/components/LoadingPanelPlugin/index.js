import _ from 'lodash'
import LoadingPanel from './LoadingPanel.vue'

let LoadingPanelActions = {
  panel: [],

  load (panel) {
    panel = _.assign({
      size: 96,
      lineSize: 9,
      lineBgColor: '#38746c',
      lineFgColor: '#41B883',
      spacing: 22,
      fontSize: 22,
      textFgColor: '#41B883'
    }, panel)
    this.panel.push(panel)
  },
  hide () {
    this.panel.splice(0, this.panel.length)
  }
}

var LoadingPanelPlugin = {
  install (Vue) {
    Object.defineProperty(Vue.prototype, '$loadingPanel', {
      get () {
        return LoadingPanelActions
      }
    })
    Vue.component('LoadingPanel', LoadingPanel)
  }
}

export default LoadingPanelPlugin
