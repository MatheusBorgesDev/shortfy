import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

type CreateUrlData = {
	originalUrl: string;
};

type CreatedUrl = {
	id: number;
	originalUrl: string;
	shortCode: string;
	shortUrl: string;
	clicks: number;
	createdAt: string;
};

async function createUrl(data: CreateUrlData): Promise<CreatedUrl> {
	const response = await fetch("/api/urls", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Erro ao criar URL");
	}

	const result = await response.json();
	return result.url;
}

export function useCreateUrl(onCreated?: (url: CreatedUrl) => void) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createUrl,
		onSuccess: (data) => {
			toast.success("URL criada com sucesso!");
			queryClient.invalidateQueries({ queryKey: ["urls"] });

			onCreated?.(data);
		},
	});
}
