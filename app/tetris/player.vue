<template>
  <div class="player">
    <div :style="{height:height*cellSize+'px',width:width*cellSize+'px'}" class="game">
      <ground :stage="stage" ref="groundRef" class="ground"/>
      <block v-if="block" :init="block" :stage="stage" ref="guideRef" class="guide"/>
      <block v-if="block" :init="block" :stage="stage" ref="blockRef" :key="block.id"/>
    </div>
    <div class="nextBox">
      <block v-if="nextBlock" :init="nextBlock" :stage="stage" class="next" :style="nextBlockStyle"/>
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
      return {block: null, nextBlock: null, actionOf: {}, state: {dead: false}, lastTime: Date.now()}
    },
    computed: {
      nextBlockStyle () {
        return {
          left: `calc(50% - ${this.cellSize / 2}px)`,
          top: `calc(50% + ${this.cellSize / 2}px)`
        }
      }
    },
    beforeMount () {
      this.createNextBlock()
      this.next()
      _.forEach(this.keys, (v, k) => this.$set(this.actionOf, v, k))
    },
    mounted () {
      window.addEventListener('keydown', this.keydown)
      this.tick()
    },
    methods: {
      tick () {
        if (this.state.dead) return
        this.move(0, -1)
        setTimeout(this.tick, this.tickTime)
      },
      keydown ($event) {
        if (this.state.dead) return
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
      move (x, y) {
        let {blockRef, groundRef} = this.$refs
        let touched = groundRef.checkTouched(blockRef.predictMove(x, y))
        if (!touched) {
          blockRef.move(x, y)
          this.updateGuide()
        } else if (y < 0) { // go down and touched
          if (groundRef.push(blockRef.cells)) {
            this.block = null
            this.$nextTick(this.next) // force recreate state
          } else this.dead()
        }
        return touched
      },
      moveStraight () {
        while (!this.move(0, -1)) {}
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
      dead () {
        if (this.state.dead) return
        this.state.dead = true
        setTimeout(() => window.alert('dead'), 100)
        this.$emit('dead', this)
      },
      next () {
        this.block = Object.assign({}, this.nextBlock)
        this.block.pos = [Math.floor(this.width / 2), this.height + 1]
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
  .player > * {display: inline-block;}
  .game {position: relative;outline: solid 1px gray;background-color: black; overflow: hidden;}
  .nextBox {width: 160px;height: 160px;position: relative;background-color: black; vertical-align: top;margin: 30px;}
  .nextBox .next {position: absolute;}
</style>
