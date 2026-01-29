import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

async function logout(): Promise<void> {
	const response = await fetch("/api/auth/logout", {
		method: "POST",
	});

	if (!response.ok) {
		throw new Error("Erro ao fazer logout");
	}
}

export function useLogout() {
	const router = useRouter();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: logout,
		onSuccess: () => {
			queryClient.clear();

			toast.success("Logout realizado!");
			router.push("/login");
		},
		onError: () => {
			toast.error("Erro ao fazer logout");
		},
	});
}
