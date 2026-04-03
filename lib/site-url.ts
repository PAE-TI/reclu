export function getAppBaseUrl(): string {
  const candidateUrls = [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.NEXTAUTH_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
    'http://localhost:3000',
  ];

  const url = candidateUrls.find((value): value is string => Boolean(value)) || 'http://localhost:3000';
  return url.replace(/\/+$/, '');
}

export function buildAppUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${getAppBaseUrl()}${normalizedPath}`;
}
