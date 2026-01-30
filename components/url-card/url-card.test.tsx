import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { UrlCard } from "./";

describe("UrlCard", () => {
	const mockUrl = {
		id: 1,
		shortUrl: "https://short.url/abc123",
		originalUrl: "https://example.com/very/long/url/that/should/be/shortened",
		clicks: 42,
		createdAt: "2024-01-15T10:30:00Z",
	};

	const mockOnCopy = vi.fn();
	const mockOnOpen = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renderiza o card corretamente", () => {
		render(<UrlCard url={mockUrl} onCopy={mockOnCopy} onOpen={mockOnOpen} />);

		expect(screen.getByText(mockUrl.shortUrl)).toBeInTheDocument();
		expect(screen.getByText(mockUrl.originalUrl)).toBeInTheDocument();
	});

	it("exibe a URL curta corretamente", () => {
		render(<UrlCard url={mockUrl} onCopy={mockOnCopy} onOpen={mockOnOpen} />);

		const shortUrl = screen.getByText(mockUrl.shortUrl);
		expect(shortUrl).toBeInTheDocument();
		expect(shortUrl).toHaveClass("text-sm", "font-medium", "text-slate-900");
	});

	it("exibe a URL original corretamente", () => {
		render(<UrlCard url={mockUrl} onCopy={mockOnCopy} onOpen={mockOnOpen} />);

		const originalUrl = screen.getByText(mockUrl.originalUrl);
		expect(originalUrl).toBeInTheDocument();
		expect(originalUrl).toHaveClass("text-sm", "text-slate-500");
	});

	it("exibe o número de cliques", () => {
		render(<UrlCard url={mockUrl} onCopy={mockOnCopy} onOpen={mockOnOpen} />);

		expect(screen.getByText("👆 42 cliques")).toBeInTheDocument();
	});

	it("exibe o número de cliques no singular quando é 1", () => {
		const urlWithOneClick = { ...mockUrl, clicks: 1 };
		render(
			<UrlCard url={urlWithOneClick} onCopy={mockOnCopy} onOpen={mockOnOpen} />,
		);

		expect(screen.getByText("👆 1 cliques")).toBeInTheDocument();
	});

	it("exibe a data de criação formatada em pt-BR", () => {
		render(<UrlCard url={mockUrl} onCopy={mockOnCopy} onOpen={mockOnOpen} />);

		expect(screen.getByText(/📅 15\/01\/2024/)).toBeInTheDocument();
	});

	it("renderiza o botão Copiar", () => {
		render(<UrlCard url={mockUrl} onCopy={mockOnCopy} onOpen={mockOnOpen} />);

		expect(screen.getByRole("button", { name: /copiar/i })).toBeInTheDocument();
	});

	it("renderiza o botão Abrir", () => {
		render(<UrlCard url={mockUrl} onCopy={mockOnCopy} onOpen={mockOnOpen} />);

		expect(screen.getByRole("button", { name: /abrir/i })).toBeInTheDocument();
	});

	it("chama onCopy com a URL curta quando o botão Copiar é clicado", async () => {
		const user = userEvent.setup();

		render(<UrlCard url={mockUrl} onCopy={mockOnCopy} onOpen={mockOnOpen} />);

		await user.click(screen.getByRole("button", { name: /copiar/i }));

		expect(mockOnCopy).toHaveBeenCalledTimes(1);
		expect(mockOnCopy).toHaveBeenCalledWith(mockUrl.shortUrl);
	});

	it("chama onOpen com a URL curta quando o botão Abrir é clicado", async () => {
		const user = userEvent.setup();

		render(<UrlCard url={mockUrl} onCopy={mockOnCopy} onOpen={mockOnOpen} />);

		await user.click(screen.getByRole("button", { name: /abrir/i }));

		expect(mockOnOpen).toHaveBeenCalledTimes(1);
		expect(mockOnOpen).toHaveBeenCalledWith(mockUrl.shortUrl);
	});

	it("não chama onOpen quando o botão Copiar é clicado", async () => {
		const user = userEvent.setup();

		render(<UrlCard url={mockUrl} onCopy={mockOnCopy} onOpen={mockOnOpen} />);

		await user.click(screen.getByRole("button", { name: /copiar/i }));

		expect(mockOnOpen).not.toHaveBeenCalled();
	});

	it("não chama onCopy quando o botão Abrir é clicado", async () => {
		const user = userEvent.setup();

		render(<UrlCard url={mockUrl} onCopy={mockOnCopy} onOpen={mockOnOpen} />);

		await user.click(screen.getByRole("button", { name: /abrir/i }));

		expect(mockOnCopy).not.toHaveBeenCalled();
	});

	it("exibe 0 cliques quando não há cliques", () => {
		const urlWithNoClicks = { ...mockUrl, clicks: 0 };

		render(
			<UrlCard url={urlWithNoClicks} onCopy={mockOnCopy} onOpen={mockOnOpen} />,
		);

		expect(screen.getByText("👆 0 cliques")).toBeInTheDocument();
	});

	it("trunca URLs longas com a classe truncate", () => {
		render(<UrlCard url={mockUrl} onCopy={mockOnCopy} onOpen={mockOnOpen} />);

		const shortUrlElement = screen.getByText(mockUrl.shortUrl);
		const originalUrlElement = screen.getByText(mockUrl.originalUrl);

		expect(shortUrlElement).toHaveClass("truncate");
		expect(originalUrlElement).toHaveClass("truncate");
	});

	it("aplica as classes de estilo corretas ao card", () => {
		const { container } = render(
			<UrlCard url={mockUrl} onCopy={mockOnCopy} onOpen={mockOnOpen} />,
		);

		const card = container.firstChild as HTMLElement;
		expect(card).toHaveClass(
			"p-4",
			"border",
			"rounded-lg",
			"hover:bg-slate-50",
			"transition",
		);
	});

	it("usa o componente Button com variante outline e tamanho sm", () => {
		render(<UrlCard url={mockUrl} onCopy={mockOnCopy} onOpen={mockOnOpen} />);

		const buttons = screen.getAllByRole("button");
		buttons.forEach((button) => {
			expect(button).toHaveClass("h-8");
		});
	});

	it("mantém a estrutura de layout correta", () => {
		const { container } = render(
			<UrlCard url={mockUrl} onCopy={mockOnCopy} onOpen={mockOnOpen} />,
		);

		const flexContainer = container.querySelector(
			".flex.items-start.justify-between",
		);
		expect(flexContainer).toBeInTheDocument();
	});

	it("não re-renderiza desnecessariamente quando as props não mudam", () => {
		const { rerender } = render(
			<UrlCard url={mockUrl} onCopy={mockOnCopy} onOpen={mockOnOpen} />,
		);

		rerender(<UrlCard url={mockUrl} onCopy={mockOnCopy} onOpen={mockOnOpen} />);

		expect(screen.getByText(mockUrl.shortUrl)).toBeInTheDocument();
	});

	it("lida com múltiplos cliques nos botões corretamente", async () => {
		const user = userEvent.setup();

		render(<UrlCard url={mockUrl} onCopy={mockOnCopy} onOpen={mockOnOpen} />);

		const copyButton = screen.getByRole("button", { name: /copiar/i });

		await user.click(copyButton);
		await user.click(copyButton);
		await user.click(copyButton);

		expect(mockOnCopy).toHaveBeenCalledTimes(3);
	});

	it("renderiza corretamente com diferentes IDs", () => {
		const url1 = { ...mockUrl, id: 1 };
		const url2 = { ...mockUrl, id: 2 };

		const { rerender } = render(
			<UrlCard url={url1} onCopy={mockOnCopy} onOpen={mockOnOpen} />,
		);

		expect(screen.getByText(url1.shortUrl)).toBeInTheDocument();

		rerender(<UrlCard url={url2} onCopy={mockOnCopy} onOpen={mockOnOpen} />);

		expect(screen.getByText(url2.shortUrl)).toBeInTheDocument();
	});

	it("formata corretamente datas em diferentes fusos horários", () => {
		const urlWithDifferentDate = {
			...mockUrl,
			createdAt: "2023-12-25T23:59:59Z",
		};

		render(
			<UrlCard
				url={urlWithDifferentDate}
				onCopy={mockOnCopy}
				onOpen={mockOnOpen}
			/>,
		);

		expect(screen.getByText(/📅/)).toBeInTheDocument();
	});

	it("tem o displayName correto", () => {
		expect(UrlCard.displayName).toBe("UrlCard");
	});
});
