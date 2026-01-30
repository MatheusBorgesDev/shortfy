import { cookies } from "next/headers";
import { verifyToken } from "./jwt";
import { prisma } from "./prisma";

type AuthUser = {
	id: number;
	userName: string;
	email: string;
	createdAt: Date;
	updatedAt: Date;
};

export async function getUserFromRequest(): Promise<AuthUser | null> {
	const cookieStore = await cookies();
	const token = cookieStore.get("token");

	if (!token) {
		return null;
	}

	const payload = verifyToken(token.value);

	if (!payload) {
		return null;
	}

	const user = await prisma.user.findUnique({
		where: { id: payload.userId },
		select: {
			id: true,
			userName: true,
			email: true,
			createdAt: true,
			updatedAt: true,
		},
	});

	if (!user) {
		return null;
	}

	return user;
}
