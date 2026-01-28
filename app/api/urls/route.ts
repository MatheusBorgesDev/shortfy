import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateShortCode } from "@/lib/utils/generate-short-code";
import { createUrlSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
	try {
		const user = await getUserFromRequest();

		if (!user) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const validation = createUrlSchema.safeParse(body);

		if (!validation.success) {
			return NextResponse.json(
				{ message: "Dados inválidos", errors: validation.error.errors },
				{ status: 400 },
			);
		}

		const { originalUrl } = validation.data;

		let shortCode = generateShortCode();
		let attempts = 0;
		const maxAttempts = 10;

		while (attempts < maxAttempts) {
			const existing = await prisma.url.findUnique({
				where: { shortCode },
			});

			if (!existing) {
				break;
			}

			shortCode = generateShortCode();
			attempts++;
		}

		if (attempts === maxAttempts) {
			return NextResponse.json(
				{ message: "Erro ao gerar código único. Tente novamente." },
				{ status: 500 },
			);
		}

		const url = await prisma.url.create({
			data: {
				originalUrl,
				shortCode,
				userId: user.id,
			},
		});

		return NextResponse.json(
			{
				url: {
					id: url.id,
					originalUrl: url.originalUrl,
					shortCode: url.shortCode,
					shortUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/${url.shortCode}`,
					clicks: url.clicks,
					createdAt: url.createdAt,
				},
				message: "URL criada com sucesso!",
			},
			{ status: 201 },
		);
	} catch (error) {
		console.error("Erro ao criar URL:", error);
		return NextResponse.json(
			{ message: "Erro interno do servidor" },
			{ status: 500 },
		);
	}
}

export async function GET() {
	try {
		const user = await getUserFromRequest();

		if (!user) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		const urls = await prisma.url.findMany({
			where: { userId: user.id },
			orderBy: { createdAt: "desc" },
		});

		const formattedUrls = urls.map((url) => ({
			id: url.id,
			originalUrl: url.originalUrl,
			shortCode: url.shortCode,
			shortUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/${url.shortCode}`,
			clicks: url.clicks,
			createdAt: url.createdAt,
		}));

		return NextResponse.json({ urls: formattedUrls }, { status: 200 });
	} catch (error) {
		console.error("Erro ao listar URLs:", error);
		return NextResponse.json(
			{ message: "Erro interno do servidor" },
			{ status: 500 },
		);
	}
}
