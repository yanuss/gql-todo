const { forwardTo } = require("prisma-binding");

const Query = {
  // items: forwardTo('db'),
  items: forwardTo("db"),
  item: forwardTo("db"),
  me(parent, args, ctx, info) {
    // check if there is a current user ID
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
  }
  // async items(parent, args, ctx, info) {
  //   const items = await ctx.db.query.items();
  //   return items;
  // }
  // async item(parent, args, ctx, info) {
  //   const item  = await  ctx.db.query.item();
  // }
};

module.exports = Query;
