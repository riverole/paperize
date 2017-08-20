describe "Component Source manager", ->
  beforeEach ->
    cy.loginAndVisitGame("loveLetter")
    cy.get(".component").first().click()

  context "with no sources imported", ->
    it "says so", ->
      cy.get("#source-manager")
        .contains("You have no sources.")

    describe "invites me to paste in a source URL or ID to import", ->
      beforeEach ->
        cy.get("#source-manager")
          .contains("Paste a Link")
            .click()

        cy.get("#source-paste-form")
            .should("be.visible")

      it "closes when i cancel", ->
        cy.get("#source-paste-form")
            .find(".button.alert")
              .click()

        cy.get("#source-paste-form")
            .should("not.be.visible")

      context "when i submit something", ->
        beforeEach ->
          cy.get("input[name='source-paste']")
              .type("abcd1234")

          cy.get("#source-paste-form")
              .find(".button.success")
                .click()

        it "closes", ->
          cy.get("#source-paste-form")
              .should("not.be.visible")

        it "i see i have the new source selected", ->
          cy.contains("Source: abcd1234")

      # adds the source to the DB
      # fetches the first version of its data
      # selects that source for this Component

    it "invites me to browse my GDrive for Sheets to import", ->
      cy.get("#source-manager")
        .contains("Browse Google Sheets")

  context "with existing sources but none selected", ->
    it.only "lists the sources i've already imported", ->
      cy.get("#source-manager").within ->
        cy.contains("Love Letter V3")
        cy.contains("Carcassonne V1")
        cy.contains("Pandemic V2")

    it "3 allows me to select a source"
    it "allows me to delete a source"

  context "with a source selected", ->
    it "shows me the exposed properties in a nice way"
    it "allows me to deselect that source"
