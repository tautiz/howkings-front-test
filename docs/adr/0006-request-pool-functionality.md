# 0006. Request Pool Funkcionalumas 🎯

Data: 2025-01-10

## Statusas

Accepted ✅

## Kontekstas 🌍

Request Pool yra svarbi sistemos dalis, kuri leidžia vartotojams:

- Peržiūrėti modulių užklausas
- Balsuoti už norimus modulius
- Pridėti naujas modulių užklausas
- Filtruoti ir ieškoti tarp esamų užklausų

Šis funkcionalumas yra būtinas norint:

1. Suprasti vartotojų poreikius
2. Demokratiškai nuspręsti, kurie moduliai yra prioritetiniai
3. Efektyviai valdyti modulių kūrimo procesą

## Sprendimas 💡

### Komponentų Struktūra

```text
RequestPool/
├── index.tsx (pagrindinis komponentas)
├── RequestList.tsx (užklausų sąrašo atvaizdavimas)
├── RequestForm/ (naujos užklausos forma)
└── types.ts (tipų aprašymai)
```

### Pagrindinės Funkcijos

1. **Užklausų Sąrašas**
   - Puslapiavimas (6 įrašai per puslapį)
   - Paieška pagal raktažodžius
   - Rūšiavimas pagal balsų skaičių
   - Žymių (tags) filtravimas

2. **Balsavimo Sistema**
   - Vienas vartotojas = vienas balsas už užklausą
   - Realaus laiko balsų atnaujinimas
   - Balsavimo istorijos išsaugojimas

3. **Naujų Užklausų Pridėjimas**
   - Validacija
   - Žymių pridėjimas
   - Automatinis formatavimas

### Saugumo Aspektai 🔒

1. Rate limiting balsavimui
2. Input validacija
3. XSS prevencija

### Autentifikacijos Reikalavimai 🔐

1. **Svečio (Guest) Teisės**
   - Peržiūrėti užklausų sąrašą
   - Naudoti paiešką ir filtrus
   - Matyti balsų skaičių

2. **Autentifikuoto Vartotojo Teisės**
   - Visos svečio teisės
   - Balsuoti už užklausas
   - Kurti naujas užklausas
   - Valdyti savo balsus

3. **Autentifikacijos Flow**

   ```typescript
   // Komponento logika
   const handleAction = async (action: 'vote' | 'create') => {
   if (!isAuthenticated) {
      // Išsaugom pradėtą veiksmą
      saveIntendedAction({
         type: action,
         payload: action === 'vote' ? requestId : formData
      });
      
      // Atidarom prisijungimo langą
      openAuthModal();
      return;
   }
   
   // Vykdom veiksmą
   proceedWithAction(action);
   };

   // Po sėkmingo prisijungimo
   const onAuthSuccess = () => {
   const savedAction = getIntendedAction();
   if (savedAction) {
      proceedWithAction(savedAction.type, savedAction.payload);
      clearIntendedAction();
   }
   };
   ```

4. **Saugumo Aspektai**
   - API endpoints reikalauja valid JWT token
   - Front-end UI elementai disabled/hidden svečiams
   - Back-end double-check autentifikacijai

### API Endpoints

```typescript
GET /api/requests - gauti užklausų sąrašą
POST /api/requests - pridėti naują užklausą
POST /api/requests/:id/vote - balsuoti už užklausą
```

### API Dokumentacija 📚

#### Autentifikacijos Header

```typescript
// Visiems authenticated endpoints
headers: {
  'Authorization': 'Bearer ${jwt_token}'
}
```

#### GET /api/requests

```typescript
// Užklausa
GET /api/requests?page=1&limit=6&search=test&sort=votes

// Atsakymas
{
  "data": [
    {
      "id": number,
      "title": string,
      "description": string,
      "votes": number,
      "tags": Array<{
        id: number,
        name: string,
        type: 'module_request' | 'tag'
      }>,
      "created_at": string,
      "updated_at": string
    }
  ],
  "meta": {
    "total": number,
    "page": number,
    "limit": number,
    "total_pages": number
  }
}
```

#### POST /api/requests

```typescript
// Užklausa
POST /api/requests
{
  "title": string,       // Privalomas, min 5, max 100 simbolių
  "description": string, // Privalomas, min 20, max 1000 simbolių
  "tags": string[]      // Neprivalomas, max 5 žymės
}

// Atsakymas
{
  "status": "success",
  "data": {
    "id": number,
    "title": string,
    "description": string,
    // ... kiti laukai
  }
}
```

#### POST /api/requests/:id/vote

```typescript
// Užklausa
POST /api/requests/123/vote

// Atsakymas
{
  "status": "success",
  "data": {
    "votes": number  // Naujas balsų skaičius
  }
}
```

### Komponentų Dokumentacija 🔧

#### RequestPool

Pagrindinis komponentas, valdantis visą užklausų funkcionalumą.

**Props:**

- Nėra, tai root komponentas

**State:**

```typescript
{
  isSubmitOpen: boolean;      // Naujos užklausos formos būsena
  searchQuery: string;        // Paieškos užklausa
  currentPage: number;        // Dabartinis puslapis
  votedRequests: Set<number>; // Vartotojo balsai
  requests: ModuleRequest[];  // Užklausų sąrašas
  isLoading: boolean;         // Užkrovimo būsena
  error: string | null;       // Klaidos būsena
}
```

#### RequestList

Atvaizduoja užklausų sąrašą su balsavimo funkcionalumu.

**Props:**

```typescript
{
  requests: ModuleRequest[];              // Užklausų masyvas
  onVote: (index: number) => void;        // Balsavimo handler
  votedRequests: Set<number>;             // Balsavimo būsena
}
```

#### RequestForm

Forma naujai užklausai pridėti.

**Props:**

```typescript
{
  onSubmit: (data: NewRequest) => void;   // Submit handler
  onClose: () => void;                    // Uždarymo handler
}
```

### Vartotojo Gidas 📱

#### Užklausų Peržiūra

1. Atidaryk Request Pool puslapį
2. Naršyk per užklausų sąrašą naudodamas puslapiavimą
3. Naudok paieškos lauką specifinėms užklausoms rasti
4. Filtruok užklausas pagal žymes (tags)

#### Balsavimas

1. Rask norimą užklausą
2. Jei nesi prisijungęs:
   - Paspaudus balsavimo mygtuką atsidarys prisijungimo langas
   - Po sėkmingo prisijungimo tavo balsas bus automatiškai užskaitytas
3. Jei esi prisijungęs:
   - Spausk ⬆️ mygtuką norėdamas balsuoti
   - Balsą galima atšaukti paspaudus dar kartą

#### Naujos Užklausos Pridėjimas

1. Jei nesi prisijungęs:
   - Paspaudus "+" mygtuką atsidarys prisijungimo langas
   - Po sėkmingo prisijungimo automatiškai atsidarys naujos užklausos forma
2. Jei esi prisijungęs:
   - Spausk "+" mygtuką viršuje
   - Užpildyk formos laukus
   - Spausk "Submit" mygtuką

#### Patarimai 💡

- Prieš kuriant naują užklausą, patikrink ar panaši jau neegzistuoja
- Naudok aiškius ir informatyvius pavadinimus
- Aprašyme pateik kuo daugiau naudingos informacijos
- Žymės padeda kitiems lengviau rasti tavo užklausą

## Pasekmės 📊

### Teigiamos

1. Aiški ir intuityvi vartotojo sąsaja
2. Efektyvus modulių prioritetų nustatymas
3. Skaidrus sprendimų priėmimo procesas
4. Lengvas plečiamumas ateityje

### Neigiamos

1. Papildoma serverio apkrova dėl balsavimo sistemos
2. Reikalinga papildoma duomenų bazės optimizacija
3. Sudėtingesnis testavimas dėl realaus laiko funkcionalumo

## Testavimo Strategija 🧪

1. **Unit Testai**
   - Komponentų renderinimas
   - Balsavimo logika
   - Paieškos funkcionalumas

2. **Integraciniai Testai**
   - API užklausų testavimas
   - Vartotojo sąsajos testavimas
   - Balsavimo sistemos testavimas

3. **E2E Testai**
   - Pilnas vartotojo kelias
   - Edge cases
   - Performance testing

## Stebėjimas ir Metrika 📈

1. Balsavimo aktyvumas
2. Populiariausios užklausos
3. Vartotojų įsitraukimas
4. Sistemos apkrova
