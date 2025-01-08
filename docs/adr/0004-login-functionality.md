# 0004 - Prisijungimo Funkcionalumo Implementacija 🔐

## Statusas

Accepted ✅

## Data

2025-01-08

## Kontekstas 🌍

Sistemoje reikalingas patogus ir saugus vartotojų prisijungimo mechanizmas, kuris integruojasi su esama registracijos sistema (žr. [0002-user-registration.md](./0002-user-registration.md)) ir palaiko daugiakalbiskumą.

### Esama situacija

- Sistemoje jau implementuota registracijos sistema su saugumo mechanizmais
- Veikia `AuthContext` autentifikacijos logika
- Įdiegtas i18n su lietuvių ir anglų kalbomis
- Navigacijos juostoje yra mygtukai prisijungimui/registracijai

### Apribojimai

- Turi veikti tiek desktop, tiek mobile įrenginiuose
- Turi būti suderinama su esama autentifikacijos sistema
- Turi atitikti SOLID ir DRY principus
- Turi naudoti tas pačias saugumo priemones kaip registracijos sistema
- Turi palaikyti visas sistemoje naudojamas kalbas

## Sprendimas 💡

### Architektūriniai sprendimai

1. Naudojame React Hooks pattern'ą loginimosi logikai:
   - `useNavbarLogic` hook'as valdo navigacijos būsenas
   - `useAuth` hook'as integruojasi su esama autentifikacijos sistema
   - `useTranslation` hook'as kalbų palaikymui

2. UI/UX sprendimai:
   - Minimalistinė prisijungimo forma modal'iniame lange
   - "Pamiršau slaptažodį" funkcionalumas
   - Galimybė pereiti į registraciją iš prisijungimo formos
   - Prisiminti prisijungimo duomenis (remember me)
   - Automatinis kalbos nustatymas pagal naršyklės kalbą

### Prisijungimo forma ir vertimai

```typescript
// Vertimų struktūra (locales/lt.ts ir locales/en.ts)
interface LoginTranslations {
  form: {
    email: string;
    password: string;
    rememberMe: string;
    forgotPassword: string;
    login: string;
    noAccount: string;
    register: string;
  };
  errors: {
    invalidEmail: string;
    invalidPassword: string;
    loginFailed: string;
  };
}

// Formos komponentas su vertimais
const LoginForm = () => {
  const { t } = useTranslation();
  // ... kita logika
  return (
    <form>
      <input placeholder={t('form.email')} />
      {/* ... kiti elementai */}
    </form>
  );
};
```

### Integracija su autentifikacija ir kalbomis

- Naudojame tą patį `AuthContext` kaip ir registracijoje
- Bendri saugumo mechanizmai (aprašyti [0002-user-registration.md](./0002-user-registration.md))
- Vieninga JWT tokenų valdymo strategija
- Kalbos nustatymai išsaugomi `localStorage`
- Automatinis kalbos nustatymas pagal vartotojo šalį

## Pasekmės 🎯

### Teigiamos

- 🎯 Vieninga autentifikacijos patirtis
- 🔄 Pakartotinio panaudojimo privalumai
- 🧪 Lengvai testuojama architektūra
- 📱 Pilnas mobile įrenginių palaikymas
- 🌍 Pilnas daugiakalbiskumo palaikymas
- 🔄 Automatinis kalbos parinkimas

### Neigiamos

- Priklausomybė nuo registracijos sistemos veikimo
- Modal'inis langas gali būti nepatogus mobile įrenginiuose
- Papildomas sudėtingumas dėl vertimų palaikymo

## Testavimo strategija 🧪

1. Unit testai:
   - `useNavbarLogic` hook'o testai
   - Prisijungimo formos validacijos testai
   - Vertimų pilnumo testai

2. Integraciniai testai:
   - Sąveika su `AuthContext`
   - Prisijungimo/atsijungimo flow
   - Kalbų keitimo testavimas

3. E2E testai:
   - Pilnas prisijungimo scenarijus
   - "Pamiršau slaptažodį" funkcionalumas
   - Mobile/Desktop compatibility
   - Kalbų keitimo scenarijai

## Alternatyvos ⚖️

1. **Atskiras prisijungimo puslapis**
   - Atmesta dėl prastesnio UX
   - Nereikalinga papildoma navigacija

2. **Inline forma navigacijos juostoje**
   - Atmesta dėl vietos apribojimų
   - Nepatogu mobile įrenginiuose

## Stebėjimas ir metrika 📊

- Prisijungimo bandymų sėkmės/nesėkmės statistika pagal kalbas
- Modal'inio lango naudojimo metrikos
- "Pamiršau slaptažodį" funkcionalumo naudojimo dažnis
- Kalbų keitimo statistika prisijungimo metu
