var express = require('express');
const { HTTP_CODES } = require('../config/Enum');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.writeHead(HTTP_CODES.OK, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    })

    const intervalId = setInterval(() => {
        const timeNow = new Date().toLocaleTimeString();
        res.write(`data: Şu Anki saat: ${timeNow}\n\n`);
    }, 3000);

    req.on('close', () => {
        console.log("SSE bağlantısı koptu.");
        clearInterval(intervalId);
    });
})

module.exports = router;