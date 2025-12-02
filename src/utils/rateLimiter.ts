const RATE_LIMIT_KEY = 'login_attempts';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

interface LoginAttemptData {
  attempts: number;
  firstAttemptAt: number;
  lockedUntil: number | null;
}

export function getLoginAttempts(): LoginAttemptData {
  const data = localStorage.getItem(RATE_LIMIT_KEY);
  if (!data) {
    return { attempts: 0, firstAttemptAt: 0, lockedUntil: null };
  }
  return JSON.parse(data);
}

export function isRateLimited(): { limited: boolean; remainingTime: number } {
  const data = getLoginAttempts();
  const now = Date.now();

  if (data.lockedUntil && now < data.lockedUntil) {
    return { 
      limited: true, 
      remainingTime: Math.ceil((data.lockedUntil - now) / 1000 / 60) 
    };
  }

  // Reset if lockout expired
  if (data.lockedUntil && now >= data.lockedUntil) {
    clearLoginAttempts();
    return { limited: false, remainingTime: 0 };
  }

  return { limited: false, remainingTime: 0 };
}

export function recordLoginAttempt(success: boolean): void {
  if (success) {
    clearLoginAttempts();
    return;
  }

  const data = getLoginAttempts();
  const now = Date.now();

  // Reset if first attempt was more than 15 minutes ago
  if (data.firstAttemptAt && now - data.firstAttemptAt > LOCKOUT_DURATION_MS) {
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({
      attempts: 1,
      firstAttemptAt: now,
      lockedUntil: null
    }));
    return;
  }

  const newAttempts = data.attempts + 1;
  const newData: LoginAttemptData = {
    attempts: newAttempts,
    firstAttemptAt: data.firstAttemptAt || now,
    lockedUntil: newAttempts >= MAX_ATTEMPTS ? now + LOCKOUT_DURATION_MS : null
  };

  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(newData));
}

export function getRemainingAttempts(): number {
  const data = getLoginAttempts();
  return Math.max(0, MAX_ATTEMPTS - data.attempts);
}

export function clearLoginAttempts(): void {
  localStorage.removeItem(RATE_LIMIT_KEY);
}
