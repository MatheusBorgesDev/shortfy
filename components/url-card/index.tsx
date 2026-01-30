"use client";

import { memo } from "react";
import { Button } from "@/components/ui/button";

type UrlCardProps = {
	url: {
		id: number;
		shortUrl: string;
		originalUrl: string;
		clicks: number;
		createdAt: string;
	};
	onCopy: (text: string) => void;
	onOpen: (shortUrl: string) => void;
};

export const UrlCard = memo(({ url, onCopy, onOpen }: UrlCardProps) => {
	return (
		<div className="p-4 border rounded-lg hover:bg-slate-50 transition">
			<div className="flex items-start justify-between gap-4">
				<div className="flex-1 min-w-0">
					<p className="text-sm font-medium text-slate-900 truncate">
						{url.shortUrl}
					</p>
					<p className="text-sm text-slate-500 truncate">{url.originalUrl}</p>
					<div className="flex gap-4 mt-2 text-xs text-slate-500">
						<span>👆 {url.clicks} cliques</span>
						<span>
							📅 {new Date(url.createdAt).toLocaleDateString("pt-BR")}
						</span>
					</div>
				</div>
				<div className="flex gap-2">
					<Button
						size="sm"
						variant="outline"
						onClick={() => onCopy(url.shortUrl)}
					>
						Copiar
					</Button>
					<Button
						size="sm"
						variant="outline"
						onClick={() => onOpen(url.shortUrl)}
					>
						Abrir
					</Button>
				</div>
			</div>
		</div>
	);
});

UrlCard.displayName = "UrlCard";
