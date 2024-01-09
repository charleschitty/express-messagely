"use strict";

const Router = require("express").Router;
const router = new Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { BadRequestError, UnauthorizedError } = require("../expressError");
const { SECRET_KEY } = require("../config");

/** POST /login: {username, password} => {token} */

router.post("/login", async function (req, res) {
  if (req.body === undefined) throw new BadRequestError();
  const { username, password } = req.body;

  if (await User.authenticate(username, password) === true) {
    User.updateLoginTimestamp(username);
    const token = jwt.sign({ username }, SECRET_KEY);
    return res.json({ token });

  } else {
    throw new UnauthorizedError();
  };
});


/** POST /register: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 */

router.post("/register", async function (req, res) {
  if (req.body === undefined) throw new BadRequestError();
  const { username } = await User.register(req.body);
  User.updateLoginTimestamp(username);
  const token = jwt.sign({ username }, SECRET_KEY);
  return res.json({ token });
});

module.exports = router;