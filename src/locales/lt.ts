export const translations = {
  nav: {
    home: 'Pradžia',
    programs: 'Programos',
    about: 'Apie mus',
    research: 'Tyrimai',
    contact: 'Kontaktai',
    signIn: 'Prisijungti',
    signUp: 'Registruotis',
    logout: 'Atsijungti',
    search: 'Ieškoti',
    hello: 'Sveiki',
  },
  common: {
    loading: 'Kraunasi...',
    close: 'Uždaryti',
    error: 'Klaida',
    success: 'Pavyko',
    or: 'arba',
    back: 'Grįžti atgal',
    submit: 'Pateikti',
  },
  login: {
    title: 'Sveiki sugrįžę',
    form: {
      email: 'El. pašto adresas',
      emailPlaceholder: 'Įveskite el. pašto adresą',
      password: 'Slaptažodis',
      passwordPlaceholder: 'Įveskite slaptažodį',
      rememberMe: 'Prisiminti mane',
      forgotPassword: 'Pamiršote slaptažodį?',
      submit: 'Prisijungti',
      facebookLogin: 'Prisijungti su Facebook',
      noAccount: 'Dar neturite paskyros?',
      createAccount: 'Sukurti paskyrą',
    },
    errors: {
      invalidEmail: 'Neteisingas el. pašto formatas',
      invalidPassword: 'Slaptažodis turi būti bent 8 simbolių ilgio',
      loginFailed: 'Neteisingas el. paštas arba slaptažodis',
      tooManyAttempts: 'Per daug bandymų prisijungti. Pabandykite vėliau.',
      required: 'Šis laukas yra privalomas',
    },
  },
  resetPassword: {
    title: 'Slaptažodžio atstatymas',
    subtitle: 'Įveskite savo el. pašto adresą ir mes atsiųsime jums slaptažodžio atstatymo nuorodą.',
    form: {
      email: 'El. pašto adresas',
      emailPlaceholder: 'Įveskite el. pašto adresą',
      submit: 'Atstatyti slaptažodį',
      backToLogin: 'Grįžti į prisijungimą',
    },
    success: {
      title: 'Patikrinkite savo el. paštą',
      message: 'Jei nurodytas el. pašto adresas egzistuoja mūsų sistemoje, netrukus gausite slaptažodžio atstatymo nuorodą.',
    },
    errors: {
      invalidEmail: 'Neteisingas el. pašto formatas',
      required: 'Šis laukas yra privalomas',
      tooManyAttempts: 'Per daug bandymų. Pabandykite vėliau.',
      resetFailed: 'Nepavyko atstatyti slaptažodžio. Bandykite dar kartą.',
    },
  },
  programs: {
    plans: {
      title: 'Ruoškitės – startuojame 2025!',
      subtitle: 'Rezervuokite vietą šiandien ir gaukite mažesnę kainą starto metu!',
    },
    content: {
      title: 'Mūsų mokomasis turinys',
      subtitle: 'Atraskite, kas daro mūsų turinį unikalų ir vertingą',
    },
    categories: {
      plans: 'Planai',
      content: 'Turinys',
    },
  },
  signUp: {
    title: 'Registracija',
    individual: 'Fizinis asmuo',
    organization: 'Organizacija',
    firstName: 'Vardas',
    lastName: 'Pavardė',
    email: 'El. paštas',
    phone: 'Telefono numeris',
    password: 'Slaptažodis',
    organizationName: 'Organizacijos pavadinimas',
    gdprConsent: 'Sutinku su privatumo politika ir taisyklėmis',
    gdpr: {
      consent: 'Sutinku, kad mano asmens duomenys būtų tvarkomi pagal {privacyPolicy}. Suprantu, kad galiu bet kada atšaukti sutikimą ir ištrinti savo paskyrą.',
      privacyPolicy: 'privatumo politiką',
      dataUsage: 'Jūsų duomenys bus naudojami:',
      purposes: {
        account: 'Paskyros sukūrimui ir valdymui',
        services: 'Paslaugų teikimui',
        communication: 'Komunikacijai su jumis',
        legal: 'Teisinių įsipareigojimų vykdymui'
      }
    },
    next: 'Toliau',
    prev: 'Atgal',
    back: 'Atgal',
    submit: 'Registruotis',
    loading: 'Registruojama...',
    errors: {
      required: 'Šis laukas privalomas',
      invalidEmail: 'Neteisingas el. pašto formatas',
      invalidPhone: 'Neteisingas telefono numeris',
      invalidPassword: 'Slaptažodis turi būti bent 8 simbolių ilgio, turėti didžiąją raidę, skaičių ir specialų simbolį',
      invalidName: 'Vardas turi būti bent 2 simbolių ilgio ir negali turėti specialių simbolių',
      gdprRequired: 'Privalote sutikti su privatumo politika',
      unexpectedError: 'Įvyko nenumatyta klaida',
      validationFailed: 'Patikrinkite įvestus duomenis',
      passwordMinLength: 'Slaptažodis turi būti bent {length} simbolių ilgio',
      passwordUppercase: 'Slaptažodis turi turėti bent vieną didžiąją raidę',
      passwordNumber: 'Slaptažodis turi turėti bent vieną skaičių',
      passwordSpecial: 'Slaptažodis turi turėti bent vieną specialų simbolį',
      phoneInvalid: 'Neteisingas telefono numerio formatas',
      emailInvalid: 'Neteisingas el. pašto formatas',
      nameMinLength: 'Vardas turi būti bent 2 simbolių ilgio',
      nameMaxLength: 'Vardas negali būti ilgesnis nei 50 simbolių'
    },
    passwordStrength: {
      veryWeak: 'Labai silpnas',
      weak: 'Silpnas',
      medium: 'Vidutinis',
      strong: 'Stiprus',
      veryStrong: 'Labai stiprus',
    },
    steps: {
      basicInfo: 'Pagrindinė info',
      contacts: 'Kontaktai',
      confirmation: 'Patvirtinimas'
    },
  },
  waitlist: {
    title: 'Prisijunk prie Howkings University laukiančiųjų sąrašo!',
    subtitle: 'Užsiregistruok jau šiandien ir gauk išskirtinį pasiūlymą - pirmą mėnesį visiškai nemokamai!',
    form: {
      email: 'El. pašto adresas',
      submit: 'Prisijungti prie laukiančiųjų sąrašo',
      success: 'Ačiū už registraciją!',
      error: {
        required: 'El. pašto adresas yra privalomas',
        invalid: 'Neteisingas el. pašto formatas'
      }
    },
    stats: {
      students: 'Jau užsiregistravusių studentų',
      security: 'Saugus registracijos procesas',
      trial: 'Nemokamas bandomasis laikotarpis'
    }
  },
  requestPool: {
    errors: {
      fetchFailed: 'Nepavyko gauti užklausų. Bandykite dar kartą vėliau.',
      loginRequired: 'Prašome prisijungti, kad galėtumėte balsuoti',
      alreadyVoted: 'Jūs jau balsavote už šį modulį',
      moduleNotFound: 'Modulis nerastas',
      voteFailed: 'Įvyko klaida balsuojant. Bandykite dar kartą.',
    },
    success: {
      voteRegistered: 'Jūsų balsas sėkmingai užskaitytas!',
    },
    loading: 'Kraunami moduliai...',
    loginPrompt: 'Norėdami balsuoti, turite būti prisijungę.',
    loginButton: 'Prisijungti',
    searchPlaceholder: 'Ieškoti modulių...',
    addRequestButton: 'Pridėti užklausą',
    sort: {
      label: 'Rūšiuoti pagal:',
      votes: 'Balsai',
      date: 'Data',
      name: 'Pavadinimas'
    }
  },
};
