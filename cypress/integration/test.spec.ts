/*
Cypress -> Chai para las aserciones
Cypress  -> Mocka para la estructura de sintaxis y demas
Cypress -> Sinonm para añadir metodo adcionales como el spy para  gestion de eventos, y control de funciones y de tiempos
Selenium, necesita tambien de un rentorno de ejecucion


Fixture: Recursos estaticos que podemos usar para hacer los mocks o como repsuestas http, imagenes .....
Integration: Los tests
PLugins: Defincion de los plugins que aumentan el potencial de cypress, algunos pr ejemplo para cargar compoentes angular o react
Support: Index.js se ejectua justo antes de cada archivo de test, de tal forma que podemos usarlo como un befeoreAll de form generica


REQUEST , server y route
https://docs.cypress.io/es/guides/guides/network-requests.html#Stubbing





*/
/// <reference types="cypress"/>
import Chance from "chance";
const chance = new Chance();

describe("Home App test e2e", () => {
  const name = chance.word({ syllables: 3 });
  const invalidName = chance.word({ syllables: 1 });
  const email = chance.word({ syllables: 3 }) + "@gmail.com";
  const invalidEmail = chance.word({ syllables: 3 });
  const password = chance.word({ syllables: 6 });
  const invalidPasssword = chance.word({ syllables: 1 });

  before(() => {
    cy.visit("http://localhost:4200/");
  });

  it("Should load singUp page", () => {
    cy.contains("Registro de usuario");
  });

  it("Should have correct inputs", () => {
    cy.get("input[cy-input-name]")
      .invoke("attr", "placeholder")
      .should("contain", "Nombre");
    cy.get("input[cy-input-email]")
      .invoke("attr", "placeholder")
      .should("contain", "Email");
    cy.get("input[cy-input-password]")
      .invoke("attr", "placeholder")
      .should("contain", "Contraseña");
  });

  it("Register button should be disabeld", () => {
    cy.get("button").should("be.disabled");
  });

  it("Name should should have at least 4 letter", () => {
    //cy.pause();
    cy.get("input[cy-input-name]").should("be.visible");
    cy.get("input[cy-input-name]").type(invalidName);
    cy.get("body").click();
    cy.contains("El nombre debe tener al menos 4 caracteres");
    cy.get("input[cy-input-name]").type(name);
    cy.get("body").click();
  });
  it("Email should should be valid", () => {
    // cy.pause();
    cy.get("input[cy-input-email]").should("be.visible");
    cy.get("input[cy-input-email]").type(invalidEmail);
    cy.get("body").click();
    cy.contains("Email no válido");
    cy.get("input[cy-input-email]").type(email);
    cy.get("body").click();
  });
  it("Email should should be valid", () => {
    // cy.pause();
    cy.get("input[cy-input-password]").should("be.visible");
    cy.get("input[cy-input-password]").type(invalidPasssword);
    cy.get("body").click();
    cy.contains(" La contraseña debe tener al menos 6 caracteres");
    cy.get("input[cy-input-password]").type(password);
    cy.get("body").click();
  });

  it("REgister button should be ready", () => {
    cy.get("button").should("be.enabled");
  });

  it("Should manage registraton failure", () => {
    cy.fixture("response")
      .as("reponseJSON")
      .then((res) => {
        cy.server({
          method: "POST",
          delay: 1000,
          status: 401,
          response: {},
        });
      });

    cy.route("https://unapiclaramenteinexistente.com");
    cy.get("button").click();
    cy.get("p[cy-signup-error]").should("be.visible");
  });

  it("Should manage registraton succes", () => {
    cy.fixture("response").then((res) => {
      cy.server({
        method: "POST",
        delay: 1000,
        status: 200,
        response: res,
      });
    });

    cy.route("https://unapiclaramenteinexistente.com");
    cy.get("button").click();
    cy.location("pathname").should("include", "detail");
  });
});
