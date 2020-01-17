const { forwardTo } = require("prisma-binding");

const Query = {
  // items: forwardTo('db'),
  item: forwardTo("db"),
  me(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      return null;
    }
    const user = ctx.db.query.user(
      {
        where: { id: ctx.request.userId }
      },
      info
    );
    return user;
  },
  async items(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      return [];
    }
    const items = await ctx.db.query.items({
      where: {
        user: {
          id: ctx.request.userId
        }
      }
    });
    return items;
  }
};

module.exports = Query;
