import httpStatus from "http-status";

const handleSignIn = async (req, res, next) => {
  res.status(httpStatus.OK).send({ msg: "Hello" });
};

export { handleSignIn };
