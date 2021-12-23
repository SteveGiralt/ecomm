import express from "express";
import usersRepo from "./repositories/users.js";
import cookieSession from "cookie-session";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    keys: ["LfdSf|yP)0(]GtCPC?B3mLa}DZdDp"],
  })
);

app.get("/signup", (req, res) => {
  res.send(`
  <div>
    Your id is: ${req.session.userId}
    <form method="POST">
        <input name="email" placeholder="email" type="email" />
        <input name="password" placeholder="password" type="password" />
        <input name="passwordConfirmation" placeholder="password confirmation" type="password" />
        <button>Sign Up</button>
    </form>
  </div>
  `);
});

app.post("/signup", async (req, res) => {
  const { email, password, passwordConfirmation } = req.body;

  const existingUser = await usersRepo.getOneBy({ email });

  if (existingUser) {
    return res.send("Email is in use!");
  }

  if (password !== passwordConfirmation) {
    return res.send("Passwords do not match!");
  }

  // Create User in the user repo to represent this person
  const user = await usersRepo.create({ email, password });
  // Store User ID inside a user cookie
  req.session.userId = user.id;

  res.send("Account Created");
});

app.get("/signout", (req, res) => {
  req.session = null;
  res.send("You are logged out!");
});

app.get("/signin", (req, res) => {
  res.send(`
  <div>
    <form method="POST">
        <input name="email" placeholder="email" type="email" />
        <input name="password" placeholder="password" type="password" />
        <button>Sign In</button>
    </form>
  </div>
  `);
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const user = await usersRepo.getOneBy({ email });

  if (!user) {
    return res.send("Email not found!");
  }

  const validPassword = await usersRepo.comparePasswords(
    user.password,
    password
  );

  if (!validPassword) {
    return res.send("Invalid Password!");
  }

  req.session.userId = user.id;

  res.send("Welcome Back!");
});

app.listen(3000, () => {
  console.log("Listening...");
});
