"use strict";

const Message = require("../models/message");
const { ensureLoggedIn } = require("../middleware/auth");
const { UnauthorizedError, BadRequestError } = require("../expressError");

const Router = require("express").Router;
const router = new Router();

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Makes sure that the currently-logged-in users is either the to or from user.
 *
 **/

router.get("/:id", ensureLoggedIn, async function (req, res, next) {
  const username = res.locals.user.username;
  const message = await Message.get(req.params.id);

  if (message.from_user.username === username
    || message.to_user.username === username) {
    return res.json({ message });
  } else {
    throw new UnauthorizedError("Unable to read message");
  }
});

/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/

router.post("/", ensureLoggedIn, async function(req, res, next){
  if (!req.body) throw BadRequestError();
  const username = res.locals.user.username;
  const toUsername = req.body.to_username;
  const body = req.body.body;
  const message = await Message.create({ username, toUsername, body });
  res.json( { message });
});


/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Makes sure that the only the intended recipient can mark as read.
 *
 **/

router.post("/:id/read", ensureLoggedIn, async function (req, res, next){
  const username = res.locals.user.username;
  const message = await Message.get(req.params.id);
  if (message.to_user.username === username){
    const readMessage = await Message.markRead(req.params.id);
    res.json( { message: readMessage });
  } else {
    throw new UnauthorizedError("Unable to mark message as read");
  };
});


module.exports = router;