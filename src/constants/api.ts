const IS_PRODUCTION = process.env.APP_ENV === 'production';

export const API_URL = IS_PRODUCTION
  ? 'https://api.safetylens.ai/'
  : 'https://api-staging.safetylens.ai/';
