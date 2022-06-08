export interface ICheckResult {
  isMalicious: boolean;
  isMaliciousReason: string[];
  detectedProviders: string[];
  url: string;
}
