# Howkings Frontend Development Guide 🚀

## Projekto struktūra 📁

```
howkings-front-test/
├── src/
│   ├── components/     # UI komponentai
│   ├── contexts/       # React kontekstai
│   ├── services/       # Servisų logika
│   ├── tests/         # Testai
│   └── types/         # TypeScript tipai
```

## Technologijos 🛠

- React + TypeScript
- Vite (Build tool)
- React Router (Navigacija)
- Axios (HTTP užklausos)
- React-Toastify (Pranešimai)

## Pradžia 🏁

1. Įsidiegimas:

```bash
npm install
```

2. Development serverio paleidimas:

```bash
npm run dev
```

3. Testų paleidimas:

```bash
npm run test
```

4. Build'inimas:

```bash
npm run build
```

## Architektūriniai principai 🏗

### 1. Komponentų struktūra

- Naudojame funkcinio programavimo principus
- Komponentai turi būti maži ir atsakingi už vieną funkcionalumą (SRP)
- Props tipai aprašomi naudojant interfaces

```typescript
interface ButtonProps {
  onClick: () => void;
  children: ReactNode;
  variant?: 'primary' | 'secondary';
}

const Button: FC<ButtonProps> = ({ onClick, children, variant = 'primary' }) => {
  // ...
};
```

### 2. State Management

- Naudojame React Context API globaliam state
- Lokaliam state naudojame useState ir useReducer hooks
- Sudėtingesnei būsenai naudojame custom hooks

### 3. Autentifikacija 🔐

- Token'ai saugomi localStorage
- Automatinis token'o validavimas
- Saugumo priemonės:
  - XSS apsauga
  - CSRF apsauga
  - Token refresh mechanizmas

```typescript
// Pavyzdys kaip naudoti auth kontekstą
const { user, login, logout } = useAuth();
```

### 4. API Užklausos 🌐

- Naudojame axios instance su interceptors
- Centralizuotas klaidų valdymas
- Automatinis token'ų pridėjimas

```typescript
// API užklausos pavyzdys
const response = await api.get<ApiResponse>('/endpoint');
```

## Testavimas 🧪

### 1. Unit Testai

- Jest + React Testing Library
- Komponentų testai
- Servisų testai
- Utils funkcijų testai

```typescript
describe('Component', () => {
  it('should render correctly', () => {
    render(<Component />);
    expect(screen.getByText('Text')).toBeInTheDocument();
  });
});
```

### 2. Integraciniai Testai

- API integracijų testai
- End-to-end flow testai
- Auth flow testai

## Code Style Guide 📝

### 1. Naming Conventions

- camelCase kintamiesiems ir funkcijoms
- PascalCase komponentams ir interface'ams
- UPPER_CASE konstantoms

### 2. Failų struktūra

```typescript
// 1. Importai
import { useState } from 'react';

// 2. Tipai/Interface'ai
interface Props {
  // ...
}

// 3. Komponento/Funkcijos aprašymas
export const Component = () => {
  // ...
};
```

### 3. Error Handling

```typescript
try {
  await api.post('/endpoint');
} catch (error) {
  if (error instanceof ApiError) {
    handleApiError(error);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Best Practices 💡

1. **DRY (Don't Repeat Yourself)**

   - Iškelkite pasikartojančią logiką į utils/hooks
2. **SOLID Principai**

   - Single Responsibility
   - Open/Closed
   - Liskov Substitution
   - Interface Segregation
   - Dependency Inversion
3. **Performance**

   - Naudokite React.memo() kai reikia
   - Optimizuokite re-renderinimus
   - Lazy loading komponentams
4. **Saugumas**

   - Sanitizuokite input'us
   - Naudokite HTTPS
   - Saugokite sensityvius duomenis

## Git Workflow 🌿

1. **Branch'ų konvencijos**

   - `feature/feature-name`
   - `bugfix/bug-description`
   - `hotfix/critical-fix`
2. **Commit'ų žinutės**

   ```
   feat: add login functionality
   fix: resolve token validation loop
   docs: update development guide
   ```

## Deployment 🚀

1. **Staging**

   - Automatinis deployment į staging aplinką
   - Smoke testai
2. **Production**

   - Manual approval
   - Canary releases

## Troubleshooting 🔧

### Dažniausios problemos:

1. **401 klaidos**

   - Patikrinkite token'o galiojimą
   - Išvalykite localStorage
   - Perkraukite puslapį
2. **Infinite loops**

   - Patikrinkite useEffect dependencies
   - Peržiūrėkite state update logiką

## Kontaktai 📞

- Tech Lead: [tautvydas@howkings.com](mailto:tautvydas@howkings.com)
- DevOps: [tautvydas@howkings.com](mailto:tautvydas@howkings.com "Tautvydas Dulskis")

## Licencija 📄

Copyright © 2024 Howkings
