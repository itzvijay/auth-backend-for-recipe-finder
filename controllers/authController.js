import joi from "joi";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import getAuthToken from "../utils/getAuthToken.js";

export const registerUser = async (req, res) => {
  const schema = joi.object({
    name: joi.string().min(3).max(30).required(),
    email: joi.string().min(3).max(200).required().email(),
    password: joi.string().min(6).max(1024).required(),
    confirmPassword: joi
      .string()
      .valid(joi.ref("password"))
      .required()
      .strict(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword)
    return res.status(400).send("Password doesnt match");

  const alreadyUser = await User.findOne({ email });
  if (alreadyUser) return res.status(400).send("User Is Already Register");

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name: name,
      email: email,
      password: hashedPassword,
    });

    await user.save();
    const token = getAuthToken(user);
    res.status(200).send(token);
  } catch (error) {
    console.log(error);
    res.status(400).send("Internal Server Error");
  }
};

export const loginUser = async (req, res) => {
  const schema = joi.object({
    email: joi.string().min(3).max(200).required().email(),
    password: joi.string().min(6).max(1024).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  const {email,password} = req.body;

  const isUserRegisterd = await User.findOne({email});
  if(!isUserRegisterd) return res.status(400).send("User with this email Does not exist please register First");

  const isPasswordMatched = await bcrypt.compare(password,isUserRegisterd.password);
  if(!isPasswordMatched) return res.status(400).send("Envalid Email or The Password");

  const token = getAuthToken(isUserRegisterd);
  res.status(200).send(token);
};
