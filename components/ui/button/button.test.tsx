import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Link from "next/link";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./";

describe("Button", () => {
	it("renderiza o botão com o texto fornecido", () => {
		render(<Button>Clique aqui</Button>);
		expect(
			screen.getByRole("button", { name: /clique aqui/i }),
		).toBeInTheDocument();
	});

	it("aplica a variante default por padrão", () => {
		render(<Button>Default</Button>);
		const button = screen.getByRole("button");
		expect(button).toHaveClass("bg-primary");
	});

	it("aplica a variante destructive corretamente", () => {
		render(<Button variant="destructive">Deletar</Button>);
		const button = screen.getByRole("button");
		expect(button).toHaveClass("bg-destructive");
	});

	it("aplica a variante outline corretamente", () => {
		render(<Button variant="outline">Outline</Button>);
		const button = screen.getByRole("button");
		expect(button).toHaveClass("border", "border-input");
	});

	it("aplica a variante secondary corretamente", () => {
		render(<Button variant="secondary">Secondary</Button>);
		const button = screen.getByRole("button");
		expect(button).toHaveClass("bg-secondary");
	});

	it("aplica a variante ghost corretamente", () => {
		render(<Button variant="ghost">Ghost</Button>);
		const button = screen.getByRole("button");
		expect(button).toHaveClass("hover:bg-accent");
	});

	it("aplica a variante link corretamente", () => {
		render(<Button variant="link">Link</Button>);
		const button = screen.getByRole("button");
		expect(button).toHaveClass("text-primary", "underline-offset-4");
	});

	it("aplica o tamanho default por padrão", () => {
		render(<Button>Default Size</Button>);
		const button = screen.getByRole("button");
		expect(button).toHaveClass("h-9", "px-4", "py-2");
	});

	it("aplica o tamanho sm corretamente", () => {
		render(<Button size="sm">Small</Button>);
		const button = screen.getByRole("button");
		expect(button).toHaveClass("h-8", "px-3", "text-xs");
	});

	it("aplica o tamanho lg corretamente", () => {
		render(<Button size="lg">Large</Button>);
		const button = screen.getByRole("button");
		expect(button).toHaveClass("h-10", "px-8");
	});

	it("aplica o tamanho icon corretamente", () => {
		render(<Button size="icon">🔍</Button>);
		const button = screen.getByRole("button");
		expect(button).toHaveClass("h-9", "w-9");
	});

	it("chama o onClick quando clicado", async () => {
		const handleClick = vi.fn();
		const user = userEvent.setup();

		render(<Button onClick={handleClick}>Clique</Button>);

		await user.click(screen.getByRole("button"));
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it("não chama onClick quando desabilitado", async () => {
		const handleClick = vi.fn();
		const user = userEvent.setup();

		render(
			<Button onClick={handleClick} disabled>
				Desabilitado
			</Button>,
		);

		await user.click(screen.getByRole("button"));
		expect(handleClick).not.toHaveBeenCalled();
	});

	it("aplica classes customizadas", () => {
		render(<Button className="custom-class">Custom</Button>);
		const button = screen.getByRole("button");
		expect(button).toHaveClass("custom-class");
	});

	it("repassa atributos HTML para o elemento button", () => {
		render(
			<Button type="submit" data-testid="submit-button">
				Enviar
			</Button>,
		);
		const button = screen.getByTestId("submit-button");
		expect(button).toHaveAttribute("type", "submit");
	});

	it("renderiza como Slot quando asChild é true", () => {
		render(
			<Button asChild>
				<Link href="/test">Link como botão</Link>
			</Button>,
		);
		const link = screen.getByRole("link");
		expect(link).toHaveAttribute("href", "/test");
	});

	it("encaminha a ref corretamente", () => {
		const ref = { current: null as HTMLButtonElement | null };
		render(<Button ref={ref}>Ref Button</Button>);
		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
	});

	it("combina múltiplas variantes corretamente", () => {
		render(
			<Button variant="outline" size="lg">
				Outline Large
			</Button>,
		);
		const button = screen.getByRole("button");
		expect(button).toHaveClass("border", "border-input", "h-10", "px-8");
	});

	it("está desabilitado quando a prop disabled é passada", () => {
		render(<Button disabled>Desabilitado</Button>);
		expect(screen.getByRole("button")).toBeDisabled();
	});

	it("tem a opacidade reduzida quando desabilitado", () => {
		render(<Button disabled>Desabilitado</Button>);
		const button = screen.getByRole("button");
		expect(button).toHaveClass("disabled:opacity-50");
	});
});
