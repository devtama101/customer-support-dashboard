import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { compare, hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findFirst({
          where: { email: credentials.email as string },
          include: { agents: true },
        });

        if (!user) {
          return null;
        }

        const passwordMatch = await compare(
          credentials.password as string,
          user.password || ''
        );

        if (!passwordMatch || !user.password) {
          return null;
        }

        // Get the first agent association (for MVP, single team)
        const agent = user.agents[0];

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          // Custom fields for session
          agentId: agent?.id,
          teamId: agent?.teamId,
          role: agent?.role || 'AGENT',
        };
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      async profile(profile) {
        // Check if user exists, if not create them
        let user = await prisma.user.findUnique({
          where: { email: profile.email },
          include: { agents: true },
        });

        if (!user) {
          // For OAuth, we need to handle first-time setup
          // Create user but they'll need to be assigned to a team
          user = await prisma.user.create({
            data: {
              email: profile.email,
              name: profile.name,
              image: profile.picture,
            },
            include: { agents: true },
          });
        }

        const agent = user.agents[0];

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          agentId: agent?.id,
          teamId: agent?.teamId,
          role: agent?.role || 'AGENT',
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add custom fields to token on sign in
      if (user) {
        token.agentId = user.agentId;
        token.teamId = user.teamId;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Add custom fields to session
      if (session.user) {
        session.user.id = token.sub!;
        session.user.agentId = token.agentId as string;
        session.user.teamId = token.teamId as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
});

/**
 * Hash a password
 */
export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 12);
}

/**
 * Verify a password
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await compare(password, hashedPassword);
}
