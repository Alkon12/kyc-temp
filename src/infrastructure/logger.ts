// const pino = require("pino");
const pino = require('pino')

class Pino {
  static instance: any

  constructor() {
    if (!Pino.instance) {
      Pino.instance = new pino()
    }

    return Pino.instance
  }
}
