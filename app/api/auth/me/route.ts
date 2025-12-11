import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";

/**
 * Rota para pegar dados do usuário logado
 * GET /api/auth/me
 */
export async function GET() {
	// 1. Pegar usuário autenticado
	const user = await getUserFromRequest();

	// 2. Se não autenticado, retornar erro 401
	if (!user) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	// 3. Retornar dados do usuário
	return NextResponse.json({ user }, { status: 200 });
}
