import jwt from "jsonwebtoken";

const getAuthToken = (user) => {
  const SECRET = process.env.JWT_SECRET;
  const token = jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    SECRET
  );

  return token;
};

export default getAuthToken;
