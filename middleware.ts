import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// O middleware corre em todas as rotas /admin e bloqueia o acesso
// não autenticado antes mesmo de a página renderizar.
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/admin/:path*"],
};
