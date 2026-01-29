"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { UrlCard } from "@/components/url-card";
import { useLogout } from "@/lib/hooks/use-logout";
import { useUrls } from "@/lib/hooks/use-urls";
import { useUser } from "@/lib/hooks/use-user";

export default function DashboardPage() {
	const router = useRouter();

	const { data: user, isLoading: userLoading } = useUser();
	const { data: urls = [], isLoading: urlsLoading, refetch } = useUrls();
	const logout = useLogout();

	const stats = useMemo(() => {
		const totalUrls = urls.length;
		const totalClicks = urls.reduce((acc, url) => acc + url.clicks, 0);

		return { totalUrls, totalClicks };
	}, [urls]);

	const memberSince = useMemo(() => {
		if (!user) return "";
		return new Date(user.createdAt).toLocaleDateString("pt-BR");
	}, [user]);

	const handleLogout = useCallback(() => {
		logout.mutate();
	}, [logout]);

	const handleOpenUrl = useCallback(
		async (shortUrl: string) => {
			window.open(shortUrl, "_blank");
			await new Promise((resolve) => setTimeout(resolve, 1000));
			refetch();
			toast.success("Abrindo URL...");
		},
		[refetch],
	);

	const copyToClipboard = useCallback((text: string) => {
		navigator.clipboard.writeText(text);
		toast.success("Copiado!");
	}, []);

	const handleCreateNew = useCallback(() => {
		router.push("/dashboard/urls/new");
	}, [router]);

	const isLoading = userLoading || urlsLoading;

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
						<Button onClick={handleCreateNew}>+ Nova URL</Button>
						<Button
							variant="outline"
							onClick={handleLogout}
							disabled={logout.isPending}
						>
							{logout.isPending ? "Saindo..." : "Sair"}
						</Button>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<Card>
						<CardHeader className="pb-2">
							<CardDescription>Total de URLs</CardDescription>
							<CardTitle className="text-4xl">{stats.totalUrls}</CardTitle>
						</CardHeader>
					</Card>
					<Card>
						<CardHeader className="pb-2">
							<CardDescription>Total de Cliques</CardDescription>
							<CardTitle className="text-4xl">{stats.totalClicks}</CardTitle>
						</CardHeader>
					</Card>
					<Card>
						<CardHeader className="pb-2">
							<CardDescription>Membro desde</CardDescription>
							<CardTitle className="text-2xl">{memberSince}</CardTitle>
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
								<Button onClick={handleCreateNew}>+ Criar URL</Button>
							</div>
						) : (
							<div className="space-y-4">
								{urls.map((url) => (
									<UrlCard
										key={url.id}
										url={url}
										onCopy={copyToClipboard}
										onOpen={handleOpenUrl}
									/>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
