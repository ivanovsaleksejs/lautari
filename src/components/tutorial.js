import Element from 'element'
import instructions from '../instructions.json'
import { markdownToHtml, splitList, capitalize } from '../functions.js'
import config from '../config.json'

class Tutorial extends Element
{
  name = "tutorial"

  remove = _ =>
  {
    this.node.remove()
    delete this
  }

  tutorialToHTML = entry =>
    (
      {
        name: "tutorial-entry",
        props : {
          innerHTML: markdownToHtml(entry, {
            "video": "![video](images/sentinel.mp4)",
            "pawn": capitalize(config.promotions.pawn.name),
            "infantry_title": config.promotions.infantry.title,
            "infantry_steps": config.promotions.infantry.steps,
            "infantry": capitalize(config.promotions.infantry.name),
            "rider_title": config.promotions.rider.title,
            "rider_steps": config.promotions.rider.steps,
            "rider": capitalize(config.promotions.rider.name),
            "sentinel_title": config.promotions.sentinel.title,
            "sentinel": capitalize(config.promotions.sentinel.name)
          })
        }
      }
    )

  prepareTutorial = (tutorialGroup, i) =>
    (
      {
        name: "tutorial-page",
        props: { className: i ? "" : "active" },
        children: Object.fromEntries(
          Object.entries(tutorialGroup.map(this.tutorialToHTML))
        )
      }
    )

  tutorialContent = Object.fromEntries(
    Object.entries(splitList(instructions.instructions, "---").map(this.prepareTutorial))
  )

  children = {
    popupWrapper: {
      children: {
        popup: {
          children: {
            closebutton: {
              listeners: {
                click: _ => {
                  this.remove()
                }
              }
            },
            tutorialContent: {
              children: this.tutorialContent
            },
            next: {
              props: { innerText: "Next" },
              listeners: {
                click: _ => {
                  let pages = this.lookup("tutorial-page")
                  let page = pages.findIndex(elem => elem.node.classList.contains('active'))
                  pages[page].node.classList.remove('active')
                  page++
                  page = page < pages.length ? page : 0
                  pages[page].node.classList.add('active')
                }
              }
            }
          }
        }
      }
    }
  }
}

export default Tutorial
