import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type User = {
	id: number;
	userName: string;
	email: string;
	createdAt: string;
	updatedAt: string;
};

async function fetchUser(): Promise<User> {
	const response = await fetch("/api/auth/me");

	if (!response.ok) {
		throw new Error("Não autenticado");
	}

	const data = await response.json();
	return data.user;
}

export function useUser() {
	const router = useRouter();

	const query = useQuery({
		queryKey: ["user"],
		queryFn: fetchUser,
		retry: false,
		staleTime: 5 * 60 * 1000,
	});

	useEffect(() => {
		if (query.isError) {
			router.push("/login");
		}
	}, [query.isError, router]);

	return query;
}
