const ALWAYS_REQUIRED = [
  'DATABASE_URL',
  'FEDAPAY_API_URL',
  'ADMIN_API_KEY',
  'FEDAPAY_API_KEY_TEST',
  'JWT_SECRET',
] as const;

export function validateEnv(config: Record<string, unknown>): Record<string, unknown> {
  const isProduction = config['NODE_ENV'] === 'production';

  const required: string[] = [...ALWAYS_REQUIRED];
  if (isProduction) required.push('FEDAPAY_API_KEY_LIVE');

  const missing = required.filter((key) => !config[key]);

  if (missing.length > 0) {
    throw new Error(
      `\n\nVariables d'environnement manquantes :\n${missing.map((k) => `  • ${k}`).join('\n')}\n\nVérifiez votre fichier .env avant de démarrer l'application.\n`,
    );
  }

  if (isProduction) {
    const liveKey = config['FEDAPAY_API_KEY_LIVE'] as string;
    if (liveKey.startsWith('sk_test_')) {
      throw new Error(
        '\n\nErreur de configuration : FEDAPAY_API_KEY_LIVE contient une clé de test (sk_test_...).\nUtilisez une clé de production (sk_live_...) en NODE_ENV=production.\n',
      );
    }
  }

  return config;
}
