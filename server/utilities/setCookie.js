import jwt from "jsonwebtoken";

const setCookie = (res, userId ,expiry) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: `${expiry}d`,
  });
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "PRODUCTION",
    sameSite: process.env.NODE_ENV === "PRODUCTION" ? "None" : "Lax",
    maxAge: expiry * 24 * 60 * 60 * 1000
  });
};

export default setCookie;