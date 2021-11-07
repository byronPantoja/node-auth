import bcrypt from "bcryptjs";
const { compare } = bcrypt;

export async function signInUser(email, password) {
  // look up user
  const { user } = await import("../user/user.js");
  // get user pw
  const userData = await user.findOne({
    "email.address": email,
  });

  const savedPassword = userData.password;
  // Compare password with one in database
  const isAuthorized = await compare(password, savedPassword);
  console.log("isAuthorized", isAuthorized);
  // Return boolean of if password is correct
  return isAuthorized;
}
