import * as bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { generateToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { email, password } = body;

		if (!email || !password) {
			return NextResponse.json(
				{ message: "Missing required fields" },
				{ status: 400 },
			);
		}

		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (!existingUser) {
			return NextResponse.json(
				{ message: "Invalid credentials" },
				{ status: 401 },
			);
		}

		const isPasswordValid = await bcrypt.compare(
			password,
			existingUser.password,
		);

		if (!isPasswordValid) {
			return NextResponse.json(
				{ message: "Invalid credentials" },
				{ status: 401 },
			);
		}

		const token = generateToken({
			userId: existingUser.id,
			email: existingUser.email,
		});

		const response = NextResponse.json(
			{
				user: {
					id: existingUser.id,
					userName: existingUser.userName,
					email: existingUser.email,
					createdAt: existingUser.createdAt,
					updatedAt: existingUser.updatedAt,
				},
				message: "Login successful",
			},
			{ status: 200 },
		);

		response.cookies.set("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 60 * 60 * 24,
			path: "/",
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
