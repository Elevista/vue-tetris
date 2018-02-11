<template>
  <div :style="style" :class="data.class||'empty'" class="cell"></div>
</template>

<script>
  import stageComputed from './stageComputed'

  export default {
    name: 'cell',
    props: ['stage', 'data', 'pos'],
    mixins: [stageComputed],
    computed: {
      style () {
        return {
          width: this.cellSize + 'px',
          height: this.cellSize + 'px',
          left: this.pos[0] * this.cellSize + 'px',
          bottom: this.pos[1] * this.cellSize + 'px'
        }
      }
    }
  }
</script>

<style scoped>

  .cell {
    position: absolute;
    box-sizing: border-box;
  }
  .cell.red {
    background-color: red;
    border: outset 3px lightcoral;
  }
  .cell.blue {
    background-color: blue;
    border: outset 3px lightskyblue;
  }
  .cell.green {
    background-color: green;
    border: outset 3px lightgreen;
  }
  .cell.yellow {
    background-color: yellow;
    border: outset 3px lightyellow;
  }

</style>
