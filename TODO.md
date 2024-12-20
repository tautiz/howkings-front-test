Remiantis projekto analize, štai AI rekomendacijos refaktoringui 🔧:

1. **Architektūros Tobulinimas** 🏗️:
   * Įdiegti Feature-based architektūrą - sugrupuoti susijusius komponentus, servisus ir tipus į feature modulius
   * Sukurti aiškią layered architecture: presentation -> business -> data layers
   * Įvesti Domain-Driven Design principus
2. **Testavimo Strategija** 🧪:
   * Matau, kad yra Jest ir Cypress, bet reikia:
     * Padidinti unit testų aprėptį
     * Pridėti integration testus
     * Įdiegti E2E testų automatizavimą CI/CD pipeline
     * Pridėti snapshot testus UI komponentams
3. **Saugumo Pagerinimas** 🔒:
   * Įdiegti CSP (Content Security Policy)
   * Pridėti CSRF apsaugą
   * Implementuoti Rate Limiting
   * Peržiūrėti dependency vulnerabilities
4. **Kodo Kokybė** ✨:
   * Įdiegti Prettier formatavimui
   * Sustiprinti ESLint taisykles
   * Pridėti Husky pre-commit hooks
   * Įdiegti SonarQube kodo kokybės metrikoms
5. **Pertvarkyt Komponentų Struktūrą** 📦:
   * Sukurti Atomic Design sistemą (atoms, molecules, organisms)
   * Įdiegti Storybook UI dokumentacijai
   * Implementuoti Compound Components pattern
6. **Performance Optimizacija** 🚀:
   * Įdiegti Code Splitting
   * Optimizuoti lazy loading
   * Implementuoti caching strategiją
   * Pridėti Performance monitoring
7. **State Management** 💾:
   * Peržiūrėti contexts naudojimą
   * Įvertinti Redux/MobX/Zustand įdiegimą
   * Implementuoti proper state persistence
8. **API Integracija** 🔌:
   * Sukurti centralizuotą API klientą
   * Įdiegti proper error handling
   * Implementuoti retry logic
   * Pridėti API response caching
9. **TypeScript Griežtinimas** 📝:
   * Įjungti strict mode
   * Pagerinti type coverage
   * Sukurti bendrus type utilities
   * Implementuoti proper error types
10. **Dokumentacija** 📚:
    * Sukurti API dokumentaciją
    * Pridėti JSDoc komentarus
    * ~~Sukurti development guide~~
    * Pridėti architecture decision records (ADR)

Taip pat matau, kad projekte yra keletas modernių įrankių (Vite, TailwindCSS, TypeScript), bet galėtume juos dar geriau išnaudoti.
