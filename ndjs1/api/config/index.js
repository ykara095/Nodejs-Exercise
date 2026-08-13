module.exports = {
    "LOG_LEVEL": process.env.LOG_LEVEL || "debug",
    "CONNECTION_STRING": process.env.CONNECTION_STRING || "postgresql://postgres:muyumuyu50@host:5432/asd",
    "JWT": {
        "SECRET": "123456"
    }
}