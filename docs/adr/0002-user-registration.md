# 2. Vartotojų Registracijos Implementacija

Data: 2024-12-20

## Statusas

Priimtas

## Kontekstas

Reikia implementuoti saugų ir patogų vartotojų registracijos procesą. Sistema turi:
- Užtikrinti duomenų validaciją
- Apsaugoti nuo dažnų atakų (brute force, injection)
- Tvarkyti vartotojo duomenis pagal GDPR
- Užtikrinti sklandų UX registracijos metu
- Integruotis su autentifikacijos sistema

## Sprendimas

1. **Registracijos forma**
   - Reikalingi laukai:
     - Vardas (min 2, max 50 simbolių)
     - Pavardė (min 2, max 50 simbolių)
     - El. paštas (validacija pagal RFC 5322)
     - Telefonas (E.164 formatas)
     - Slaptažodis (min 8 simboliai, bent 1 didžioji raidė, 1 skaičius)
   - Real-time validacija
   - Aiškūs klaidų pranešimai

2. **Saugumo priemonės**
   - CSRF apsauga
   - Rate limiting registracijos bandymams
   - Slaptažodžio stiprumo validacija
   - Duomenų šifravimas perduodant į serverį
   - Captcha apsauga nuo botų

3. **Duomenų tvarkymas**
   - Privatumo politikos sutikimas
   - GDPR reikalavimų laikymasis
   - Aiškus duomenų naudojimo paaiškinimas
   - Galimybė ištrinti paskyrą

4. **UX/UI sprendimai**
   - Multi-step registracijos forma
   - Progress indikatorius
   - Inline validacija
   - Patobulinimų pasiūlymai (pvz., slaptažodžio stiprumui)
   - Loading būsenos

5. **Integracija su auth sistema**
   - Automatinis prisijungimas po registracijos
   - Token'ų gavimas ir saugojimas
   - Nukreipimas į pagrindinį puslapį

## Pasekmės

### Teigiamos

- Saugi registracijos sistema
- Geras UX su aiškiais pranešimais
- GDPR compliance
- Lengva integracija su esama auth sistema
- Apsauga nuo pagrindinių atakų

### Neigiamos

- Sudėtingesnė forma dėl papildomų saugumo priemonių
- Didesnis pradinių duomenų kiekis
- Papildomas serverio apkrovimas dėl real-time validacijos

## Alternatyvos

1. **Socialinių tinklų registracija**
   - Palikta kaip papildoma galimybė
   - Reikalinga OAuth integracija
   - Mažiau kontrolės virš duomenų

2. **Supaprastinta registracija**
   - Atmesta dėl saugumo reikalavimų
   - Neužtikrina GDPR compliance

3. **Išorinė auth sistema (Auth0, Firebase)**
   - Atmesta dėl kaštų
   - Mažiau kontrolės
   - Priklausomybė nuo trečiųjų šalių

## Testavimas

1. **Unit testai**
   - Validacijos logika
   - Form state management
   - Error handling

2. **Integration testai**
   - Registracijos flow
   - API integracija
   - Auth sistema

3. **E2E testai**
   - Pilnas registracijos procesas
   - Edge cases
   - Error scenarios

## Papildoma informacija

- [OWASP Registration Security](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/03-Identity_Management_Testing/02-Testing_User_Registration_Process)
- [GDPR Requirements](https://gdpr.eu/requirements)
- [Password Security Guidelines](https://pages.nist.gov/800-63-3/sp800-63b.html)
