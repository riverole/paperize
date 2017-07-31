# You can read more about custom commands here:
# https://on.cypress.io/api/commands

GOOGLE_STYLE_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkF2aWQgR2FtZXIiLCJwaWN0dXJlIjoiaHR0cDovL3BsYWNlaG9sZC5pdC8yMC8yMCJ9.-XxTrb815_LOwALFw84NV8YusXxROyKdfVMikINH5Pc"
GOOGLE_STYLE_PAYLOAD =
  sub: "1234567890"
  name: "Avid Gamer"
  picture: "http://placehold.it/20/20"

Cypress.addParentCommand "login", ->
  email    = email or "joe@example.com"
  password = password or "foobar"

  log = Cypress.Log.command
    name: "login"
    message: [GOOGLE_STYLE_PAYLOAD.name]
    consoleProps: ->
      id: GOOGLE_STYLE_PAYLOAD.sub
      name: GOOGLE_STYLE_PAYLOAD.name
      jwt: GOOGLE_STYLE_JWT

  localStorage.setItem('id_token', GOOGLE_STYLE_JWT)

  persistenceItem = {}
  persistenceItem[GOOGLE_STYLE_PAYLOAD.sub] =
    profile:
      name: 'Avid Gamer',
      avatarSrc: 'http://placehold.it/20/20'
    games: []

  localStorage.setItem 'persistence', JSON.stringify(persistenceItem)

  log.snapshot().end()