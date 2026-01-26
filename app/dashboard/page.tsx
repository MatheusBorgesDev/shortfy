"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

type User = {
	id: number;
	userName: string;
	email: string;
	createdAt: string;
	updatedAt: string;
};

export default function DashboardPage() {
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchUser() {
			try {
				const response = await fetch("/api/auth/me");

				if (!response.ok) {
					router.push("/login");
					return;
				}

				const data = await response.json();
				setUser(data.user);
			} catch (error) {
				console.error("Erro ao buscar usuário:", error);
				toast.error("Erro ao carregar dados");
			} finally {
				setIsLoading(false);
			}
		}

		fetchUser();
	}, [router]);

	const handleLogout = async () => {
		try {
			const response = await fetch("/api/auth/logout", {
				method: "POST",
			});

			if (response.ok) {
				toast.success("Logout realizado!");
				router.push("/login");
			}
		} catch (error) {
			console.error("Erro no logout:", error);
			toast.error("Erro ao fazer logout");
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-lg text-slate-600">Carregando...</p>
			</div>
		);
	}

	if (!user) {
		return null;
	}

	return (
		<div className="min-h-screen bg-slate-50 p-8">
			<div className="max-w-4xl mx-auto space-y-8">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold">Dashboard</h1>
						<p className="text-slate-600">Bem-vindo, {user.userName}!</p>
					</div>
					<Button variant="outline" onClick={handleLogout}>
						Sair
					</Button>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Informações da Conta</CardTitle>
						<CardDescription>Seus dados cadastrados no Shortfy</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-sm font-medium text-slate-600">Nome</p>
								<p className="text-lg">{user.userName}</p>
							</div>
							<div>
								<p className="text-sm font-medium text-slate-600">Email</p>
								<p className="text-lg">{user.email}</p>
							</div>
							<div>
								<p className="text-sm font-medium text-slate-600">ID</p>
								<p className="text-lg">#{user.id}</p>
							</div>
							<div>
								<p className="text-sm font-medium text-slate-600">
									Membro desde
								</p>
								<p className="text-lg">
									{new Date(user.createdAt).toLocaleDateString("pt-BR")}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>URLs Encurtadas</CardTitle>
						<CardDescription>
							Em breve você poderá gerenciar suas URLs aqui
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-slate-600 text-center py-8">
							🚧 Funcionalidade em desenvolvimento
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
