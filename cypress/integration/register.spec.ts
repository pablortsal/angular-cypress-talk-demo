/// <reference types="cypress"/>
import Chance from "chance";
const chance = new Chance();

describe("Test SignUp page", () => {
  const name = chance.word({ syllables: 3 });
  const failedName = chance.word({ syllables: 1 });
  const invalidName = chance.word({ syllables: 1 });
  const email = chance.word({ syllables: 3 }) + "@gmail.com";
  const invalidEmail = chance.word({ syllables: 3 });
  const password = chance.word({ syllables: 6 });
  const invalidPasssword = chance.word({ syllables: 1 });

  before(() => {
    cy.visit("http://localhost:4200");
  });

  it("Should render SignUp Page", () => {
    cy.contains("Registro de usuario");
  });

  it("Should have all inputs", () => {
    //cy.pause();
    cy.get("input[cy-input-name")
      .invoke("attr", "placeholder")
      .should("contain", "Nombre");
    cy.get("input[cy-input-email]")
      .invoke("attr", "placeholder")
      .should("contain", "Email");
    cy.get("input[cy-input-password]")
      .invoke("attr", "placeholder")
      .should("contain", "Contraseña");
  });

  it("SignUp button should be disabled", () => {
    cy.get("button").should("be.disabled");
  });

  it("Name should have at least 4 letter", () => {
    //cy.pause();
    cy.get("input[cy-input-name").should("be.visible");
    cy.get("input[cy-input-name").type(failedName);
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

  it("SignUp button should be enabled", () => {
    cy.get("button").should("be.enabled");
  });

  it("Should manage failure registration", () => {
    cy.server({
      method: "POST",
      delay: 1000,
      status: 401,
    });
    cy.route("https://unapiclaramenteinexistente.com");
    cy.get("button").click();
    cy.get("p[cy-signup-error").should("be.visible");
  });

  it("should manage succes registration", () => {
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
    cy.contains("SUCCES");
  });
});
