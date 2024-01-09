"use strict";

const db = require("./db");
const User = require("./models/user");
const Message = require("./models/message");

async function seed() {
  await db.query("DELETE FROM messages");
  await db.query("DELETE FROM users");
  await db.query("ALTER SEQUENCE messages_id_seq RESTART WITH 1");

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
    from_username: "test1",
    to_username: "joel",
    body: "test-to-joel"
  });
  let m4 = await Message.create({
    from_username: "test1",
    to_username: "joel",
    body: "test-to-joel2"
  });
}

async function main() {
  try {
    // Ensure that the database connection is established before running the seed function
    // await db.connect();
    await seed();
    console.log("Seed data added to database");
  } catch (error) {
    console.error("Error in main:", error);
  } finally {
    // Close the database connection after the seed operation is complete
    await db.end();
    process.exit(0);
  }
}

main();