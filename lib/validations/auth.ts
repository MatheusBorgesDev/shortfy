import { z } from "zod";

const emailSchema = z
	.string()
	.trim()
	.nonempty("Email é obrigatório")
	.email("Email inválido");

const passwordSchema = z
	.string()
	.nonempty("Senha é obrigatória")
	.min(6, "Senha deve ter no mínimo 6 caracteres");

const userNameSchema = z
	.string()
	.nonempty("Nome é obrigatório")
	.min(3, "Nome deve ter no mínimo 3 caracteres");

export const loginSchema = z.object({
	email: emailSchema,
	password: passwordSchema,
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
	userName: userNameSchema,
	email: emailSchema,
	password: passwordSchema,
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const createUrlSchema = z.object({
	originalUrl: z
		.string()
		.min(1, "URL é obrigatória")
		.url("URL inválida")
		.refine(
			(url) => url.startsWith("http://") || url.startsWith("https://"),
			"URL deve começar com http:// ou https://",
		),
});

export type CreateUrlData = z.infer<typeof createUrlSchema>;
