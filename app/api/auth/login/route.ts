import * as bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { generateToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
	try {
		// 1. Receber dados do body
		const body = await request.json();
		const { email, password } = body;

		// 2. Validar campos obrigatórios
		if (!email || !password) {
			return NextResponse.json(
				{ message: "Missing required fields" },
				{ status: 400 },
			);
		}

		// 3. Buscar usuário por email
		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		// 4. Se não existir, retornar erro genérico
		if (!existingUser) {
			return NextResponse.json(
				{ message: "Invalid credentials" },
				{ status: 401 },
			);
		}

		// 5. Comparar senha
		const isPasswordValid = await bcrypt.compare(
			password, // ✅ Senha digitada
			existingUser.password, // ✅ Hash do banco
		);

		// 6. Se senha inválida, retornar erro genérico
		if (!isPasswordValid) {
			return NextResponse.json(
				{ message: "Invalid credentials" },
				{ status: 401 },
			);
		}

		// 7. Gerar JWT com dados do usuário
		const token = generateToken({
			userId: existingUser.id,
			email: existingUser.email,
		});

		// 8. Criar response com cookie
		const response = NextResponse.json(
			{
				user: {
					id: existingUser.id,
					userName: existingUser.userName,
					email: existingUser.email,
					createdAt: existingUser.createdAt,
					updatedAt: existingUser.updatedAt,
					// NUNCA retornar password!
				},
				message: "Login successful",
			},
			{ status: 200 },
		);

		// 9. Definir cookie com o token
		response.cookies.set("token", token, {
			httpOnly: true, // JavaScript não pode acessar, proteção contra xss que é um tipo de vulnerabilidade que permite injeção de scripts maliciosos
			secure: process.env.NODE_ENV === "production", // HTTPS em produção
			sameSite: "lax", // Proteção CSRF é um tipo de ataque que 'engana' o navegador para executar ações quando usuario ja esta autenticado
			maxAge: 60 * 60 * 24, // ✅ 1 dia
			path: "/", // Válido para toda aplicação
		});

		return response;
	} catch (error) {
		console.error("Login error:", error);
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
