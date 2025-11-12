import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET!;

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
	throw new Error("JWT secrets are not configured");
}

export interface TokenPayload {
	userId: string;
}

export const generateAccessToken = (userId: string): string => {
	return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, {
		expiresIn: "15m",
	});
};

export const generateRefreshToken = (userId: string): string => {
	return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
		expiresIn: "7d",
	});
};

export const verifyAccessToken = (token: string): TokenPayload => {
	return jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
	return jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload;
};
