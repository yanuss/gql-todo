const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomBytes } = require("crypto");
const { promisify } = require("util");
const { forwardTo } = require("prisma-binding");
const { transport, makeANiceEmail } = require("../mail");
const {
  createPrismaUserFromFacebook,
  getFacebookUser
} = require("../utils/facebook");

const maxAge = 1000 * 60 * 60 * 24 * 10; // 10 days

const Mutation = {
  async createItem(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error("You must be logged in");
    }
    const item = await ctx.db.mutation.createItem(
      { data: { user: { connect: { id: ctx.request.userId } }, ...args } },
      info
    );
    return item;
  },
  updateToDo(parent, args, ctx, info) {
    const updates = { ...args };
    delete updates.id;
    return ctx.db.mutation.updateItem(
      {
        data: updates,
        where: {
          id: args.id
        }
      },
      info
    );
  },
  deleteItem: forwardTo("db"),
  async signup(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();
    const email = await ctx.db.query.user({ where: { email: args.email } });
    if (email) {
      throw new Error(`User already exist ${email}`);
    }
    if (!args.password) {
      throw new Error(`Password not provided`);
    }
    const password = await bcrypt.hash(args.password, 10);
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ["USER"] }
        }
      },
      info
    );
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    ctx.response.cookie("token", token, {
      SameSite: "None",
      httpOnly: true,
      maxAge
    });
    return user;
  },
  async signin(parent, { email, password }, ctx, info) {
    // 1. check if there is a user with that email
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error(`No such user found for email ${email}`);
    }
    // 2. Check if their password is correct
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error("Invalid Password!");
    }
    // 3. generate the JWT Token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // 4. Set the cookie with the token
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge
    });
    // 5. Return the user
    return user;
  },
  async facebookSignin(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();
    const userWithEmail = await ctx.db.query.user({
      where: { email: args.email }
    });
    if (userWithEmail && !userWithEmail.facebookUserId) {
      throw new Error(`User already exist ${userWithEmail.email}`);
    }
    let user;
    try {
      user = await ctx.db.query.user(
        { where: { facebookUserId: args.facebookUserId } },
        info
      );
      if (!user) {
        user = await ctx.db.mutation.createUser(
          {
            data: {
              ...args,
              permissions: { set: ["USER"] }
            }
          },
          info
        );
      }
      const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
      ctx.response.cookie("token", token, {
        SameSite: "None",
        httpOnly: true,
        maxAge
      });
      return user;
    } catch (error) {
      throw new Error(error);
    }
  },
  async facebookSigninWithToken(parent, { idToken }, ctx, info) {
    let user = null;
    try {
      const facebookUser = await getFacebookUser(idToken);
      user = await ctx.db.query.user(
        { where: { email: facebookUser.email } },
        info
      );
      if (user && !user.facebookUserId) {
        throw new Error(`User already exist ${user.email}`);
      }
      if (!user) {
        user = await createPrismaUserFromFacebook(ctx, facebookUser);
      }
      const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
      ctx.response.cookie("token", token, {
        SameSite: "None",
        httpOnly: true,
        maxAge
      });
      return user;
    } catch (error) {
      throw new Error(error);
    }
  },
  async googleSignin(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();
    const userWithEmail = await ctx.db.query.user({
      where: { email: args.email }
    });
    if (userWithEmail && !userWithEmail.googleUserId) {
      throw new Error(`User already exist ${userWithEmail.email}`);
    }
    let user;
    try {
      user = await ctx.db.query.user(
        { where: { googleUserId: args.googleUserId } },
        info
      );
      if (!user) {
        user = await ctx.db.mutation.createUser(
          {
            data: {
              ...args,
              permissions: { set: ["USER"] }
            }
          },
          info
        );
      }
      const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
      ctx.response.cookie("token", token, {
        SameSite: "None",
        httpOnly: true,
        maxAge
      });
      return user;
    } catch (error) {
      throw new Error(error);
    }
  },
  signout(parent, args, ctx, info) {
    ctx.response.clearCookie("token");
    return { message: "Goodbye!" };
  },
  async requestReset(parent, args, ctx, info) {
    // 1. Check if this is a real user
    const user = await ctx.db.query.user({ where: { email: args.email } });
    if (!user) {
      throw new Error(`No such user found for email ${args.email}`);
    }
    // 2. Set a reset token and expiry on that user
    const randomBytesPromiseified = promisify(randomBytes);
    const resetToken = (await randomBytesPromiseified(20)).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
    const res = await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken, resetTokenExpiry }
    });
    // 3. Email them that reset token
    const mailRes = await transport.sendMail({
      from: "gqltodonoreply@gmail.com",
      to: user.email,
      subject: "Your Password Reset Token",
      html: makeANiceEmail(`Your Password Reset Token is here!
      \n\n
      <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">Click Here to Reset</a>`)
    });
    // 4. Return the message
    return { message: "Thanks!" };
  },
  async resetPassword(parent, args, ctx, info) {
    // 1. check if the passwords match
    if (args.password !== args.confirmPassword) {
      throw new Error("Yo Passwords don't match!");
    }
    // 2. check if its a legit reset token
    // 3. Check if its expired
    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000
      }
    });
    if (!user) {
      throw new Error("This token is either invalid or expired!");
    }
    // 4. Hash their new password
    const password = await bcrypt.hash(args.password, 10);
    // 5. Save the new password to the user and remove old resetToken fields
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null
      }
    });
    // 6. Generate JWT
    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
    // 7. Set the JWT cookie
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge
    });
    // 8. return the new user
    return updatedUser;
  }
};

module.exports = Mutation;
