# 3. reCAPTCHA v3 Implementacija Registracijos Formoje

Data: 2024-12-21

## Statusas

Suspended 🔒

### Suspendavimo Priežastys:

1. **Techninės Problemos**
   - Neveikia su dabartiniu domain'u
   - Klaida: "ERROR for site owner: Invalid key type"
   - Reikalinga papildoma konfigūracija serveriuose

2. **Alternatyvūs Sprendimai**
   - Laikinai naudosime rate limiting
   - CSRF apsauga jau implementuota
   - IP blokavimas per Laravel middleware

### Atnaujinimo Planas

1. Sukonfigūruoti production domenus
2. Gauti naujus reCAPTCHA raktus
3. Atlikti testavimą staging aplinkoje
4. Aktyvuoti production aplinkoje

## Kontekstas

Reikia apsaugoti registracijos formą nuo automatizuotų atakų (botų) ir sukčiavimo. reCAPTCHA v3 pasirinkta dėl:

- Nereikia vartotojo interakcijos (nėra "checkbox" ar paveiksliukų)
- Teikia rizikos įvertinimą (score nuo 0.0 iki 1.0)
- Veikia fone ir netrukdo UX
- Galima pritaikyti skirtingus saugumo lygius skirtingoms operacijoms

## Sprendimas

### 1. Frontend Implementacija

```typescript
class ReCaptchaService {
  private static instance: ReCaptchaService;
  private grecaptcha: any;
  
  private constructor() {
    this.loadReCaptcha();
  }

  private async loadReCaptcha(): Promise<void> {
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    document.head.appendChild(script);
    
    return new Promise((resolve) => {
      script.onload = () => {
        this.grecaptcha = (window as any).grecaptcha;
        resolve();
      };
    });
  }

  public async executeAction(action: string): Promise<string> {
    try {
      return await this.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action });
    } catch (error) {
      console.error('reCAPTCHA execution failed:', error);
      throw error;
    }
  }
}
```

### 2. Backend Validacija

```php
class ReCaptchaValidator {
    private const MIN_SCORE = 0.5;
    private const ACTION_WEIGHTS = [
        'register' => 0.7,
        'login' => 0.5,
        'password_reset' => 0.6
    ];

    public function validate(string $token, string $action): ValidationResult {
        $response = Http::post('https://www.google.com/recaptcha/api/siteverify', [
            'secret' => config('services.recaptcha.secret'),
            'response' => $token
        ]);

        $result = $response->json();
        
        return new ValidationResult(
            success: $this->evaluateScore($result['score'], $action),
            score: $result['score'],
            action: $result['action'],
            hostname: $result['hostname']
        );
    }

    private function evaluateScore(float $score, string $action): bool {
        $requiredScore = self::ACTION_WEIGHTS[$action] ?? self::MIN_SCORE;
        return $score >= $requiredScore;
    }
}
```

### 3. Saugumo Lygiai

Skirtingi saugumo lygiai (scores) skirtingoms operacijoms:

- Registracija: 0.7 (aukštas saugumas)
- Prisijungimas: 0.5 (vidutinis saugumas)
- Slaptažodžio atkūrimas: 0.6 (padidintas saugumas)

### 4. Klaidų Valdymas

```typescript
interface ReCaptchaError {
  code: string;
  message: string;
  action?: string;
  score?: number;
}

class ReCaptchaErrorHandler {
  public static handle(error: ReCaptchaError): UserMessage {
    switch (error.code) {
      case 'SCORE_TOO_LOW':
        return {
          type: 'warning',
          message: 'Jūsų veiksmai atrodo įtartini. Bandykite vėliau.',
          action: 'retry'
        };
      case 'INVALID_TOKEN':
        return {
          type: 'error',
          message: 'Nepavyko patvirtinti tapatybės. Perkraukite puslapį.',
          action: 'reload'
        };
      default:
        return {
          type: 'error',
          message: 'Įvyko klaida. Bandykite vėliau.',
          action: 'retry'
        };
    }
  }
}
```

### 5. Monitoringas ir Analizė

```typescript
interface ReCaptchaMetrics {
  action: string;
  score: number;
  timestamp: Date;
  success: boolean;
  clientIp: string;
  userAgent: string;
}

class ReCaptchaAnalytics {
  public static track(metrics: ReCaptchaMetrics): void {
    analyticsService.track('recaptcha_verification', {
      ...metrics,
      environment: process.env.NODE_ENV
    });
  }

  public static async generateReport(): Promise<ReCaptchaReport> {
    // Generuojame ataskaitas apie:
    // - Vidutinį score pagal veiksmus
    // - Įtartinus IP adresus
    // - Atmestų veiksmų statistiką
  }
}
```

## Pasekmės

### Teigiamos

1. **Saugumas**
   - Automatinė apsauga nuo botų
   - Rizikos įvertinimas realiu laiku
   - Skirtingi saugumo lygiai skirtingoms operacijoms

2. **UX**
   - Nereikia vartotojo interakcijos
   - Greitas veikimas fone
   - Aiškūs klaidų pranešimai

3. **Monitoringas**
   - Detalūs metrikų duomenys
   - Galimybė analizuoti įtartinus veiksmus
   - Automatinės ataskaitos

### Neigiamos

1. **Priklausomybė**
   - Priklausomybė nuo Google serviso
   - Galimi false positives
   - Reikalingas interneto ryšys

2. **Privatumas**
   - Google renka duomenis apie vartotojus
   - Reikalingas privatumo politikos atnaujinimas

3. **Techninės**
   - Papildomas tinklo užklausų skaičius
   - Galimos problemos su kai kuriais proxy/VPN

## Alternatyvos

1. **reCAPTCHA v2**
   - ✅ Paprastesnė implementacija
   - ❌ Reikalauja vartotojo interakcijos
   - ❌ Blogesnė UX

2. **hCaptcha**
   - ✅ Geresnis privatumas
   - ✅ Nemokamas
   - ❌ Mažesnė bendruomenė

3. **Custom Rate Limiting**
   - ✅ Pilna kontrolė
   - ✅ Nėra išorinių priklausomybių
   - ❌ Reikia daug resursų palaikymui

## Testavimas

1. **Unit Testai**

  ```typescript
  describe('ReCaptchaService', () => {
    it('should validate token successfully', async () => {
      const token = await reCaptchaService.executeAction('register');
      const result = await validateToken(token);
      expect(result.success).toBe(true);
      expect(result.score).toBeGreaterThanOrEqual(0.7);
    });
  });
  ```

2. **Integration Testai**

  ```typescript
  describe('Registration Flow', () => {
    it('should handle low score gracefully', async () => {
      // Simuliuojame žemą score
      mockReCaptchaScore(0.3);
      
      const result = await registerUser(validUserData);
      expect(result.error).toBe('SCORE_TOO_LOW');
    });
  });
  ```

3. **E2E Testai**

  ```typescript
  describe('Registration E2E', () => {
    it('should complete registration with reCAPTCHA', async () => {
      await page.fill('[name="email"]', 'test@example.com');
      // ... kiti formos laukai
      
      const token = await page.evaluate(() => {
        return window.grecaptcha.execute('site_key', { action: 'register' });
      });
      
      expect(token).toBeTruthy();
    });
  });
  ```

## Papildoma Informacija

- [Google reCAPTCHA v3 Documentation](https://developers.google.com/recaptcha/docs/v3)
- [Security Best Practices](https://cloud.google.com/recaptcha-enterprise/docs/best-practices)
- [Privacy Considerations](https://policies.google.com/privacy)
