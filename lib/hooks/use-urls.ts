import { useQuery } from "@tanstack/react-query";

type Url = {
	id: number;
	originalUrl: string;
	shortCode: string;
	shortUrl: string;
	clicks: number;
	createdAt: string;
};

async function fetchUrls(): Promise<Url[]> {
	const response = await fetch("/api/urls");

	if (!response.ok) {
		throw new Error("Erro ao buscar URLs");
	}

	const data = await response.json();
	return data.urls;
}

export function useUrls() {
	return useQuery({
		queryKey: ["urls"],
		queryFn: fetchUrls,
		refetchInterval: 60000,
	});
}
