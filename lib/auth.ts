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

/**
 * Extrai o usuário autenticado da requisição
 * @returns Dados completos do usuário ou null se não autenticado
 */
export async function getUserFromRequest(): Promise<AuthUser | null> {
	// 1. Pegar token dos cookies
	const cookieStore = await cookies();
	const token = cookieStore.get("token");

	if (!token) {
		return null;
	}

	// 2. Validar token
	const payload = verifyToken(token.value);

	if (!payload) {
		return null;
	}

	// 3. Buscar usuário completo no banco
	const user = await prisma.user.findUnique({
		where: { id: payload.userId },
		select: {
			id: true,
			userName: true,
			email: true,
			createdAt: true,
			updatedAt: true,
			// ⚠️ NÃO selecionar password!
		},
	});

	// 4. Se usuário não existe mais (foi deletado), retornar null
	if (!user) {
		return null;
	}

	return user;
}
