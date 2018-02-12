export default {
  computed: {
    cellSize () { return this.stage.cellSize },
    width () { return this.stage.width },
    height () { return this.stage.height },
    blocks () { return this.stage.blocks },
    blockType () { return this.stage.blockType }
  }
}
