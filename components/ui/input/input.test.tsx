import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Input } from "./";

describe("Input", () => {
	it("renderiza o input corretamente", () => {
		render(<Input placeholder="Digite aqui" />);
		expect(screen.getByPlaceholderText("Digite aqui")).toBeInTheDocument();
	});

	it("aplica as classes padrão", () => {
		render(<Input data-testid="input" />);
		const input = screen.getByTestId("input");
		expect(input).toHaveClass(
			"flex",
			"h-9",
			"w-full",
			"rounded-md",
			"border",
			"border-input",
			"bg-transparent",
		);
	});

	it("aceita classes customizadas", () => {
		render(<Input className="custom-input" data-testid="input" />);
		expect(screen.getByTestId("input")).toHaveClass("custom-input");
	});

	it("aceita o atributo type", () => {
		render(<Input type="text" data-testid="input" />);
		expect(screen.getByTestId("input")).toHaveAttribute("type", "text");
	});

	it("aceita diferentes tipos de input", () => {
		render(<Input type="email" data-testid="email-input" />);
		expect(screen.getByTestId("email-input")).toHaveAttribute("type", "email");
	});

	it("aceita o tipo password", () => {
		render(<Input type="password" data-testid="password-input" />);
		expect(screen.getByTestId("password-input")).toHaveAttribute(
			"type",
			"password",
		);
	});

	it("aceita o tipo number", () => {
		render(<Input type="number" data-testid="number-input" />);
		expect(screen.getByTestId("number-input")).toHaveAttribute(
			"type",
			"number",
		);
	});

	it("aceita placeholder", () => {
		render(<Input placeholder="Seu nome" />);
		expect(screen.getByPlaceholderText("Seu nome")).toBeInTheDocument();
	});

	it("permite digitar valores", async () => {
		const user = userEvent.setup();
		render(<Input data-testid="input" />);

		const input = screen.getByTestId("input") as HTMLInputElement;
		await user.type(input, "Teste de digitação");

		expect(input).toHaveValue("Teste de digitação");
	});

	it("chama onChange quando o valor muda", async () => {
		const handleChange = vi.fn();
		const user = userEvent.setup();

		render(<Input onChange={handleChange} data-testid="input" />);

		await user.type(screen.getByTestId("input"), "abc");
		expect(handleChange).toHaveBeenCalledTimes(3);
	});

	it("pode ser desabilitado", () => {
		render(<Input disabled data-testid="input" />);
		expect(screen.getByTestId("input")).toBeDisabled();
	});

	it("não permite digitação quando desabilitado", async () => {
		const user = userEvent.setup();
		render(<Input disabled data-testid="input" />);

		const input = screen.getByTestId("input") as HTMLInputElement;
		await user.type(input, "teste");

		expect(input).toHaveValue("");
	});

	it("aceita valor inicial", () => {
		render(<Input defaultValue="Valor inicial" data-testid="input" />);
		expect(screen.getByTestId("input")).toHaveValue("Valor inicial");
	});

	it("pode ser controlado", async () => {
		const TestComponent = () => {
			const [value, setValue] = React.useState("");
			return (
				<Input
					value={value}
					onChange={(e) => setValue(e.target.value)}
					data-testid="input"
				/>
			);
		};

		const user = userEvent.setup();
		render(<TestComponent />);

		const input = screen.getByTestId("input") as HTMLInputElement;
		await user.type(input, "controlado");

		expect(input).toHaveValue("controlado");
	});

	it("encaminha a ref corretamente", () => {
		const ref = { current: null as HTMLInputElement | null };
		render(<Input ref={ref} />);
		expect(ref.current).toBeInstanceOf(HTMLInputElement);
	});

	it("aceita atributos HTML adicionais", () => {
		render(
			<Input
				data-testid="input"
				name="username"
				id="username-input"
				required
				maxLength={50}
			/>,
		);

		const input = screen.getByTestId("input");
		expect(input).toHaveAttribute("name", "username");
		expect(input).toHaveAttribute("id", "username-input");
		expect(input).toHaveAttribute("required");
		expect(input).toHaveAttribute("maxLength", "50");
	});

	it("pode ser somente leitura", () => {
		render(<Input readOnly value="Somente leitura" data-testid="input" />);
		expect(screen.getByTestId("input")).toHaveAttribute("readOnly");
	});

	it("suporta autocomplete", () => {
		render(<Input autoComplete="email" data-testid="input" />);
		expect(screen.getByTestId("input")).toHaveAttribute(
			"autoComplete",
			"email",
		);
	});

	it("limpa o valor quando o usuário apaga o conteúdo", async () => {
		const user = userEvent.setup();
		render(<Input defaultValue="Texto" data-testid="input" />);

		const input = screen.getByTestId("input") as HTMLInputElement;
		await user.clear(input);

		expect(input).toHaveValue("");
	});

	it("foca no input quando focus() é chamado", () => {
		const ref = { current: null as HTMLInputElement | null };
		render(<Input ref={ref} data-testid="input" />);

		ref.current?.focus();
		expect(screen.getByTestId("input")).toHaveFocus();
	});

	it("perde o foco quando blur() é chamado", () => {
		const ref = { current: null as HTMLInputElement | null };
		render(<Input ref={ref} data-testid="input" />);

		ref.current?.focus();
		expect(screen.getByTestId("input")).toHaveFocus();

		ref.current?.blur();
		expect(screen.getByTestId("input")).not.toHaveFocus();
	});

	it("chama onFocus quando ganha foco", async () => {
		const handleFocus = vi.fn();
		const user = userEvent.setup();

		render(<Input onFocus={handleFocus} data-testid="input" />);

		await user.click(screen.getByTestId("input"));
		expect(handleFocus).toHaveBeenCalledTimes(1);
	});

	it("chama onBlur quando perde o foco", async () => {
		const handleBlur = vi.fn();
		const user = userEvent.setup();

		render(
			<>
				<Input onBlur={handleBlur} data-testid="input" />
				<button type="button">Outro elemento</button>
			</>,
		);

		const input = screen.getByTestId("input");
		await user.click(input);
		await user.click(screen.getByRole("button"));

		expect(handleBlur).toHaveBeenCalledTimes(1);
	});
});

import * as React from "react";
