const ENDPOINT = "https://graph.facebook.com";
const fields = `id%2Cname%2Cfirst_name%2Cpicture%2Cemail`;
const getFacebookUser = async facebookToken => {
  const endpoint = `${ENDPOINT}/me?fields=${fields}&access_token=${facebookToken}`;
  try {
    const response = await fetch(endpoint, { method: "get" });
    const result = response.json();
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

async function createPrismaUserFromFacebook(ctx, facebookUser) {
  return ctx.db.mutation.createUser({
    data: {
      email: facebookUser.email,
      name: facebookUser.name,
      picture: facebookUser.picture.data.url,
      facebookUserId: facebookUser.id,
      permissions: { set: ["USER"] }
    }
  });
}

module.exports.createPrismaUserFromFacebook = createPrismaUserFromFacebook;
module.exports.getFacebookUser = getFacebookUser;
