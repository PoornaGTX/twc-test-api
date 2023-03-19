import User from "../models/User.js";
import httpStatusResponser from "http-status-responser";
import { BadRequestError, UnAuthenticatedError } from "../errors/index.js";

const register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("please provide all values");
  }

  const userAlreadyExsisits = await User.findOne({ email });

  if (userAlreadyExsisits) {
    throw new BadRequestError("Email already in use");
  }

  const user = await User.create({
    email,
    password,
  });

  const token = user.createJWT();

  res.status(httpStatusResponser.CREATED).json({
    user: {
      email: user.email,
    },
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide all values");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new UnAuthenticatedError("invalid Credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError("invalid Credentials");
  }

  const token = user.createJWT();
  user.password = undefined;

  res
    .status(httpStatusResponser.OK)
    .json({ user, token, location: user.location });
};

export { register, login };
