const pino = require('pino').pino

const logger = (defaultConfig) => {
  console.log('next-logger: pino factory called')

  return pino({
    ...defaultConfig,
    transport: {
      targets: [
        // {
        //   target: "pino/file",
        //   level: 'debug',
        //   options: {
        //     destination: `${__dirname}/app.log`,
        //     mkdir: true,
        //     ignore: 'pid',
        //   }
        // },
        {
          level: 'info',
          target: 'pino-pretty',
          options: {
            colorize: true,
            ignore: 'pid',
          },
        },
      ],
    },
    timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
    redact: [],
  })
}

module.exports = { logger }
