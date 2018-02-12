<template>
  <div class="tetris">
    <player :stage="stage" :keys="{straight:32,left:37,rotate:38,right:39,down:40}" ref="player"/>
  </div>
</template>

<script>
  import player from './player.vue'
  import stageComputed from './stageComputed'

  export default {
    name: 'tetris',
    mixins: [stageComputed],
    data () {
      return {
        stage: {
          cellSize: 30,
          width: 10,
          height: 22,
          ground: [[]],
          tickTime: 500,
          blockType: {
            I: [
              [[-1, 1], [0, 1], [1, 1], [2, 1]],
              [[1, 2], [1, 1], [1, 0], [1, -1]],
              [[-1, 0], [0, 0], [1, 0], [2, 0]],
              [[0, 2], [0, 1], [0, 0], [0, -1]]
            ],
            O: [
              [[-1, 1], [0, 1], [-1, 0], [0, 0]]
            ],
            T: [
              [[0, 1], [-1, 0], [0, 0], [1, 0]],
              [[0, 1], [0, 0], [1, 0], [0, -1]],
              [[-1, 0], [0, 0], [1, 0], [0, -1]],
              [[0, 1], [-1, 0], [0, 0], [0, -1]],
            ],
            S: [
              [[0, 1], [1, 1], [-1, 0], [0, 0]],
              [[0, 1], [0, 0], [1, 0], [1, -1]],
              [[0, 0], [1, 0], [-1, -1], [0, -1]],
              [[-1, 1], [-1, 0], [0, 0], [0, -1]]
            ],
            Z: [
              [[-1, 1], [0, 1], [0, 0], [1, 0]],
              [[1, 1], [0, 0], [1, 0], [0, -1]],
              [[-1, 0], [0, 0], [0, -1], [1, -1]],
              [[0, 1], [-1, 0], [0, 0], [-1, -1]],
            ],
            J: [
              [[-1, 1], [-1, 0], [0, 0], [1, 0]],
              [[0, 1], [1, 1], [0, 0], [0, -1]],
              [[-1, 0], [0, 0], [1, 0], [1, -1]],
              [[0, 1], [0, 0], [0, -1], [-1, -1]]
            ],
            L: [
              [[1, 1], [1, 0], [0, 0], [-1, 0]],
              [[0, 1], [0, 0], [0, -1], [1, -1]],
              [[1, 0], [0, 0], [-1, 0], [-1, -1]],
              [[0, 1], [-1, 1], [0, 0], [0, -1]]
            ]
          },
          blocks: ['I', 'O', 'T', 'S', 'Z', 'J', 'L']
        }
      }
    },
    created () {
      let {width, height} = this.stage
      let total = width * height
      this.stage.ground = _.chain(total).times(() => null).chunk(width).value()
    },
    components: {player}
  }
</script>

