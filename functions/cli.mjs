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
    `rm -rf src/${input}`,
    `mkdir -p src/${input}`,
    `mkdir -p src/${input}/test`,
    `touch src/${input}/index.ts`,
    `touch src/${input}/tsconfig.json`,
    `cat <<EOF > src/${input}/index.ts 
    import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

    export const handler = async (e: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      console.log(JSON.stringify(e, null, 2))
    
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'hello world' }),
      }
    }`,
    `cd src/${input} && npm init -y`,
    `cat <<EOF > src/${input}/tsconfig.json 
    {
      "extends": "../../tsconfig.json",
      "include": ["."]
    }`,
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

  for (const cmd of [
    `rm -rf lib && rm -rf *.zip && rm -rf nodejs && rm -rf ../*.zip`,
    `cd src/${answers} && npm install`,
    `tsc -p ./src/${answers}/tsconfig.json && tsc-alias`,
    `cp src/${answers}/package.json lib/${answers}`,
    `cp src/${answers}/package-lock.json lib/${answers}`,
    "zip -r lambda.zip . -x 'tsconfig.json' -x 'src/*' -x 'node_modules/*' -x '.git' ! -x '.git/*' -x 'cli.mjs' -x './package.json' -x './package-lock.json' -x *.config.js",
    `mkdir nodejs`,
    `cp -r src/${answers}/node_modules ./nodejs`,
    `zip -r layer.zip nodejs`,
    'mv lambda.zip ../',
    'mv layer.zip ../',
  ]) {
    console.log(cmd)
    await execAsync(cmd)
  }
}

;(async () => {
  const answers = await processInquire('1. Process')

  switch (answers) {
    case 'make function':
      await makeFunction()
      break
    case 'deploy function':
      await deployFunction()
      break

    default:
      process.exit(0)
  }
})()
