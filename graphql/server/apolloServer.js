const { ApolloServer } = require("@apollo/server");

const typeDefs = require("../schemas");
const resolvers = require("../resolvers");

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers
});

console.log("[*] Apollo Server Initialized ")

module.exports = apolloServer;