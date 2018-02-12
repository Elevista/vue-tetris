<template>
  <span class="block">
    <cell v-for="cell of cells" :data="cell.data" :stage="stage" :pos="cell.pos" :key="cell.id"></cell>
  </span>
</template>

<script>
  import cell from './cell.vue'
  import stageComputed from './stageComputed'

  let cellId = 0
  export default {
    name: 'block',
    props: ['stage', 'init'],
    mixins: [stageComputed],
    data () {
      let {pos: [x, y]} = this.init
      return {idx: 0, x, y}
    },
    computed: {
      shape () { return this.shapes[this.idx % this.length] },
      shapes () { return this.init.shapes },
      length () { return this.init.shapes.length },
      style () { return {left: this.x * this.cellSize + 'px', bottom: this.y * this.cellSize + 'px'} },
      cells () {
        return this.shape.map(([x, y]) => {
          return {pos: [x + this.x, y + this.y], data: {class: this.init.class}, id: cellId++}
        })
      }
    },
    methods: {
      predictRotate (i = 0) {
        let {length, shapes, idx, x, y} = this
        return shapes[(idx + 1) % length].map(([_x, _y]) => [x + _x + i, y + _y])
      },
      predictMove (x, y) { return this.shape.map(([_x, _y]) => [_x + this.x + x, _y + this.y + y]) },
      rotate (x) {
        this.x += x
        this.idx++
      },
      move (x, y) {
        this.x += x
        this.y += y
      }
    },
    components: {cell}
  }
</script>

<style scoped>
  .block.guide {opacity: 0.3}
</style>
