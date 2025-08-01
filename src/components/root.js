import Element from 'element'
import state from '../state.js'
import config from '../config.json'

class Header extends Element
{
  name = "header"
}

class Root extends Element
{
  name = "root"

  children = {
    header: new Header,
    content: {
      children: {
        game: {},
        rightSide: {
          children: {
            info: {}
          }
        }
      }
    }
  }
}

export default Root
