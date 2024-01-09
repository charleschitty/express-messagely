"use strict";

const request = require("supertest");
const jwt = require("jsonwebtoken");

const app = require("../app");
const db = require("../db");

const User = require("../models/user");
const Message = require("../models/message");
const { SECRET_KEY } = require("../config");

describe("User Routes tests", function () {
  let testUser1Token;
  let testUser2Token;
  let user1;
  let user2;

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

    testUser1Token = jwt.sign({ username: "test1" }, SECRET_KEY);
    testUser2Token = jwt.sign({ username: user2.username }, SECRET_KEY);
  });

  /**GET /users
   * Returns an object with an array of User objects
   *  - { users: [User], [User], ...}
   */

  describe("GET /users tests", function () {
    test("shows a list of all users", async function () {
      let response = await request(app)
        .get("/users")
        .send({ _token: testUser1Token }); //_token vs. token

      expect(response.body).toEqual({
        users: [
          {
            username: "test1",
            first_name: "Test1",
            last_name: "Testy1"
          },
          {
            username: "test2",
            first_name: "Test2",
            last_name: "McTest2"
          }
        ]
      });
    });

    test("test response if no token sent", async function () {
      let response = await request(app)
        .get("/users");

      expect(response.status).toEqual(401);
    });
  });

  describe("GET /:username tests", function () {
    test("shows user details", async function () {
      let response = await request(app)
        .get(`/users/${user1.username}`)
        .send({ _token: testUser1Token });

      expect(response.body).toEqual({
        user: {
          username: "test1",
          first_name: "Test1",
          last_name: "Testy1",
          phone: "+14155550000",
          join_at: expect.any(String),
          last_login_at: null //Why can't I expect.any(String) || null
        }
      });
      expect(response.status).toEqual(200);
    })

    test("test response if different user token sent", async function () {
      let response = await request(app)
        .get(`/users/${user1.username}`)
        .send({ _token: testUser2Token });

      expect(response.status).toEqual(401);
    })
    });

    test("test response if no token sent", async function () {
      let response = await request(app)
        .get(`/users/${user1.username}`);

      expect(response.status).toEqual(401);
    });
  });

afterAll(async function () {
  await db.end();
});