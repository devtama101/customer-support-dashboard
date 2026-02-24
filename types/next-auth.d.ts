import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      agentId: string;
      teamId: string;
      role: string;
    } & DefaultSession['user'];
  }

  interface User {
    agentId?: string;
    teamId?: string;
    role?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    agentId?: string;
    teamId?: string;
    role?: string;
  }
}
