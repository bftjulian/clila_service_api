import { GoogleSafeBrowsingProvider } from './implementations/google-safe-browsing.provider';
import { MaliciousContentCheckProvider } from './implementations/malicious-content-check.provider';

export const maliciousContentCheckProviders = [
  GoogleSafeBrowsingProvider,
  MaliciousContentCheckProvider,
];
