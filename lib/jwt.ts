import jwt from "jsonwebtoken";

type JWTPayload = {
	userId: number;
	email: string;
};

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-me";

export function generateToken(payload: JWTPayload): string {
	return jwt.sign(payload, JWT_SECRET, {
		expiresIn: "1d",
	});
}

export function verifyToken(token: string): JWTPayload | null {
	try {
		const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
		return decoded;
	} catch (error) {
		console.error(error);
		return null;
	}
}
