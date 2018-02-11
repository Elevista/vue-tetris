import tetris from './tetris/tetris'
import 'animate.css/animate.css'

export default {
  name: 'app',
  data () {
    return {}
  },
  components: {tetris},
  templateSrc: './app.html',
  styleSrc: './app.css'
}
