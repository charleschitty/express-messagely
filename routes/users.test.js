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

  beforeEach(async function () {
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM messages");

    const user1 = await User.register({
      username: "test1",
      password: "password",
      first_name: "Test1",
      last_name: "Testy1",
      phone: "+14155550000",
    });

    const user2 = await User.register({
      username: "test2",
      password: "password",
      first_name: "Test2",
      last_name: "McTest2",
      phone: "+14155551234",
    });

    testUser1Token = jwt.sign({ username: user1.username }, SECRET_KEY);
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
        .send({ token: testUser1Token });

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
  });

});

afterAll(async function () {
  await db.end();
});