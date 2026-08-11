const express = require("express");
const router = express.Router();
const isAuthenticated = false;

router.get("/", (req, res, next) => {
    if (isAuthenticated) {
        next();
    } else {
        res.json({ success: false, error: "Not authenticated" });
    }
})

module.exports = router;