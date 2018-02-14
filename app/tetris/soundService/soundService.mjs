import title from './sounds/title.mp3'
import bgm1 from './sounds/bgm1.mp3'
import bgm2 from './sounds/bgm2.mp3'
import bgm3 from './sounds/bgm3.mp3'
import bgm4 from './sounds/bgm4.mp3'
import complete from './sounds/complete.mp3'
import gameover from './sounds/gameover.mp3'

const audios={
  title,
  bgm1,
  bgm2,
  bgm3,
  bgm4,
  complete,
  gameover
}

export default {
  data () {
    return {
      currentAudio: null
    }
  },
  methods: {
    getAudio(fileName) {
      return new Audio(audios[fileName])
    },
    playSound(name) {
      if (this.currentAudio) this.currentAudio.pause()
      this.currentAudio = this.getAudio(name)
      this.currentAudio.play()
    },
    pauseSound() {
      this.currentAudio.pause()
    },
    resumeSound() {
      this.currentAudio.play()
    },
    stopSound() {
      if(this.currentAudio.currentTime > 0) {
        this.currentAudio.pause()
        this.currentAudio.currentTime = 0
      }
    }
  }
}
