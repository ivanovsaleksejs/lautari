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
          "video": "https://github.com/user-attachments/assets/f6eefc4e-6e49-4a94-9399-f8dc68b88fd2",
          "pawn": capitalize(config.promotions.pawn.name),
          "infantry_title": config.promotions.infantry.title,
          "infantry_steps": config.promotions.infantry.steps,
          "infantry": capitalize(config.promotions.infantry.name),
          "rider_title": config.promotions.rider.title,
          "rider_steps": config.promotions.rider.steps,
          "rider": capitalize(config.promotions.rider.name),
          "sentinel_title": config.promotions.sentinel.title,
          "sentinel_steps": config.promotions.sentinel.steps,
          "sentinel": capitalize(config.promotions.sentinel.name),
          "revive_range": config.promotions.sentinel.reviveSteps,
          "position_victory_points": config.resultsConditions.positionVictoryPoints,
          "special_position_victory_points": config.resultsConditions.specialPositionVictoryPoints,
          "domination_victory_points": config.resultsConditions.dominationVictoryPointsDisplay,
          "draw_points": config.resultsConditions.drawPointsDisplay
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
