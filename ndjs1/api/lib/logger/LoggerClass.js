const logger = require("./logger");
const Enum = require("../../config/Enum");

class LoggerClass {
    constructor() { }

    #createLogObject(level, email, location, proc_type, log) {
        return {
            level, email, location, proc_type, log
        }
    }

    info(email, location, proc_type, log) {
        let logData = this.#createLogObject(Enum.LOG_LEVELS.INFO, email, location, proc_type, log);
        logger.info(JSON.stringify(logData));
    }

    warn(email, location, proc_type, log) {
        let logData = this.#createLogObject(Enum.LOG_LEVELS.WARN, email, location, proc_type, log);
        logger.warn(JSON.stringify(logData));
    }

    error(email, location, proc_type, log) {
        let logData = this.#createLogObject(Enum.LOG_LEVELS.ERROR, email, location, proc_type, log);
        logger.error(JSON.stringify(logData));
    }

    debug(email, location, proc_type, log) {
        let logData = this.#createLogObject(Enum.LOG_LEVELS.DEBUG, email, location, proc_type, log);
        logger.debug(JSON.stringify(logData));
    }

    verbose(email, location, proc_type, log) {
        let logData = this.#createLogObject(Enum.LOG_LEVELS.VERBOSE, email, location, proc_type, log);
        logger.verbose(JSON.stringify(logData));
    }

    http(email, location, proc_type, log) {
        let logData = this.#createLogObject(Enum.LOG_LEVELS.HTTP, email, location, proc_type, log);
        logger.http(JSON.stringify(logData));
    }
}

module.exports = new LoggerClass();