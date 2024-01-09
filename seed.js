"use strict";

const db = require("./db");
const User = require("./models/user");
const Message = require("./models/message");

async function seed() {
  let u1 = await User.register({
    username: "test1",
    password: "password",
    first_name: "Test1",
    last_name: "Testy1",
    phone: "+14155550000",
  });

  let u2 = await User.register({
    username: "joel",
    password: "password",
    first_name: "Joel",
    last_name: "Burton",
    phone: "+14155551212",
  });

  let m1 = await Message.create({
    from_username: "joel",
    to_username: "test1",
    body: "joel-to-test"
  });

  let m2 = await Message.create({
    from_username: "joel",
    to_username: "test1",
    body: "joel-to-test2"
  });
  let m3 = await Message.create({
    from_username: "joel",
    to_username: "test1",
    body: "test-to-joel"
  });
  let m4 = await Message.create({
    from_username: "joel",
    to_username: "test1",
    body: "test-to-joel2"
  });
}

seed();