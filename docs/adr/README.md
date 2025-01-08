# Architecture Decision Records (ADR) 📋

## Kas yra ADR?

Architecture Decision Records (ADR) yra dokumentai, kurie aprašo svarbius architektūrinius sprendimus projekte. Kiekvienas ADR aprašo:

- Problema (kokia yra problema)
- Kontekstą (kodėl reikia sprendimo)
- Sprendimą (ką nusprendėme daryti)
- Pasekmes (kokį poveikį tai turės)

## ADR struktūra

1. **Pavadinimas ir data**
   - Trumpas, aiškus pavadinimas
   - Sprendimo priėmimo data

2. **Statusas**
   - Proposed (pasiūlytas)
   - Accepted (priimtas)
   - Deprecated (pasenęs)
   - Superseded (pakeistas kitu)

3. **Kontekstas**
   - Problemos aprašymas
   - Esama situacija
   - Apribojimai

4. **Sprendimas**
   - Detalus sprendimo aprašymas
   - Implementacijos gairės

5. **Pasekmės**
   - Teigiamos
   - Neigiamos
   - Rizikos

## LLMs.txt Maintenance Requirements 🤖

The `llms.txt` file in our project root serves as a crucial documentation source for Large Language Models (LLMs). This markdown file provides essential information about our website's structure, features, and navigation.

### When to Update llms.txt

The `llms.txt` file MUST be updated in the following cases:
1. When implementing new features
2. When modifying existing functionality
3. When changing navigation structure
4. When adding new components
5. When updating supported languages
6. When modifying feature configurations

### Update Process

1. Locate `llms.txt` in the project root
2. Add or modify relevant sections:
   - Core features
   - Navigation paths
   - Component structure
   - Feature configurations
3. Commit changes with a descriptive message
4. Include llms.txt updates in your PR

### Purpose

The `llms.txt` file helps LLMs better understand our website structure and provide accurate assistance for:
- Code maintenance
- Feature development
- Documentation
- User support

## ADR sąrašas

1. [Autentifikacijos implementacija](./0001-authentication-implementation.md)
2. [Vartotojų Registracijos Implementacija](./0002-user-registration.md)
3. [reCAPTCHA v3 Implementacija](./0003-recaptcha-v3-implementation.md)
4. [Prisijungimo Funkcionalumo Implementacija](./0004-login-functionality.md)
5. [Waitlist Funkcionalumo Įgyvendinimas](./0005-waitlist-functionality.md)

## Kaip pridėti naują ADR?

1. Sukurkite naują failą: `NNNN-decision-name.md`
2. Naudokite standartinį formatą
3. Atnaujinkite šį README.md failą
4. Pateikite PR review'ui

## ADR šablono pavyzdys

```markdown
# N. Sprendimo pavadinimas

Data: YYYY-MM-DD

## Statusas

[Proposed|Accepted|Deprecated|Superseded|Suspended]

## Kontekstas

[Problemos ir situacijos aprašymas]

## Sprendimas

[Detalus sprendimo aprašymas]

## Pasekmės

### Teigiamos

- [Teigiama pasekmė 1]
- [Teigiama pasekmė 2]

### Neigiamos

- [Neigiama pasekmė 1]
- [Neigiama pasekmė 2]

## Alternatyvos

[Alternatyvių sprendimų aprašymas]

## Papildoma informacija

[Nuorodos į dokumentaciją, straipsnius, etc.]
