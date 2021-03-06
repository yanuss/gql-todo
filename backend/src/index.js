const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const createServer = require("./createServer");
const db = require("./db");
require("dotenv").config({ path: "variables.env" });

const server = createServer();
server.express.use(cookieParser());

server.express.use(async (req, res, next) => {
  const { token } = req.cookies;
  const { authorization } = req.headers;

  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    req.userId = userId;
  } else if (authorization) {
    const { userId } = jwt.verify(authorization, process.env.APP_SECRET);
    req.userId = userId;
  }
  next();
});

server.express.use(async (req, res, next) => {
  if (!req.userId) return next();
  const user = await db.query.user(
    { where: { id: req.userId } },
    "{ id, permissions, email, name }"
  );
  req.user = user;
  next();
});

server.start(
  {
    cors: {
      credentials: true,
      origin: [
        process.env.FRONTEND_URL,
        process.env.FRONTEND_URL2,
        process.env.FRONTEND_URL3
      ]
    }
  },
  deets => {
    console.log(`Server is now running on port http:/localhost:${deets.port}`);
  }
);
