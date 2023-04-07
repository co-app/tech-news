import { exec } from 'child_process'
import fs from 'fs'
import inquirer from 'inquirer'
import { promisify } from 'util'
;(async () => {
  const answers = await inquirer.prompt({
    type: 'list',
    name: 'option',
    message: 'What Deploy Function?',
    choices: fs.readdirSync('./src').filter((item) => item != 'common'),
  })

  const { option } = answers
  const execAsync = promisify(exec)

  for (const cmd of new Array(
    'npm run clean',
    `cd src/${option} && npm install`,
    `tsc -p ./src/${option}/tsconfig.json && tsc-alias`,
    `cp src/${option}/package.json lib/${option}`,
    `cp src/${option}/package-lock.json lib/${option}`,
    'npm run function-zip',
    `cd src/${option} && rm -rf nodejs && mkdir nodejs && mv node_modules nodejs && zip -r layer.zip nodejs && mv layer.zip ../../`
  )) {
    try {
      await execAsync(cmd)
      console.log(cmd)
    } catch (e) {
      console.error(e)
      process.exit(0)
    }
  }
  console.log('---------------- complete ----------------')
})()
