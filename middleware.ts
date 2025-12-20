// importar o tipo de request
import type { NextRequest } from "next/server";
// importar a resposta do Next
import { NextResponse } from "next/server";
// importar função que verifica o token jwt
import { verifyToken } from "./lib/jwt";

// estrutura igual a uma rota api comum, sendo uma função que recebe a request e retorna uma next response
export function middleware(request: NextRequest) {
	// primeiro é preciso pegar o token dos cookies
	const token = request.cookies.get("token");

	// verificar se o token tem conteúdo e se esse conteúdo tem formato válido de token, retorna um boolean
	// a função verifyToken retorna um JWTPayload ou null
	const isAuthenticated = token ? verifyToken(token.value) !== null : false;

	// variável que busca a url que o usuário está tentando acessar
	const { pathname } = request.nextUrl;

	//variável que define todas as rotas públicas
	const publicRoutes = ["/", "/login", "/register"];

	// verifica se a url atual é ou não uma rota pública
	const isPublicRoute = publicRoutes.includes(pathname);

	// verifica se a rota atual é da api ou não
	const isApiRoute = pathname.startsWith("/api/");

	// if para tratar casos em que o usuário não está autenticado e a rota não é pública
	if (!isAuthenticated && !isPublicRoute) {
		// se a rota for para a API retorna a resposta de não autorizado
		if (isApiRoute) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}
		// se a rota for para o front redireciona para a página pública de login
		else {
			return NextResponse.redirect(new URL("/login", request.url));
		}
	}

	// if para redirecinar o usuário para dashboard caso ele esteja autenticado e tente acessar as rotas de login ou register/signin
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
