"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateUrl } from "@/lib/hooks/use-create-url";
import { type CreateUrlData, createUrlSchema } from "@/lib/validations/auth";

export default function NewUrlPage() {
	const router = useRouter();
	const [createdUrl, setCreatedUrl] = useState<{
		shortUrl: string;
		shortCode: string;
	} | null>(null);

	const onSuccess = useCallback(
		(url: { shortUrl: string; shortCode: string }) => {
			setCreatedUrl(url);
		},
		[],
	);

	const { mutate: createUrl, isPending } = useCreateUrl(onSuccess);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<CreateUrlData>({
		resolver: zodResolver(createUrlSchema),
	});

	const onSubmit = useCallback(
		(data: CreateUrlData) => {
			createUrl(data);
			reset();
		},
		[createUrl, reset],
	);

	const copyToClipboard = useCallback((text: string) => {
		navigator.clipboard.writeText(text);
		toast.success("Copiado para área de transferência!");
	}, []);

	const handleBack = useCallback(() => {
		router.push("/dashboard");
	}, [router]);

	const handleTestUrl = useCallback(() => {
		if (createdUrl) {
			window.open(createdUrl.shortUrl, "_blank");
		}
	}, [createdUrl]);

	const handleViewUrls = useCallback(() => {
		router.push("/dashboard");
	}, [router]);

	return (
		<div className="min-h-screen bg-slate-50 p-8">
			<div className="max-w-2xl mx-auto space-y-8">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold">Criar Nova URL</h1>
						<p className="text-slate-600">Encurte sua URL em segundos</p>
					</div>
					<Button variant="outline" onClick={handleBack}>
						Voltar
					</Button>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>URL Original</CardTitle>
						<CardDescription>Cole a URL que deseja encurtar</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="originalUrl">URL</Label>
								<Input
									id="originalUrl"
									type="string"
									placeholder="https://exemplo.com/minha-url-muito-longa"
									{...register("originalUrl")}
									disabled={isPending}
									className={errors.originalUrl ? "border-red-500" : ""}
								/>
								{errors.originalUrl && (
									<p className="text-sm text-red-500 font-medium">
										{errors.originalUrl.message}
									</p>
								)}
							</div>

							<Button type="submit" className="w-full" disabled={isPending}>
								{isPending ? "Criando..." : "Encurtar URL"}
							</Button>
						</form>
					</CardContent>
				</Card>

				{createdUrl && (
					<Card className="border-green-200 bg-green-50">
						<CardHeader>
							<CardTitle className="text-green-900">
								URL Criada com Sucesso!
							</CardTitle>
							<CardDescription className="text-green-700">
								Sua URL encurtada está pronta para usar
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label className="text-green-900">URL Encurtada</Label>
								<div className="flex gap-2">
									<Input
										value={createdUrl.shortUrl}
										readOnly
										className="bg-white"
									/>
									<Button
										onClick={() => copyToClipboard(createdUrl.shortUrl)}
										variant="outline"
									>
										Copiar
									</Button>
								</div>
							</div>

							<div className="flex gap-2">
								<Button
									onClick={handleTestUrl}
									variant="outline"
									className="flex-1"
								>
									Testar URL
								</Button>
								<Button onClick={handleViewUrls} className="flex-1">
									Ver Minhas URLs
								</Button>
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}
