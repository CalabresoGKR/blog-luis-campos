import type { NextAuthConfig } from "next-auth";

// Configuração "leve" e compatível com o edge runtime (sem Prisma/bcrypt).
// É usada pelo middleware para proteger rotas.
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    // Protege tudo o que esteja sob /admin
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      if (isOnAdmin) return isLoggedIn;
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as (typeof session.user)["role"];
      }
      return session;
    },
  },
  providers: [], // preenchidos em auth.ts (lado Node)
} satisfies NextAuthConfig;
