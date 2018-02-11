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
        height: 24,
        ground: [[]],
        classes: ['red', 'green', 'yellow', 'blue'],
        tickTime: 1000,
        blockShapes: [
          [
            [[-1, 0], [0, 0], [1, 0], [2, 0]],
            [[0, -1], [0, 0], [0, 1], [0, 2]],
            [[-2, 0], [-1, 0], [0, 0], [1, 0]],
            [[0, 1], [0, 0], [0, -1], [0, -2]]
          ],
          [
            [[1, 0], [0, 0], [1, -1], [0, -1]]
          ],
          [
            [[-1, 0], [0, 0], [1, 0], [0, -1]],
            [[0, 1], [-1, 0], [0, 0], [0, -1]],
            [[0, 1], [-1, 0], [0, 0], [1, 0]],
            [[0, 1], [0, 0], [1, 0], [0, -1]]
          ],
          [
            [[0, 0], [1, 0], [-1, -1], [0, -1]],
            [[0, 1], [1, 0], [0, 0], [1, -1]]
          ],
          [
            [[-1, 0], [0, 0], [0, -1], [1, -1]],
            [[0, 1], [-1, 0], [0, 0], [-1, -1]]
          ],
          [
            [[-1, 1], [-1, 0], [0, 0], [1, 0]],
            [[0, 1], [1, 1], [0, 0], [0, -1]],
            [[-1, 0], [0, 0], [1, 0], [1, -1]],
            [[0, 1], [0, 0], [0, -1], [-1, -1]]
          ],
          [
            [[1, 1], [1, 0], [0, 0], [-1, 0]],
            [[0, 1], [0, 0], [0, -1], [1, -1]],
            [[1, 0], [0, 0], [-1, 0], [-1, -1]],
            [[0, 1], [-1, 1], [0, 0], [0, -1]],
          ]
        ]
      }
    }
  },
  created () {
    let {width, height} = this.stage
    let total = width * height
    this.stage.ground = _.chain(total).times(() => null).chunk(width).value()
  },
  components: {player},
  templateSrc: './tetris.html',
  styleSrc: './tetris.css'
}
