# graphql demo

`npm i`
`node server.js`

## Why
this app is a toy for playing with GQL. Goals:

* build a server that returns fake employee data GQL style
* query against said server with a client, esp a popular client like apollo
* demonstrate GQL tooling like the built in endpoint schema documentation

## Info
uses GraphQL.js. Docs live here: https://graphql.org/graphql-js/

## notes
 GraphQL.js supports two different ways to build schemas, programatically, or with SDL.
 I went with programmaticcly because the demo I am emulating did teh same thing. https://github.com/CodepediaOrg/graphql-express-crud-demo/blob/main/src/schema.js

