const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const createServer = require("./createServer");
const db = require("./db");
const cors = require("cors");
require("dotenv").config({ path: "variables.env" });

const server = createServer();
server.express.use(cookieParser());

//decode JWT to get user ID on each req
server.express.use(async (req, res, next) => {
  const { token } = req.cookies;
  // const token = req.headers.authorization || "";
  try {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    //  put userid one the req for future req
    req.userId = userId;
  } catch (err) {
    console.log(err);
  }
  next();
});

// 2. Create a middleware that populates the user on each request
server.express.use(async (req, res, next) => {
  // if they aren't logged in, skip this
  if (!req.userId) return next();
  const user = await db.query.user(
    { where: { id: req.userId } },
    "{ id, permissions, email, name }"
  );
  req.user = user;
  next();
});

const whiteList = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL2,
  process.env.FRONTEND_URL3
];

// server.express.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

server.start(
  {
    cors: {
      credentials: true,
      origin: [
        process.env.FRONTEND_URL,
        process.env.FRONTEND_URL2,
        process.env.FRONTEND_URL3
      ]
      // methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      // preflightContinue: false,
      // optionsSuccessStatus: 204
    }
  },
  deets => {
    console.log(`Server is now running on port http:/localhost:${deets.port}`);
  }
);
