// const str =
// "https://accounts.google.com/o/oauth2/iframerpc?action=issueToken&response_type=token%20id_token&login_hint=AJDLj6JUa8yxXrhHdWRHIV0S13cAWkZtXlNhlv5RH2gR3js_2D2FoRYiqSm-kFgZDc6eN_O1MTWo0oj1K29jrI2yw2Je0b_wrg&client_id=1043638618323-h0msq7ktvro0mp1tgegeqo4lq08e294b.apps.googleusercontent.com&origin=http%3A%2F%2Flocalhost%3A3000&scope=openid%20profile%20email&ss_domain=http%3A%2F%2Flocalhost%3A3000";

const ENDPOINT = "https://graph.facebook.com";
const fields = `id%2Cname%2Cfirst_name%2Cpicture%2Cemail`;

const getGoogleUser = async getGoogleUser => {
  const endpoint = `${ENDPOINT}/me?fields=${fields}&access_token=${facebookToken}`;
  try {
    const response = await fetch(endpoint, { method: "get" });
    const result = response.json();
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

async function createPrismaFromGoogle(ctx, googleUser) {
  return ctx.db.mutation.createUser({
    data: {
      email: googleUser.email,
      name: googleUser.givenName,
      image: googleUser.imageUrl,
      googleUserId: googleUser.googleId,
      permissions: { set: ["USER"] }
    }
  });
}

module.exports.createPrismaFromGoogle = createPrismaFromGoogle;
module.exports.getGoogleUser = getGoogleUser;
