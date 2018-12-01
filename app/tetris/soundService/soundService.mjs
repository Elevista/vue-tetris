import title from './sounds/title.mp3'
import bgm1 from './sounds/bgm1.mp3'
import bgm2 from './sounds/bgm2.mp3'
import bgm3 from './sounds/bgm3.mp3'
import bgm4 from './sounds/bgm4.mp3'
import complete from './sounds/complete.mp3'
import gameover from './sounds/gameover.mp3'
import drop from './sounds/drop.mp3'
import lineClear from './sounds/lineClear.mp3'
import _ from 'lodash'

const audios = {
  title,
  bgm1,
  bgm2,
  bgm3,
  bgm4,
  complete,
  gameover,
  drop,
  lineClear
}

export default {
  data () {
    return {
      currentAudio: null,
      muted: false
    }
  },
  methods: {
    getAudio (fileName) {
      return new window.Audio(audios[fileName])
    },
    playEffect (name) {
      !this.muted && this.getAudio(name).play()
    },
    playSound (name, isRepeat = false) {
      if (this.currentAudio) this.currentAudio.pause()
      this.currentAudio = this.getAudio(name)
      if (isRepeat) this.currentAudio.loop = true
      this.currentAudio.volume = 0.4
      this.currentAudio.muted = this.muted
      this.currentAudio.play()
    },
    pauseSound () {
      this.currentAudio.pause()
    },
    resumeSound () {
      this.currentAudio.play()
    },
    stopSound () {
      if (this.currentAudio.currentTime > 0) {
        this.currentAudio.pause()
        this.currentAudio.currentTime = 0
      }
    },
    muteSound () {
      this.muted = !this.muted
      _.assign(this.currentAudio, {muted: this.muted})
    }
  }
}
