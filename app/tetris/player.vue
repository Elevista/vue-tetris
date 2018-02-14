<template>
  <div class="player">
    <div :style="{height:height*cellSize+'px',width:width*cellSize+'px'}" class="game">
      <ground :stage="stage" ref="ground" class="ground" @clearRow="clearRow" @clearAll="clearAll"/>
      <block v-if="curBlock" :init="curBlock" :stage="stage" ref="shadow" :shadow="true"/>
      <block v-if="curBlock" :init="curBlock" :stage="stage" ref="block" :key="curBlock.id"/>
    </div>
    <div class="panel">
      <h2 class="nextText">Next</h2>
      <div class="nextBox">
        <block v-if="nextBlock" :init="nextBlock" :stage="stage" class="next" :style="nextBlockStyle" :key="nextBlock.id"/>
      </div>
      <div class="score">
        <div class="row">
          <h4 class="title">Level</h4>
          <span>{{level|numberComma}}</span>
        </div>
        <div class="row">
          <h4 class="title">Score</h4>
          <span>{{score|numberComma}}</span>
        </div>
        <div class="row">
          <h4 class="title">Rows</h4>
          <span>{{rowCleared|numberComma}}</span>
        </div>
      </div>
      <div class="buttons">
        <button v-if="state.playing" @click="pause">{{state.pause?'Resume':'Pause'}}</button>
        <button v-else @click="start" autofocus>{{state.gameover?'Restart':'Start'}}</button>
      </div>
      <h2 class="state">{{stateText}}</h2>
    </div>
  </div>
</template>

<script>
  import block from './block.vue'
  import ground from './ground.vue'
  import stageComputed from './stageComputed'
  import soundService from './soundService/soundService.mjs'

  let blockId = 0
  export default {
    name: 'player',
    props: ['stage', 'keys'],
    mixins: [stageComputed, soundService],
    data () {
      return {
        curBlock: null,
        nextBlock: null,
        actionOf: {},
        state: {playing: false, gameover: false, pause: false},
        rowCleared: 0,
        level: 0,
        score: 0,
        tickInterval: 0
      }
    },
    computed: {
      tickTime () { return Math.max(11 - this.level, 1) * 50 },
      nextBlockStyle () {
        return {left: '50%', top: `calc(50% + ${this.cellSize}px)`}
      },
      canPlay () {
        let {gameover, pause, playing} = this.state
        return !gameover && !pause && playing
      },
      stateText () {
        let {gameover, pause} = this.state
        if (gameover) return 'Game Over!'
        if (pause) return 'Pause'
        return ''
      }
    },
    created () {
      _.forEach(this.keys, (v, k) => this.$set(this.actionOf, v, k))
      window.addEventListener('keydown', this.keydown)
    },
    methods: {
      // level에 따라 순차 재생
      playBgm() {
        this.playSound(`bgm${this.level%4 + 1}`)
      },
      start () {
        if (this.state.playing) return
        Object.assign(this, {rowCleared: 0, level: 0, score: 0, state: {playing: true, gameover: false, pause: false}})
        this.$refs.ground.reset()
        this.createNextBlock()
        this.next()
        this.state.playing = true
        this.playBgm()
      },
      tick () {
        if (!this.canPlay) return
        this.move(0, -1)
      },
      setTick () { this.tickInterval = setInterval(this.tick, this.tickTime) },
      clearTick () { this.tickInterval = clearInterval(this.tickInterval) },
      resetTick () {
        this.clearTick()
        this.setTick()
      },
      clearRow (n) {
        this.rowCleared += n
        this.getScore([0, 40, 100, 300, 1200][n] * (this.level + 1))
        this.level = Math.floor(this.rowCleared / 10)
      },
      clearAll () { this.getScore(3000 * (this.level + 1)) },
      keydown ($event) {
        if ($event.keyCode === 32) $event.preventDefault()
        if (!this.state.playing) return
        if ($event.keyCode === 27) return this.pause()
        if (!this.canPlay) return
        switch (this.actionOf[$event.keyCode]) {
          case 'straight':
            this.moveStraight()
            $event.preventDefault()
            break
          case 'left':
            this.move(-1, 0)
            $event.preventDefault()
            break
          case 'rotate' :
            this.rotate()
            $event.preventDefault()
            break
          case 'right':
            this.move(1, 0)
            $event.preventDefault()
            break
          case 'down':
            this.move(0, -1)
            this.resetTick()
            $event.preventDefault()
            break
        }
      },
      pause () {
        if (this.state.pause) {
          this.state.pause = false
          this.resumeSound()
          this.setTick()
        } else {
          this.state.pause = true
          this.pauseSound()
          this.clearTick()
        }
        this.$emit('pause', this.state.pause)
      },
      move (x, y) {
        let {block, ground} = this.$refs
        let touched = ground.checkTouched(block.predictMove(x, y))
        if (!touched) {
          block.move(x, y)
          this.updateShadow()
        } else if (y < 0) { // go down and touched
          this.getScore(3 * (this.level + 1))
          let allPushed = ground.push(block.cells)
          this.curBlock = null
          allPushed ? this.next() : this.gameover()
        }
        return touched
      },
      moveStraight () {
        while (!this.move(0, -1)) {}
        this.getScore(21 + (3 * this.level))
      },
      getScore (v) {
        if (!this.canPlay) return
        this.score += v
      },
      updateShadow () {
        let {shadow, block, ground} = this.$refs
        let {idx, x, y} = block
        Object.assign(shadow, {idx, x, y})
        while (!ground.checkTouched(shadow.predictMove(0, -1))) shadow.move(0, -1)
      },
      rotate () {
        let {block, ground} = this.$refs
        let rotate = block.predictRotate()
        let touched = ground.checkTouched(rotate)
        if (!touched) {
          block.rotate(0)
          this.updateShadow()
          return
        }
        let x = rotate.map(([x]) => x)
        _(1).range(_.max(x) - _.min(x) + 1)
          .flatMap(x => [-x, x])
          .forEach(x => {
            if (ground.checkTouched(block.predictRotate(x))) return
            block.rotate(x)
            this.updateShadow()
            return false
          })
      },
      createNextBlock () {
        let type = _.sample(this.blocks)
        let shapes = this.blockType[type]
        this.nextBlock = {shapes, pos: [0, 0], class: type, id: blockId++}
      },
      gameover () {
        if (this.state.gameover) return
        Object.assign(this.state, {gameover: true, playing: false})
        this.clearTick()
        this.$emit('gameover', this)
      },
      next () {
        this.curBlock = Object.assign({}, this.nextBlock)
        this.curBlock.pos = [Math.floor(this.width / 2), this.height]
        this.$nextTick(() => {
          this.resetTick()
          if (this.move(0, -1)) return
          let {block, ground} = this.$refs
          ground.checkTouched(block.predictMove(0, -1)) || block.move(0, -1)
          this.createNextBlock()
        })
      }
    },
    watch: {
      level(from, to) {
        console.log(from, to)
        this.playBgm()
      }
    },
    destroyed () { window.removeEventListener('keyodwn', this.keydown) },
    components: {ground, block}
  }
</script>

<style scoped>
  .player {white-space: nowrap;display: inline-block;background: #e2f5ec;padding: 30px; color: #222;border: solid 1px #b7b7b7;}
  .player > * {display: inline-block; vertical-align: top;}
  .game {position: relative;outline: solid 1px gray;background-color: black; overflow: hidden;}
  .buttons {text-align: center;}
  .buttons button {font-size: 30px;}
  .panel {padding: 30px;}
  .nextText {height: 20px;text-align: center;}
  .nextBox {width: 160px;height: 160px;position: relative;background-color: #222;}
  .nextBox .next {position: absolute;}
  .score {margin: 20px 0}
  .score .row {font-size: 18px;letter-spacing: -1px;padding: 10px 0;}
  .score .row h4 {display: inline-block;width: 60px;margin: 0;vertical-align: middle;}
  .score .row span {display: inline-block;width: 90px;text-align: right;vertical-align: middle;}
  .state {text-align: center;}
</style>
