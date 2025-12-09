import jwt from "jsonwebtoken";

// Tipo do payload que vai dentro do JWT
type JWTPayload = {
	userId: number;
	email: string;
};

// Pega o secret do .env (com fallback para evitar erro)
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-me";

/**
 * Gera um token JWT
 * @param payload - Dados do usuário para incluir no token
 * @param expiresIn - Tempo de expiração (padrão: 7 dias)
 * @returns Token JWT assinado
 */
export function generateToken(payload: JWTPayload): string {
	return jwt.sign(payload, JWT_SECRET, {
		expiresIn: "1d",
	});
}

/**
 * Verifica e decodifica um token JWT
 * @param token - Token JWT para verificar
 * @returns Payload decodificado ou null se inválido
 */
export function verifyToken(token: string): JWTPayload | null {
	try {
		const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
		return decoded;
	} catch (error) {
		console.error(error);
		return null;
	}
}
