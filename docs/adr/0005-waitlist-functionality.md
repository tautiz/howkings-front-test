# 1. Waitlist Funkcionalumo Įgyvendinimas

Data: 2025-01-08

## Statusas

Accepted ✅

## Kontekstas

Howkings University svetainei reikalingas Waitlist funkcionalumas, kuris leistų potencialiems studentams užsiregistruoti į laukiančiųjų sąrašą prieš oficialų platformos paleidimą. Šis sprendimas turi būti įgyvendintas iškart po HERO bloko.

## Sprendimas

### Feature Toggle

   Waitlist funkcionalumas bus valdomas per VITE aplinkos kintamąjį:

```env
   VITE_FEATURE_ENABLE_WAITLIST=true
```

### Daugiakalbystė

   Komponentas pilnai palaikys daugiakalbystę naudojant i18n sistemą. Vertimai bus saugomi:

```bash
   /src/locales/
   ├── en/
   │   └── waitlist.json
   └── lt/
         └── waitlist.json
```

### Frontend Architektūra

1. **Frontend Architektūra:**

   - React komponentas su Tailwind CSS stiliais
   - Lucide-react ikonos vizualiniam patrauklumui
   - Form validacija naudojant React Hook Form
   - Responsive dizainas visiem įrenginiams
2. **Duomenų Saugojimas:**

   - Email adresas bus šifruojamas prieš siunčiant į backend'ą
   - Implementuosime rate limiting apsaugai nuo spam'o
   - Duomenų bazėje saugosime: email, registracijos datą, unikalų nuolaidos kodą
3. **Saugumo Priemonės:**

   - CSRF apsauga
   - Email validacija
   - Honeypot laukai apsaugai nuo botų
   - Rate limiting pagal IP
4. **Vartotojo Patirtis:**

   - Realaus laiko form validacija
   - Loading būsenos indikacija
   - Aiškūs klaidų pranešimai
   - Sėkmės patvirtinimo pranešimas su nuolaidos kodu

## Pasekmės

### Teigiamos

- Ankstyvos registracijos galimybė
- Potencialių klientų duomenų bazės kūrimas
- Marketingo galimybės per nuolaidų sistemą
- Lengvas plečiamumas ateityje

### Neigiamos

- Papildomas serverio apkrovimas
- Duomenų saugojimo įsipareigojimai (GDPR)
- Papildoma infrastruktūros priežiūra

## Testavimas

1. **Unit Testai:**

   - Form validacijos
   - Email šifravimo
   - Komponentų rendering
   - Daugiakalbystės funkcionalumo testai
   - Feature Toggle testai
2. **Integration Testai:**

   - API endpoint'ų
   - Form submission flow
   - Error handling
3. **E2E Testai:**

   - Pilnas registracijos procesas
   - Mobile responsiveness
   - Cross-browser compatibility

## Metrikos

- Konversijos rodiklis (registracijų skaičius / apsilankymų skaičius)
- Vidutinis užpildymo laikas
- Klaidų skaičius
- Bounce rate po registracijos

## Alternatyvos

1. Paprastas "Contact Us" formos naudojimas
2. Trečiųjų šalių waitlist sprendimas (pvz., LaunchList)
3. Google Forms integracija

## Papildoma Informacija

### Feature Toggle implementacija

```typescript
   // src/config/features.ts
   export const FEATURES = {
   ENABLE_WAITLIST: import.meta.env.VITE_FEATURE_ENABLE_WAITLIST === 'true',
   } as const;

   // App.tsx naudojimas
   {FEATURES.ENABLE_WAITLIST && <Waitlist />}
```

### Daugiakalbystės pavyzdys

```json
   // src/locales/lt/waitlist.json
   {
   "title": "Prisijunk prie Howkings University laukiančiųjų sąrašo!",
   "subtitle": "Užsiregistruok jau šiandien ir gauk išskirtinį pasiūlymą - pirmą mėnesį visiškai nemokamai!",
   "form": {
      "email": "El. pašto adresas",
      "submit": "Prisijungti prie laukiančiųjų sąrašo",
      "success": "Ačiū už registraciją!",
      "error": {
         "required": "El. pašto adresas yra privalomas",
         "invalid": "Neteisingas el. pašto formatas"
      }
   }
   }
```

   Komponentas bus įgyvendintas naudojant atomic design principus ir SOLID metodologiją. Visa dokumentacija bus prieinama GitHub repository wiki skyriuje.
