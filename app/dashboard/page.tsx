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

type Url = {
	id: number;
	originalUrl: string;
	shortCode: string;
	shortUrl: string;
	clicks: number;
	createdAt: string;
};

export default function DashboardPage() {
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const [urls, setUrls] = useState<Url[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchData() {
			try {
				const userResponse = await fetch("/api/auth/me");
				if (!userResponse.ok) {
					router.push("/login");
					return;
				}
				const userData = await userResponse.json();
				setUser(userData.user);

				const urlsResponse = await fetch("/api/urls");
				if (urlsResponse.ok) {
					const urlsData = await urlsResponse.json();
					setUrls(urlsData.urls);
				}
			} catch (error) {
				console.error("Erro ao buscar dados:", error);
				toast.error("Erro ao carregar dados");
			} finally {
				setIsLoading(false);
			}
		}

		fetchData();
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

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
		toast.success("Copiado!");
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
			<div className="max-w-6xl mx-auto space-y-8">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold">Dashboard</h1>
						<p className="text-slate-600">Bem-vindo, {user.userName}!</p>
					</div>
					<div className="flex gap-2">
						<Button onClick={() => router.push("/dashboard/urls/new")}>
							+ Nova URL
						</Button>
						<Button variant="outline" onClick={handleLogout}>
							Sair
						</Button>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<Card>
						<CardHeader className="pb-2">
							<CardDescription>Total de URLs</CardDescription>
							<CardTitle className="text-4xl">{urls.length}</CardTitle>
						</CardHeader>
					</Card>
					<Card>
						<CardHeader className="pb-2">
							<CardDescription>Total de Cliques</CardDescription>
							<CardTitle className="text-4xl">
								{urls.reduce((acc, url) => acc + url.clicks, 0)}
							</CardTitle>
						</CardHeader>
					</Card>
					<Card>
						<CardHeader className="pb-2">
							<CardDescription>Membro desde</CardDescription>
							<CardTitle className="text-2xl">
								{new Date(user.createdAt).toLocaleDateString("pt-BR")}
							</CardTitle>
						</CardHeader>
					</Card>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Suas URLs</CardTitle>
						<CardDescription>
							{urls.length === 0
								? "Você ainda não criou nenhuma URL"
								: `${urls.length} URL${urls.length > 1 ? "s" : ""} criada${urls.length > 1 ? "s" : ""}`}
						</CardDescription>
					</CardHeader>
					<CardContent>
						{urls.length === 0 ? (
							<div className="text-center py-12">
								<p className="text-slate-600 mb-4">
									Crie sua primeira URL encurtada!
								</p>
								<Button onClick={() => router.push("/dashboard/urls/new")}>
									+ Criar URL
								</Button>
							</div>
						) : (
							<div className="space-y-4">
								{urls.map((url) => (
									<div
										key={url.id}
										className="p-4 border rounded-lg hover:bg-slate-50 transition"
									>
										<div className="flex items-start justify-between gap-4">
											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium text-slate-900 truncate">
													{url.shortUrl}
												</p>
												<p className="text-sm text-slate-500 truncate">
													{url.originalUrl}
												</p>
												<div className="flex gap-4 mt-2 text-xs text-slate-500">
													<span>👆 {url.clicks} cliques</span>
													<span>
														📅{" "}
														{new Date(url.createdAt).toLocaleDateString(
															"pt-BR",
														)}
													</span>
												</div>
											</div>
											<div className="flex gap-2">
												<Button
													size="sm"
													variant="outline"
													onClick={() => copyToClipboard(url.shortUrl)}
												>
													Copiar
												</Button>
												<Button
													size="sm"
													variant="outline"
													onClick={() => window.open(url.shortUrl, "_blank")}
												>
													Abrir
												</Button>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
