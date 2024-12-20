describe('Auth E2E Tests 🚀', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.visit('/');
    
    // Uždarome cookie consent modalą
    cy.get('.cookie-consent').should('be.visible').within(() => {
      cy.contains('Accept').click();
    });
  });

  it('turėtų sėkmingai praeiti visą vartotojo kelią', () => {
    // 1. Registracija
    cy.get('#authorization_buttons').within(() => {
      cy.contains('Sign Up').click();
    });
    
    cy.get('[data-testid=register-form]').should('be.visible').within(() => {
      cy.get('[name=firstName]').type('Jonas');
      cy.get('[name=lastName]').type('Jonaitis');
      cy.get('[name=email]').type('jonas@example.com');
      cy.get('[name=phone]').type('+37061234567');
      cy.get('[name=password]').type('stiprusSlaptazodis123!');
      cy.get('[type=submit]').click();
    });

    // Tikrinam ar sėkmingai užsiregistravom
    cy.contains('Jonas').should('be.visible');

    // 2. Atsijungimas
    cy.get('[aria-label="Logout"]').click();
    cy.get('#authorization_buttons').should('be.visible');

    // 3. Prisijungimas
    cy.get('#authorization_buttons').within(() => {
      cy.contains('Login').click();
    });
    
    cy.get('[data-testid=login-form]').should('be.visible').within(() => {
      cy.get('[name=email]').type('jonas@example.com');
      cy.get('[name=password]').type('stiprusSlaptazodis123!');
      cy.get('[type=submit]').click();
    });

    // Tikrinam ar sėkmingai prisijungėm
    cy.contains('Jonas').should('be.visible');
  });

  it('turėtų teisingai apdoroti prisijungimo klaidas', () => {
    cy.get('#authorization_buttons').within(() => {
      cy.contains('Login').click();
    });
    
    cy.get('[data-testid=login-form]').should('be.visible').within(() => {
      cy.get('[name=email]').type('neegzistuojantis@example.com');
      cy.get('[name=password]').type('neteisingasSlaptazodis');
      cy.get('[type=submit]').click();
    });

    // Tikrinam ar rodoma klaidos žinutė
    cy.contains('Invalid credentials').should('be.visible');
  });

  it('turėtų išsaugoti autentifikacijos būseną po puslapio perkrovimo', () => {
    // Prisijungiam
    cy.get('#authorization_buttons').within(() => {
      cy.contains('Login').click();
    });
    
    cy.get('[data-testid=login-form]').should('be.visible').within(() => {
      cy.get('[name=email]').type('jonas@example.com');
      cy.get('[name=password]').type('stiprusSlaptazodis123!');
      cy.get('[type=submit]').click();
    });

    // Perkraunam puslapį
    cy.reload();

    // Tikrinam ar likom prisijungę
    cy.contains('Jonas').should('be.visible');
  });

  it('turėtų teisingai apdoroti token galiojimo pabaigą', () => {
    // Nustatom pasibaigusį token
    cy.window().then((win) => {
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      win.localStorage.setItem('access_token', expiredToken);
    });

    // Perkraunam puslapį
    cy.reload();

    // Turėtume matyti prisijungimo mygtukus
    cy.get('#authorization_buttons').within(() => {
      cy.contains('Login').should('be.visible');
      cy.contains('Sign Up').should('be.visible');
    });
  });
});
