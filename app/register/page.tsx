"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type RegisterFormData, registerSchema } from "@/lib/validations/auth";

export default function RegisterPage() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
	});

	const onSubmit = async (data: RegisterFormData) => {
		setIsLoading(true);

		try {
			const response = await fetch("/api/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (!response.ok) {
				toast.error(result.message || "Erro ao fazer cadastro");
				return;
			}

			toast.success("Cadastro realizado com sucesso!");
			router.push("/login");
		} catch (error) {
			console.error("Erro no cadastro:", error);
			toast.error("Erro ao conectar com o servidor");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold">Cadastro</CardTitle>
					<CardDescription>
						Insira seu nome, e-mail e senha para criar sua conta
					</CardDescription>
				</CardHeader>

				<form onSubmit={handleSubmit(onSubmit)}>
					<CardContent className="space-y-4">
						{/* Campo Nome */}
						<div className="space-y-2">
							<Label htmlFor="userName">Nome do usuário</Label>
							<Input
								id="userName"
								type="text"
								placeholder="Seu nome"
								{...register("userName")}
								disabled={isLoading}
							/>
							{errors.userName && (
								<p className="text-sm text-red-500">
									{errors.userName.message}
								</p>
							)}
						</div>

						{/* Campo Email */}
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="seu@email.com"
								{...register("email")}
								disabled={isLoading}
							/>
							{errors.email && (
								<p className="text-sm text-red-500">{errors.email.message}</p>
							)}
						</div>

						{/* Campo Senha */}
						<div className="space-y-2">
							<Label htmlFor="password">Senha</Label>
							<Input
								id="password"
								type="password"
								placeholder="••••••••"
								{...register("password")}
								disabled={isLoading}
							/>
							{errors.password && (
								<p className="text-sm text-red-500">
									{errors.password.message}
								</p>
							)}
						</div>
					</CardContent>

					<CardFooter className="flex flex-col space-y-4">
						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? "Cadastrando..." : "Cadastrar"}
						</Button>

						<p className="text-sm text-center text-slate-600">
							Já tem uma conta?{" "}
							<a href="/login" className="text-primary hover:underline">
								Faça login
							</a>
						</p>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
