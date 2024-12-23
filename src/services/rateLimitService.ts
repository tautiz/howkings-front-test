interface RateLimitConfig {
  maxAttempts: number;
  timeWindow: number; // milliseconds
}

interface RateLimitState {
  attempts: number;
  firstAttempt: number;
}

class RateLimitService {
  private limits: Map<string, RateLimitState>;
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.limits = new Map();
    this.config = config;
  }

  canAttempt(key: string): boolean {
    const now = Date.now();
    const state = this.limits.get(key);

    if (!state) {
      this.limits.set(key, { attempts: 1, firstAttempt: now });
      return true;
    }

    // Jei praėjo daugiau laiko nei timeWindow, atnaujiname limitą
    if (now - state.firstAttempt > this.config.timeWindow) {
      this.limits.set(key, { attempts: 1, firstAttempt: now });
      return true;
    }

    // Jei dar neviršijome bandymų limito
    if (state.attempts < this.config.maxAttempts) {
      this.limits.set(key, {
        ...state,
        attempts: state.attempts + 1
      });
      return true;
    }

    return false;
  }

  getRemainingTime(key: string): number {
    const state = this.limits.get(key);
    if (!state) return 0;

    const now = Date.now();
    const timeElapsed = now - state.firstAttempt;
    return Math.max(0, this.config.timeWindow - timeElapsed);
  }

  getRemainingAttempts(key: string): number {
    const state = this.limits.get(key);
    if (!state) return this.config.maxAttempts;

    const now = Date.now();
    if (now - state.firstAttempt > this.config.timeWindow) {
      return this.config.maxAttempts;
    }

    return Math.max(0, this.config.maxAttempts - state.attempts);
  }

  reset(key: string): void {
    this.limits.delete(key);
  }
}

// Sukuriame rate limiting servisą registracijai
export const registrationRateLimit = new RateLimitService({
  maxAttempts: 5, // 5 bandymai
  timeWindow: 15 * 60 * 1000 // 15 minučių
});

// Sukuriame rate limiting servisą prisijungimui
export const loginRateLimit = new RateLimitService({
  maxAttempts: 3, // 3 bandymai
  timeWindow: 5 * 60 * 1000 // 5 minutės
});
