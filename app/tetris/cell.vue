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
    border-style: outset;
    border-width: 3px;
    border-top-color: rgba(255, 255, 255, 0.3);
    border-left-color: rgba(255, 255, 255, 0.3);
  }
  .cell.I {
    background-color: cyan;
    border-right-color: cyan;
    border-bottom-color: cyan;
  }
  .cell.O {
    background-color: yellow;
    border-right-color: yellow;
    border-bottom-color: yellow;
  }
  .cell.T {
    background-color: magenta;
    border-right-color: magenta;
    border-bottom-color: magenta;
  }
  .cell.S {
    background-color: lime;
    border-right-color: lime;
    border-bottom-color: lime;
  }
  .cell.Z {
    background-color: red;
    border-right-color: red;
    border-bottom-color: red;
  }
  .cell.J {
    background-color: blue;
    border-right-color: blue;
    border-bottom-color: blue;
  }
  .cell.L {
    background-color: orange;
    border-right-color: orange;
    border-bottom-color: orange;
  }

</style>
