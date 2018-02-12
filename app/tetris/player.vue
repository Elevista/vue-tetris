<template>
  <div class="player">
    <div :style="{height:height*cellSize+'px',width:width*cellSize+'px'}" class="game">
      <ground :stage="stage" ref="groundRef" class="ground" @clearRow="clearRow" @clearAll="clearAll"/>
      <block v-if="block" :init="block" :stage="stage" ref="guideRef" class="guide"/>
      <block v-if="block" :init="block" :stage="stage" ref="blockRef" :key="block.id"/>
    </div>
    <div class="panel">
      <h2 class="nextText">Next</h2>
      <div class="nextBox">
        <block v-if="nextBlock" :init="nextBlock" :stage="stage" class="next" :style="nextBlockStyle"/>
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
        <button v-if="!state.playing" @click="start" autofocus>{{state.gameover?'Restart':'Start'}}</button>
        <button v-else @click="pause">{{state.pause?'Resume':'Pause'}}</button>
      </div>
      <h2 class="state">{{stateText}}</h2>
    </div>
  </div>
</template>

<script>
  import block from './block.vue'
  import ground from './ground.vue'
  import stageComputed from './stageComputed'

  let blockId = 0
  export default {
    name: 'player',
    props: ['stage', 'keys'],
    mixins: [stageComputed],
    data () {
      return {
        block: null,
        nextBlock: null,
        actionOf: {},
        state: {playing: false, gameover: false, pause: false},
        rowCleared: 0,
        level: 0,
        score: 0,
        tickTimeout: 0
      }
    },
    computed: {
      tickTime () {
        return ((11 - Math.max(0, this.level)) * 50)
      },
      nextBlockStyle () {
        return {
          left: `calc(50% - ${this.cellSize}px)`,
          top: `calc(50% + ${this.cellSize}px)`
        }
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
    mounted () {
      _.forEach(this.keys, (v, k) => this.$set(this.actionOf, v, k))
      window.addEventListener('keydown', this.keydown)
    },
    methods: {
      start () {
        if (this.state.playing) return
        Object.assign(this, {rowCleared: 0, level: 0, score: 0, state: {playing: true, gameover: false, pause: false}})
        this.$refs.groundRef.reset()
        this.createNextBlock()
        this.next()
        this.$nextTick(() => setTimeout(this.tick, this.tickTime))
        this.state.playing = true
      },
      tick () {
        if (!this.canPlay) return
        this.move(0, -1)
        this.tickTimeout = setTimeout(this.tick, this.tickTime)
      },
      clearRow (n) {
        this.rowCleared += n
        this.getScore([0, 40, 100, 300, 1200][n] * (this.level + 1))
        this.level = Math.floor(this.rowCleared / 10)
      },
      clearAll () {
        this.getScore(3000 * (this.level + 1))
      },
      keydown ($event) {
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
            $event.preventDefault()
            break
        }
      },
      pause () {
        if (this.state.pause) {
          this.state.pause = false
          setTimeout(this.tick, this.tickTime)
        } else {
          this.state.pause = true
          clearTimeout(this.tickTimeout)
        }
        this.$emit('pause', this.state.pause)
      },
      move (x, y) {
        let {blockRef, groundRef} = this.$refs
        let touched = groundRef.checkTouched(blockRef.predictMove(x, y))
        if (!touched) {
          blockRef.move(x, y)
          this.updateGuide()
        } else if (y < 0) { // go down and touched
          this.getScore(3 * (this.level + 1))
          if (groundRef.push(blockRef.cells)) {
            this.block = null
            this.$nextTick(this.next) // force recreate state
          } else this.gameover()
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
      updateGuide () {
        let {guideRef, blockRef, groundRef} = this.$refs
        let {idx, x, y} = blockRef
        Object.assign(guideRef, {idx, x, y})
        while (!groundRef.checkTouched(guideRef.predictMove(0, -1))) guideRef.move(0, -1)
      },
      rotate () {
        let {blockRef, groundRef} = this.$refs
        let rotate = blockRef.predictRotate()
        let touched = groundRef.checkTouched(rotate)
        if (!touched) {
          blockRef.rotate(0)
          this.updateGuide()
          return
        }
        let x = rotate.map(([x]) => x)
        _(1).range(_.max(x) - _.min(x) + 1)
          .flatMap(x => [-x, x])
          .forEach(x => {
            if (groundRef.checkTouched(blockRef.predictRotate(x))) return
            blockRef.rotate(x)
            this.updateGuide()
            return false
          })
      },
      createBlock () {
        let type = this.blocks[Math.floor(Math.random() * this.blocks.length)]
        let shapes = this.blockType[type]
        return {shapes, pos: [0, 0], class: type, id: blockId++}
      },
      createNextBlock () {
        this.nextBlock = this.createBlock()
      },
      gameover () {
        if (this.state.gameover) return
        this.state.gameover = true
        this.state.playing = false
        clearTimeout(this.tickTimeout)
        this.$emit('gameover', this)
      },
      next () {
        this.block = Object.assign({}, this.nextBlock)
        this.block.pos = [Math.floor(this.width / 2), this.height]
        this.$nextTick(() => {
          this.move(0, -1)
          this.move(0, -1)
          this.createNextBlock()
        })
      }
    },
    destroyed () { window.removeEventListener('keyodwn', this.keydown) },
    components: {ground, block}
  }
</script>

<style scoped>
  .player {white-space: nowrap;display: inline-block;background: #e2f5ec;padding: 30px; color: #222;}
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
