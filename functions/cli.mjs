import { exec } from 'child_process'
import fs from 'fs'
import inquirer from 'inquirer'
import { promisify } from 'util'

const execAsync = promisify(exec)

const processInquire = async (title, args = ['make function', 'deploy function']) =>
  await inquirer
    .prompt({
      type: 'list',
      name: 'option',
      message: title,
      choices: args,
    })
    .then((res) => res.option)

const inputProcess = async () =>
  await inquirer
    .prompt({
      type: 'input',
      name: 'option',
      message: 'What Make Function?',
    })
    .then((res) => res.option)

const makeFunction = async () => {
  const input = await inputProcess()

  for (const cmd of [
    `mkdir -p src/${input}`,
    `mkdir -p src/${input}/test`,
    `touch src/${input}/index.ts`,
    `cd src/${input} && npm init -y`,
    `cd src/${input} && tsc --init`,
    `cd src/${input} && npm i aws-lambda aws-sdk huelgo-sz huelgo-monad lodash`,
    `cd src/${input} && npm i -D @babel/preset-env @babel/preset-typescript @types/aws-lambda @types/jest @types/lodash ts-node`,
    `cp babel.config.js ./src/${input}/babel.config.js`,
    `cp jest.config.js ./src/${input}/jest.config.js`,
  ]) {
    console.log(cmd)
    await execAsync(cmd)
  }
}

const deployFunction = async () => {
  const answers = await processInquire(
    'What Deploy Function?',
    fs.readdirSync('./src').filter((it) => it != 'common')
  )

  for (const cmd of []) {
    console.log(cmd)
    await execAsync(cmd)
  }
}

;(async () => {
  const answers = await processInquire('1. Process')

  switch (answers) {
    case 'make function':
      await makeFunction()
    case 'deploy function':
      await deployFunction()

    default:
      process.exit(0)
  }
})()
