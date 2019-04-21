const express = require("express");
const router = express.Router();
const checkAuth = require("./../middleware/check-auth");

router.get("/get-product", checkAuth, (req, res, next) => {
    res.status("200").json({
        message: "Got succeed"
    })
})

module.exports = router;