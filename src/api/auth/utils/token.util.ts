export function getBearerToken(req: any): string | null {
  const authorizationHeader = req.headers['authorization'];

  if (authorizationHeader && typeof authorizationHeader === 'string') {
    const tokenParts = authorizationHeader.split(' ');

    if (tokenParts.length === 2 /* && tokenParts[0].toLowerCase() === 'bearer' */) return tokenParts[1];
  }

  return null;
}
