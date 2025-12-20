// importar o tipo de request
import type { NextRequest } from "next/server";
// importar a resposta do Next
import { NextResponse } from "next/server";
// importar função que verifica o token jwt
import { verifyToken } from "./lib/jwt";

// variável que define o prefixo das rotas públicas da API, para fazer a verificação de forma dinâmica
const PUBLIC_API_ROUTES_PREFIX = ["/api/auth/login", "/api/auth/register"];

// variável que define o prefixo das rotas protegidas, para fazer a verificação de forma dinâmica
const PROTECTED_ROUTES_PREFIX = ["/dashboard", "/urls"];

// função que recebe a rota atual e os prefixos de rotas que servirão para fazer a verificação
// se a rota atual começar com qualquer um dos prefixos escolhidos retorna true, senão false
// a função .some do js serve para percorrer o array de prefixos e retornar true se pelo menos um prefixo for igual ao pathname
function matchesPattern(pathname: string, routesPrefix: string[]): boolean {
	return routesPrefix.some((routesPrefix) => pathname.startsWith(routesPrefix));
}

// estrutura igual a uma rota api comum, sendo uma função que recebe a request e retorna uma next response
export function middleware(request: NextRequest) {
	// primeiro é preciso pegar o token dos cookies
	const token = request.cookies.get("token");

	// verificar se o token tem conteúdo e se esse conteúdo tem formato válido de token, retorna um boolean
	// a função verifyToken retorna um JWTPayload ou null
	const isAuthenticated = token ? verifyToken(token.value) !== null : false;

	// variável que busca a url que o usuário está tentando acessar
	const { pathname } = request.nextUrl;

	// verificação das rotas frontend
	const isProtectedRoute = matchesPattern(pathname, PROTECTED_ROUTES_PREFIX);

	// verificação das rotas API
	const isApiRoute = pathname.startsWith("/api/");
	const isPublicApi = matchesPattern(pathname, PUBLIC_API_ROUTES_PREFIX);

	// CASOS A VERIFICAR
	// 1 - usuário tenta acessar rota protegida mas não está autenticado
	if (isProtectedRoute && !isAuthenticated) {
		// redireciona para login
		// usamos new URL com a rota que direcionamos e com a rota da request para formar concatenar/normalizar a url devolvida
		return NextResponse.redirect(new URL("/login", request.url));
	}

	// 2 - usuário tenta acessar rota protegida da api mas não está autenticado
	if (isApiRoute && !isPublicApi && !isAuthenticated) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	// 3 - usuário tenta acessar rota pública mas está autenticado
	if (isAuthenticated && (pathname === "/login" || pathname === "/register")) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	// se não cair em um dos casos acima, deixar passar a requisição para o servidor/api
	return NextResponse.next();
}

// essa função é muito importante para desempenho, pois serve para designar todas as rotas que o middleware vai interceptar
// nesse caso não vai ter influência em arquivos estáticos, como CSS, JS e imagens
export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
