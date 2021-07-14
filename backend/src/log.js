import Pino from 'pino';

// Init logger from Pino
const log = Pino({
  level: 'info',
  prettyPrint: { colorize: true },
});

export default log;
