import fs from 'fs'
import path from 'path'

import { substitute, capitalize } from './src/functions.js'
import config from './src/config.json' assert { type: 'json' }

const processInstructions = async jsonFilePaths =>
{
  try {
    let allInstructions = []

    for (const jsonFilePath of jsonFilePaths) {
      const data = await fs.promises.readFile(jsonFilePath, 'utf-8')
      const jsonObject = JSON.parse(data)

      if (!jsonObject.instructions || !Array.isArray(jsonObject.instructions)) {
        console.error(`Warning: 'instructions' array not found in ${jsonFilePath}`)
        continue
      }

      const processedInstructions = jsonObject.instructions.map(line =>
        line = substitute(line.replace(/images\/([^\s)]+)/g, 'src/images/$1'), {
          "pawn": capitalize(config.promotions.pawn.name),
          "horseman_title": config.promotions.horseman.title,
          "horseman_steps": config.promotions.horseman.steps,
          "horseman": capitalize(config.promotions.horseman.name),
          "ranger_title": config.promotions.ranger.title,
          "ranger_steps": config.promotions.ranger.steps,
          "ranger": capitalize(config.promotions.ranger.name),
          "sentinel_title": config.promotions.sentinel.title,
          "sentinel": capitalize(config.promotions.sentinel.name)
        })
      )

      allInstructions.push(...processedInstructions)
    }

    const markdownContent = allInstructions.join('\n\n')

    const outputFilePath = path.join(process.cwd(), 'README.md')
    await fs.promises.writeFile(outputFilePath, markdownContent, 'utf-8')

    console.log('README.md has been created with the updated content from all JSON files.')
  } catch (error) {
    console.error('Error processing instructions:', error)
  }
}

const jsonFilePaths = process.argv.slice(2)

if (jsonFilePaths.length === 0) {
  console.error('Error: Please provide at least one JSON file path as an argument.')
  process.exit(1)
}

processInstructions(jsonFilePaths)
