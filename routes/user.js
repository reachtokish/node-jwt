const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("./../models/user");

const SECRET_KEY = "secret";

// signup api
router.post("/signup", (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(
            user => {
                if(user.length > 0) {
                    return res.status(409).json({
                        message: "Mail Exist"
                    })
                }
                else {
                    bcrypt.hash(req.body.password, 10, (err, hash) => {
                        if(err) {
                            return res.status(500).json({
                                error: "Error is hashing"
                            })
                        }
                        else {
                            const user = new User({
                                email: req.body.email,
                                password: hash
                            })
                            user.save()
                                .then(
                                    result => {
                                        res.status(201).json({
                                            message: "User created"
                                        })
                                    },
                                    error => {
                                        res.status(500).json({
                                            error: error
                                        })
                                    }
                                )
                        }
                    })
                }
            }
        )
})

// delete user api
router.delete("/:userId", (req, res, next) => {
    User.deleteOne({_id: req.params.userId})
        .exec()
        .then(
            res.status(200).json({
                message: "User deleted successfully"
            })
        )
        .catch(err => {
            res.send(500).json({
                message: "Problem deleting user"
            })
        })
})

// signin api
router.post("/signin", (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(
            result => {
                if(result.length <= 0) {
                    return res.status(404).json({
                        message: "User Doesn't exist"
                    })
                }
                else {
                    bcrypt.compare(req.body.password, result[0].password, (err, bcryptResult) => {
                        if(err) {
                            res.status(401).hson({
                                message: "Auth failed"
                            })
                        }
                        if(bcryptResult) {
                            const token = jwt.sign(
                                {
                                    email: result[0].email,
                                    userId: result[0]._id
                                },
                                SECRET_KEY,
                                {
                                    expiresIn: "1h"
                                }
                            )
                            return res.status(200).json({
                                message: "Auth successfull",
                                token: token
                            })
                        }
                        res.status(401).json({
                            message: "Auth failed"
                        })
                    })
                }
            }
        )
        .catch(
            err => {
                console.log("Errorrr")
                res.status(500).json({
                    error: err
                })
            }
        )
})

module.exports = router;