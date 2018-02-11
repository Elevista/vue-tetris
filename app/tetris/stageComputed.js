export default {
  computed: {
    ground () { return this.stage.ground },
    cellSize () { return this.stage.cellSize },
    width () { return this.stage.width },
    height () { return this.stage.height },
    blockShapes () { return this.stage.blockShapes },
    classes () { return this.stage.classes },
    tickTime () { return this.stage.tickTime }
  }
}
