const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variables.env" });
const createServer = require("./createServer");
const db = require("./db");

const server = createServer();
server.express.use(cookieParser());

//decode JWT to get user ID on each req
server.express.use((req, res, next) => {
  const { token } = req.cookies;
  // console.log(token);
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    //  put userid one the req for future req
    // console.log(userId);
    req.userId = userId;
  }
  next();
});

server.start(
  {
    cors: {
      credentials: true,
      origin: [process.env.FRONTEND_URL]
    }
  },
  deets => {
    console.log(`Server is now running on port http:/localhost:${deets.port}`);
  }
);
