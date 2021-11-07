import bcrypt from "bcryptjs";
const { genSalt, hash } = bcrypt;

export async function signUpUser(email, password) {
  //dyanmic import - imports when its needed
  const { user } = await import("../user/user.js");
  // generate the salt
  const salt = await genSalt(10);

  // hash with salt
  const hashedPassword = await hash(password, salt);

  // store in database
  const result = await user.insertOne({
    email: {
      address: email,
      verified: false,
    },
    password: hashedPassword,
  });

  // return user from database
  return result.insertedId;
}
