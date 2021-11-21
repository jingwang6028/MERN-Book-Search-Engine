const express = require("express");
const path = require("path");

//import ApolloServer
const { ApolloServer } = require("apollo-server-express");
//import typeDefs, resolvers in schemas
const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");
// Import `authMiddleware()` function to be configured with the Apollo Server
const { authMiddleware } = require("./utils/auth");

const PORT = process.env.PORT || 3001;
const app = express();
//create new ApolloServer with pass in Schema
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // Add context to our server so data from the `authMiddleware()` function can pass data to our resolver functions
  context: authMiddleware,
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

server.applyMiddleware({ app });
// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
