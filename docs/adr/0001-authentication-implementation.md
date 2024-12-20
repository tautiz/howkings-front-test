# 1. Autentifikacijos implementacija

Data: 2024-12-20

## Statusas

Priimtas

## Kontekstas

Reikia implementuoti saugią ir patikimą vartotojų autentifikacijos sistemą frontend aplikacijoje. Sistema turi:
- Saugiai valdyti vartotojo sesijas
- Automatiškai atnaujinti tokenus
- Tinkamai tvarkyti klaidas ir netikėtus atvejus
- Užtikrinti sklandų UX

## Sprendimas

1. **Token saugojimas**
   - Access token saugomas localStorage
   - Refresh token saugomas localStorage (ateityje planuojama perkelti į httpOnly cookies)
   - Tokenai šifruojami prieš saugojimą

2. **Autentifikacijos architektūra**
   - Singleton TokenValidationService
   - React Context autentifikacijos būsenai
   - Axios interceptors automatiniam token pridėjimui
   - Error boundary komponentai klaidų valdymui

3. **Token validacija**
   - Automatinė validacija aplikacijos paleidimo metu
   - Periodinė validacija kas 5 minutes
   - Validacija prieš svarbias operacijas

## Pasekmės

### Teigiamos

- Centralizuotas autentifikacijos valdymas
- Aiški ir lengvai testuojama architektūra
- Automatinis klaidų valdymas
- Geras UX dėl sklandaus token atnaujinimo

### Neigiamos

- localStorage nėra pats saugiausias būdas saugoti tokenus (XSS rizika)
- Papildomas sudėtingumas dėl token validacijos logikos
- Reikalingas papildomas error handling kiekvienam API call

## Alternatyvos

1. **Session-based autentifikacija**
   - Atmesta dėl scalability problemų
   - Sudėtingesnė implementacija su microservices

2. **JWT be refresh tokenų**
   - Atmesta dėl saugumo rizikų
   - Trumpesnė sesijos trukmė = blogesnis UX

3. **OAuth 2.0 su socialiniais tinklais**
   - Palikta kaip ateities galimybė
   - Reikalinga papildoma infrastruktūra

## Papildoma informacija

- [JWT.io dokumentacija](https://jwt.io/introduction)
- [OWASP Authentication Guidelines](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/04-Authentication_Testing/README)
