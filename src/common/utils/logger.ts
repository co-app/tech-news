export class Logger {
  static info(msg: any) {
    console.log(JSON.stringify(msg, null, 2))
  }

  static warn() {}

  static debug() {}

  static error() {}
}
