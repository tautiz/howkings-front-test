# Architecture Decision Records (ADR) 📋

## Kas yra ADR?

Architecture Decision Records (ADR) yra dokumentai, kurie aprašo svarbius architektūrinius sprendimus projekte. Kiekvienas ADR aprašo:
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

## ADR sąrašas

1. [Autentifikacijos implementacija](./0001-authentication-implementation.md)
2. [Vartotojų Registracijos Implementacija](./0002-user-registration.md)

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

[Proposed|Accepted|Deprecated|Superseded]

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
