const AuditLogsDB = require("../db/AuditLogs");
const Enum = require("../config/Enum");
const logger = require("./logger/LoggerClass");


let instance = null;
class AuditLogs {
    constructor() {
        if (!instance) {
            instance = this;
        }

        return instance;
    }

    info(email, location, proc_type, log) {
        this.#saveToDB(
            Enum.LOG_LEVELS.INFO,
            email, location, proc_type, log
        );
        logger.info(email, location, proc_type, log);
    }

    warn(email, location, proc_type, log) {
        this.#saveToDB(
            Enum.LOG_LEVELS.WARN,
            email, location, proc_type, log
        );
        logger.warn(email, location, proc_type, log);
    }

    error(email, location, proc_type, log) {
        this.#saveToDB(
            Enum.LOG_LEVELS.ERROR,
            email, location, proc_type, log
        );
        logger.error(email, location, proc_type, log);
    }

    debug(email, location, proc_type, log) {
        this.#saveToDB(
            Enum.LOG_LEVELS.DEBUG,
            email, location, proc_type, log
        );
        logger.debug(email, location, proc_type, log);
    }

    verbose(email, location, proc_type, log) {
        this.#saveToDB(
            Enum.LOG_LEVELS.VERBOSE,
            email, location, proc_type, log
        );
        logger.verbose(email, location, proc_type, log);
    }

    http(email, location, proc_type, log) {
        this.#saveToDB(
            Enum.LOG_LEVELS.HTTP,
            email, location, proc_type, log
        );
        logger.http(email, location, proc_type, log);
    }

    #saveToDB(level, email, location, proc_type, log) {
        // PostgreSQL JSON tabanlı bir sütun için bizden geçerli bir JSON formatı (veya obje) bekler.
        // Düz bir metni (string) doğrudan yolladığımızda hata verdiği için onu JSON formatına çeviriyoruz.
        let logData = log ? JSON.stringify(log) : null;

        AuditLogsDB.add(level, email || null, location || null, proc_type || null, logData).catch((error) => {
            console.error("Audit loglarini kaydederken hata olustu:", error);
        })
    }
}

module.exports = new AuditLogs();