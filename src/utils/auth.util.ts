import jwt, { Secret, SignOptions } from "jsonwebtoken";

export const generateAccessToken = (userId: number, name: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const secret: Secret = process.env.JWT_SECRET;

  return jwt.sign(
    { id: userId, name },
    secret,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES } as SignOptions
  );
};

export const generateRefreshToken = (userId: number, name: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const secret: Secret = process.env.JWT_SECRET;

  return jwt.sign(
    { id: userId, name },
    secret,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES } as SignOptions
  );
};
