"use strict";

const request = require("supertest");
const jwt = require("jsonwebtoken");

const app = require("../app");
const db = require("../db");

const User = require("../models/user");
const Message = require("../models/message");
const { SECRET_KEY } = require("../config");

describe("Message Routes tests", function () {
  let testUser1Token;
  let testUser2Token;
  let user1;
  let user2;
  let m1;
  let m2;

  beforeEach(async function () {
    await db.query("DELETE FROM messages");
    await db.query("DELETE FROM users");

    user1 = await User.register({
      username: "test1",
      password: "password",
      first_name: "Test1",
      last_name: "Testy1",
      phone: "+14155550000",
    });

    user2 = await User.register({
      username: "test2",
      password: "password",
      first_name: "Test2",
      last_name: "McTest2",
      phone: "+14155551234",
    });

    testUser1Token = jwt.sign({ username: user1.username }, SECRET_KEY);
    testUser2Token = jwt.sign({ username: user2.username }, SECRET_KEY);

    m1 = await Message.create({
      from_username: "test1",
      to_username: "test2",
      body: "u1-to-u2",
    });

    m2 = await Message.create({
      from_username: "test2",
      to_username: "test1",
      body: "u2-to-u1",
    });
  });
});

afterAll(async function () {
  await db.end();
});