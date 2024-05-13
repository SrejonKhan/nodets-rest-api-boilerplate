import httpStatus from "http-status";

const handleSignIn = async (req, res, next) => {
  const payload = req.body 
  const { email, password } = req.body;
  

  res.status(httpStatus.OK).send({ msg: "Hello" });
};

export { handleSignIn };
