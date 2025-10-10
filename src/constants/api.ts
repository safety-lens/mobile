export const IS_STAGING = process.env.EXPO_PUBLIC_APP_ENV === 'staging';
export const IS_PRODUCTION = process.env.EXPO_PUBLIC_APP_ENV === 'production';

export const API_URL = IS_PRODUCTION
  ? 'https://api.safetylens.ai/'
  : 'https://api-staging.safetylens.ai/';
export const SUBSCRIPTION_URL = IS_PRODUCTION
  ? 'https://safetylens.ai/subscription'
  : 'https://staging.safetylens.ai/subscription';
