
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './db';
import {
  SYSTEM_SETTING_DEFAULTS,
  getNumberSetting,
  getSystemSettingsMap,
} from './system-settings';

const isProduction = process.env.NODE_ENV === 'production';

export const authOptions: NextAuthOptions = {
  useSecureCookies: isProduction,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const email = credentials.email.trim().toLowerCase();
          const settings = await getSystemSettingsMap([
            'loginMaxAttempts',
            'loginLockoutMinutes',
          ]);
          const loginMaxAttempts = getNumberSetting(
            settings,
            'loginMaxAttempts',
            parseInt(SYSTEM_SETTING_DEFAULTS.loginMaxAttempts, 10),
            1,
            20
          );
          const loginLockoutMinutes = getNumberSetting(
            settings,
            'loginLockoutMinutes',
            parseInt(SYSTEM_SETTING_DEFAULTS.loginLockoutMinutes, 10),
            1,
            1440
          );
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.password) {
            return null;
          }

          if (user.lockedUntil) {
            if (user.lockedUntil > new Date()) {
              throw new Error('ACCOUNT_LOCKED');
            }

            await prisma.user.update({
              where: { id: user.id },
              data: {
                failedLoginAttempts: 0,
                lockedUntil: null,
              },
            });
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            const nextFailedAttempts = user.failedLoginAttempts + 1;
            const shouldLock = nextFailedAttempts >= loginMaxAttempts;

            await prisma.user.update({
              where: { id: user.id },
              data: {
                failedLoginAttempts: shouldLock ? loginMaxAttempts : nextFailedAttempts,
                lockedUntil: shouldLock
                  ? new Date(Date.now() + loginLockoutMinutes * 60 * 1000)
                  : user.lockedUntil,
              },
            });

            if (shouldLock) {
              throw new Error('ACCOUNT_LOCKED');
            }
            return null;
          }

          if (user.failedLoginAttempts > 0 || user.lockedUntil) {
            await prisma.user.update({
              where: { id: user.id },
              data: {
                failedLoginAttempts: 0,
                lockedUntil: null,
              },
            });
          }

          // Verificar si el usuario está activo DESPUÉS de validar credenciales
          if (!user.isActive) {
            throw new Error('INACTIVE_USER');
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name || `${user.firstName} ${user.lastName}`.trim(),
            firstName: user.firstName,
            lastName: user.lastName,
            company: user.company,
            jobTitle: user.jobTitle,
            role: user.role,
            language: user.language,
            ownerId: user.ownerId, // For facilitators
          };
        } catch (error) {
          // Re-throw INACTIVE_USER error para que el cliente lo maneje
          if (error instanceof Error && error.message === 'INACTIVE_USER') {
            throw error;
          }
          if (error instanceof Error && error.message === 'ACCOUNT_LOCKED') {
            throw error;
          }
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: isProduction ? `__Secure-next-auth.session-token` : `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: isProduction,
      },
    },
  },
  callbacks: {
    async jwt({ token, user, trigger, session: updateSession }) {
      // Login inicial
      if (user) {
        token.role = user.role;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.company = user.company;
        token.jobTitle = user.jobTitle;
        token.language = user.language;
        token.ownerId = (user as { ownerId?: string }).ownerId;
      }
      
      // Actualización de sesión desde el cliente (cuando se llama update())
      if (trigger === 'update' && updateSession?.user) {
        token.firstName = updateSession.user.firstName;
        token.lastName = updateSession.user.lastName;
        token.company = updateSession.user.company;
        token.jobTitle = updateSession.user.jobTitle;
        if (updateSession.user.name) {
          token.name = updateSession.user.name;
        }
        if (updateSession.user.language) {
          token.language = updateSession.user.language;
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as any;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.company = token.company as string;
        session.user.jobTitle = token.jobTitle as string;
        session.user.language = token.language as string;
        (session.user as { ownerId?: string }).ownerId = token.ownerId as string | undefined;
        if (token.name) {
          session.user.name = token.name as string;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
