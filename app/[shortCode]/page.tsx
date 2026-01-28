import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

type Props = {
	params: Promise<{ shortCode: string }>;
};

export default async function RedirectPage({ params }: Props) {
	const { shortCode } = await params;

	const url = await prisma.url.findUnique({
		where: { shortCode },
	});

	if (!url) {
		notFound();
	}

	prisma.url
		.update({
			where: { id: url.id },
			data: { clicks: { increment: 1 } },
		})
		.catch((error) => {
			console.error("Erro ao incrementar clicks:", error);
		});

	redirect(url.originalUrl);
}
