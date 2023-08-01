const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const { sendWelcomeEmail, sendCancelEmail } = require("../src/emails/account");
const {
  userOneId,
  userOne,
  setupDatabase,
  teardownDatabase,
} = require("./fixtures/db");

jest.mock("../src/emails/account");

beforeEach(setupDatabase);

test("Should signup a new user", async () => {
  const newUser = {
    name: "Sabino Roots",
    email: "sabinoroots@manga.dev",
    password: "sabino123321",
  };

  const response = await request(app)
    .post("/users")
    .send({
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
    })
    .expect(201);

  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  expect(response.body).toMatchObject({
    user: {
      name: newUser.name,
      email: newUser.email,
    },
    token: user.tokens[0].token,
  });

  expect(sendWelcomeEmail).toHaveBeenCalledTimes(1);
  expect(sendWelcomeEmail).toHaveBeenCalledWith(newUser.email, newUser.name);
});

test("Should login existing user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  expect(response.body.token).toBe(user.tokens[1].token);
});

test("Should not login nonexistent user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: "test@test.com",
      password: "!@#$sdasdas",
    })
    .expect(400);
});

test("Should get profile for user", async () => {
  const response = await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user).not.toBeNull();

  expect(response.body).toMatchObject({
    _id: userOneId.toJSON(),
    name: userOne.name,
    email: userOne.email,
    age: user.age,
    createdAt: user.createdAt.toJSON(),
    updatedAt: user.updatedAt.toJSON(),
    __v: user.__v,
  });
});

test("Should not get profile for unauthenticated user", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("Should delete account for user", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user).toBeNull();

  expect(sendCancelEmail).toHaveBeenCalledTimes(1);
  expect(sendCancelEmail).toHaveBeenCalledWith(userOne.email, userOne.name);
});

test("Should not delete account for unauthenticated user", async () => {
  await request(app).delete("/users/me").send().expect(401);
});

test("Should upload avatar image", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/profile-sharingan-pic.png")
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Should update user name", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "Gilberto hihihi",
    })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.name).toBe("Gilberto hihihi");
});

test("Should not update user for unknown property", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      location: "Brazil",
    })
    .expect(400);
});

afterAll(teardownDatabase);


//
// User Test Ideas
//
// Should not signup user with invalid name/email/password
// Should not update user if unauthenticated
// Should not update user with invalid name/email/password
// Should not delete user if unauthenticated