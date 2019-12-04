const { forwardTo } = require("prisma-binding");

const Query = {
  // items: forwardTo('db'),
  items: forwardTo("db"),
  item: forwardTo("db")
  // async items(parent, args, ctx, info) {
  //   const items = await ctx.db.query.items();
  //   return items;
  // }
  // async item(parent, args, ctx, info) {
  //   const item  = await  ctx.db.query.item();
  // }
};

module.exports = Query;
