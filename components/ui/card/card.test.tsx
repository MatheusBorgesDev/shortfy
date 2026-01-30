import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./";

describe("Card Components", () => {
	describe("Card", () => {
		it("renderiza o card corretamente", () => {
			render(<Card data-testid="card">Conteúdo do card</Card>);
			expect(screen.getByTestId("card")).toBeInTheDocument();
		});

		it("aplica as classes padrão", () => {
			render(<Card data-testid="card">Card</Card>);
			const card = screen.getByTestId("card");
			expect(card).toHaveClass("rounded-xl", "border", "bg-card", "shadow");
		});

		it("aceita classes customizadas", () => {
			render(
				<Card className="custom-card" data-testid="card">
					Card
				</Card>,
			);
			expect(screen.getByTestId("card")).toHaveClass("custom-card");
		});

		it("repassa atributos HTML", () => {
			render(
				<Card data-testid="card" role="article">
					Card
				</Card>,
			);
			expect(screen.getByTestId("card")).toHaveAttribute("role", "article");
		});

		it("encaminha a ref corretamente", () => {
			const ref = { current: null as HTMLDivElement | null };
			render(<Card ref={ref}>Card</Card>);
			expect(ref.current).toBeInstanceOf(HTMLDivElement);
		});
	});

	describe("CardHeader", () => {
		it("renderiza o header corretamente", () => {
			render(<CardHeader data-testid="header">Header</CardHeader>);
			expect(screen.getByTestId("header")).toBeInTheDocument();
		});

		it("aplica as classes padrão", () => {
			render(<CardHeader data-testid="header">Header</CardHeader>);
			const header = screen.getByTestId("header");
			expect(header).toHaveClass("flex", "flex-col", "space-y-1.5", "p-6");
		});

		it("aceita classes customizadas", () => {
			render(
				<CardHeader className="custom-header" data-testid="header">
					Header
				</CardHeader>,
			);
			expect(screen.getByTestId("header")).toHaveClass("custom-header");
		});

		it("encaminha a ref corretamente", () => {
			const ref = { current: null as HTMLDivElement | null };
			render(<CardHeader ref={ref}>Header</CardHeader>);
			expect(ref.current).toBeInstanceOf(HTMLDivElement);
		});
	});

	describe("CardTitle", () => {
		it("renderiza o título corretamente", () => {
			render(<CardTitle>Título do Card</CardTitle>);
			expect(screen.getByText("Título do Card")).toBeInTheDocument();
		});

		it("aplica as classes padrão", () => {
			render(<CardTitle data-testid="title">Título</CardTitle>);
			const title = screen.getByTestId("title");
			expect(title).toHaveClass(
				"font-semibold",
				"leading-none",
				"tracking-tight",
			);
		});

		it("aceita classes customizadas", () => {
			render(
				<CardTitle className="text-2xl" data-testid="title">
					Título
				</CardTitle>,
			);
			expect(screen.getByTestId("title")).toHaveClass("text-2xl");
		});

		it("encaminha a ref corretamente", () => {
			const ref = { current: null as HTMLDivElement | null };
			render(<CardTitle ref={ref}>Título</CardTitle>);
			expect(ref.current).toBeInstanceOf(HTMLDivElement);
		});
	});

	describe("CardDescription", () => {
		it("renderiza a descrição corretamente", () => {
			render(<CardDescription>Descrição do card</CardDescription>);
			expect(screen.getByText("Descrição do card")).toBeInTheDocument();
		});

		it("aplica as classes padrão", () => {
			render(
				<CardDescription data-testid="description">Descrição</CardDescription>,
			);
			const description = screen.getByTestId("description");
			expect(description).toHaveClass("text-sm", "text-muted-foreground");
		});

		it("aceita classes customizadas", () => {
			render(
				<CardDescription className="italic" data-testid="description">
					Descrição
				</CardDescription>,
			);
			expect(screen.getByTestId("description")).toHaveClass("italic");
		});

		it("encaminha a ref corretamente", () => {
			const ref = { current: null as HTMLDivElement | null };
			render(<CardDescription ref={ref}>Descrição</CardDescription>);
			expect(ref.current).toBeInstanceOf(HTMLDivElement);
		});
	});

	describe("CardContent", () => {
		it("renderiza o conteúdo corretamente", () => {
			render(<CardContent>Conteúdo</CardContent>);
			expect(screen.getByText("Conteúdo")).toBeInTheDocument();
		});

		it("aplica as classes padrão", () => {
			render(<CardContent data-testid="content">Conteúdo</CardContent>);
			const content = screen.getByTestId("content");
			expect(content).toHaveClass("p-6", "pt-0");
		});

		it("aceita classes customizadas", () => {
			render(
				<CardContent className="bg-gray-100" data-testid="content">
					Conteúdo
				</CardContent>,
			);
			expect(screen.getByTestId("content")).toHaveClass("bg-gray-100");
		});

		it("encaminha a ref corretamente", () => {
			const ref = { current: null as HTMLDivElement | null };
			render(<CardContent ref={ref}>Conteúdo</CardContent>);
			expect(ref.current).toBeInstanceOf(HTMLDivElement);
		});
	});

	describe("CardFooter", () => {
		it("renderiza o footer corretamente", () => {
			render(<CardFooter>Footer</CardFooter>);
			expect(screen.getByText("Footer")).toBeInTheDocument();
		});

		it("aplica as classes padrão", () => {
			render(<CardFooter data-testid="footer">Footer</CardFooter>);
			const footer = screen.getByTestId("footer");
			expect(footer).toHaveClass("flex", "items-center", "p-6", "pt-0");
		});

		it("aceita classes customizadas", () => {
			render(
				<CardFooter className="justify-end" data-testid="footer">
					Footer
				</CardFooter>,
			);
			expect(screen.getByTestId("footer")).toHaveClass("justify-end");
		});

		it("encaminha a ref corretamente", () => {
			const ref = { current: null as HTMLDivElement | null };
			render(<CardFooter ref={ref}>Footer</CardFooter>);
			expect(ref.current).toBeInstanceOf(HTMLDivElement);
		});
	});

	describe("Card - Composição completa", () => {
		it("renderiza um card completo com todos os componentes", () => {
			render(
				<Card>
					<CardHeader>
						<CardTitle>Título do Card</CardTitle>
						<CardDescription>Descrição do card</CardDescription>
					</CardHeader>
					<CardContent>
						<p>Conteúdo principal do card</p>
					</CardContent>
					<CardFooter>
						<button type="button">Ação</button>
					</CardFooter>
				</Card>,
			);

			expect(screen.getByText("Título do Card")).toBeInTheDocument();
			expect(screen.getByText("Descrição do card")).toBeInTheDocument();
			expect(
				screen.getByText("Conteúdo principal do card"),
			).toBeInTheDocument();
			expect(screen.getByRole("button", { name: "Ação" })).toBeInTheDocument();
		});
	});
});
