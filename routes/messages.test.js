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
    await db.query("ALTER SEQUENCE messages_id_seq RESTART WITH 1");

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

  describe("GET /:id tests", function () {
    test("shows message details as sending user", async function () {
      let response = await request(app)
        .get(`/messages/${m1.id}`)
        .send({ _token: testUser1Token });

      expect(response.body).toEqual({
        message: {
          id: 1,
          body: "u1-to-u2",
          sent_at: expect.any(String),
          read_at: null, //Why no || expect...
          from_user: {
            username:"test1",
            first_name: "Test1",
            last_name: "Testy1",
            phone: "+14155550000"
          },
          to_user: {
            username: "test2",
            first_name: "Test2",
            last_name: "McTest2",
            phone:"+14155551234"
          },
        }
      });
      expect(response.status).toEqual(200);
    });

    test("shows message details as sent to user", async function () {
      let response = await request(app)
        .get(`/messages/${m1.id}`)
        .send({ _token: testUser2Token });

      expect(response.body).toEqual({
        message: {
          id: 1,
          body: "u1-to-u2",
          sent_at: expect.any(String),
          read_at: null,
          from_user: {
            username:"test1",
            first_name: "Test1",
            last_name: "Testy1",
            phone: "+14155550000"
          },
          to_user: {
            username: "test2",
            first_name: "Test2",
            last_name: "McTest2",
            phone:"+14155551234"
          },
        }
      });
      expect(response.status).toEqual(200);
    });

    test("test response if different user token sent", async function () {
      let response = await request(app)
        .get(`/messages/${m1.id}`)
        .send({ _token: "WRONG" });

      expect(response.status).toEqual(401);
    });
  });

  test("test response if no token sent", async function () {
    let response = await request(app)
      .get(`/messages/${m1.id}`);

    expect(response.status).toEqual(401);
  });
});

afterAll(async function () {
  await db.end();
});