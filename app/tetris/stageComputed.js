export default {
  computed: {
    ground () { return this.stage.ground },
    cellSize () { return this.stage.cellSize },
    width () { return this.stage.width },
    height () { return this.stage.height },
    blocks () { return this.stage.blocks },
    blockType () { return this.stage.blockType },
    tickTime () { return this.stage.tickTime }
  }
}
