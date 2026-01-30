import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Label } from "./";

describe("Label", () => {
	it("renderiza o label corretamente", () => {
		render(<Label>Nome</Label>);
		expect(screen.getByText("Nome")).toBeInTheDocument();
	});

	it("aplica as classes padrão", () => {
		render(<Label data-testid="label">Label</Label>);
		const label = screen.getByTestId("label");
		expect(label).toHaveClass("text-sm", "font-medium", "leading-none");
	});

	it("aceita classes customizadas", () => {
		render(
			<Label className="custom-label" data-testid="label">
				Label
			</Label>,
		);
		expect(screen.getByTestId("label")).toHaveClass("custom-label");
	});

	it("pode ser associado a um input via htmlFor", () => {
		render(
			<>
				<Label htmlFor="email-input">Email</Label>
				<input id="email-input" type="email" />
			</>,
		);

		const label = screen.getByText("Email");
		expect(label).toHaveAttribute("for", "email-input");
	});

	it("ao clicar no label, foca no input associado", async () => {
		const user = userEvent.setup();
		const { container } = render(
			<>
				<Label htmlFor="username">Username</Label>
				<input id="username" type="text" />
			</>,
		);

		const label = screen.getByText("Username");
		const input = container.querySelector("#username") as HTMLInputElement;

		await user.click(label);
		expect(input).toHaveFocus();
	});

	it("encaminha a ref corretamente", () => {
		const ref = { current: null as HTMLLabelElement | null };
		render(<Label ref={ref}>Label</Label>);
		expect(ref.current).toBeInstanceOf(HTMLLabelElement);
	});

	it("aceita atributos HTML adicionais", () => {
		render(
			<Label data-testid="label" id="custom-id" title="Custom Title">
				Label
			</Label>,
		);

		const label = screen.getByTestId("label");
		expect(label).toHaveAttribute("id", "custom-id");
		expect(label).toHaveAttribute("title", "Custom Title");
	});

	it("renderiza conteúdo filho complexo", () => {
		render(
			<Label>
				<span>Campo</span>
				<span className="text-red-500">*</span>
			</Label>,
		);

		expect(screen.getByText("Campo")).toBeInTheDocument();
		expect(screen.getByText("*")).toBeInTheDocument();
	});

	it("funciona com inputs desabilitados", () => {
		render(
			<>
				<Label htmlFor="disabled-input">Campo Desabilitado</Label>
				<input id="disabled-input" type="text" disabled />
			</>,
		);

		const label = screen.getByText("Campo Desabilitado");
		expect(label).toBeInTheDocument();
	});

	it("suporta a prop aria-label para acessibilidade", () => {
		render(
			<Label aria-label="Label acessível" data-testid="label">
				Texto do Label
			</Label>,
		);

		const label = screen.getByTestId("label");
		expect(label).toHaveAttribute("aria-label", "Label acessível");
	});

	it("renderiza múltiplos labels", () => {
		render(
			<form>
				<Label htmlFor="name">Nome</Label>
				<input id="name" type="text" />

				<Label htmlFor="email">Email</Label>
				<input id="email" type="email" />

				<Label htmlFor="age">Idade</Label>
				<input id="age" type="number" />
			</form>,
		);

		expect(screen.getByText("Nome")).toBeInTheDocument();
		expect(screen.getByText("Email")).toBeInTheDocument();
		expect(screen.getByText("Idade")).toBeInTheDocument();
	});

	it("mantém a semântica correta do elemento label", () => {
		render(<Label data-testid="label">Label</Label>);
		const label = screen.getByTestId("label");
		expect(label.tagName).toBe("LABEL");
	});

	it("aplica corretamente peer-disabled quando o input peer está desabilitado", () => {
		const { container } = render(
			<div className="peer-group">
				<input type="checkbox" disabled className="peer" />
				<Label data-testid="label">Aceito os termos</Label>
			</div>,
		);

		const label = screen.getByTestId("label");
		expect(label).toHaveClass(
			"peer-disabled:cursor-not-allowed",
			"peer-disabled:opacity-70",
		);
	});

	it("funciona com diferentes tipos de inputs", () => {
		render(
			<>
				<Label htmlFor="checkbox">
					<input id="checkbox" type="checkbox" />
					Checkbox Label
				</Label>

				<Label htmlFor="radio">
					<input id="radio" type="radio" />
					Radio Label
				</Label>

				<Label htmlFor="text">Text Input Label</Label>
				<input id="text" type="text" />
			</>,
		);

		expect(screen.getByText("Checkbox Label")).toBeInTheDocument();
		expect(screen.getByText("Radio Label")).toBeInTheDocument();
		expect(screen.getByText("Text Input Label")).toBeInTheDocument();
	});

	it("mantém as classes quando combinadas com className", () => {
		render(
			<Label className="text-lg text-blue-600" data-testid="label">
				Label
			</Label>,
		);
		const label = screen.getByTestId("label");
		expect(label).toHaveClass("font-medium");
		expect(label).toHaveClass("text-lg", "text-blue-600");
	});
});
