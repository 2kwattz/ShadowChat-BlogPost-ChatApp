const userTypeDefs = `#graphql

type User {
    userId: ID!
    firstName: String!
    lastName: String!
    email: String!
    username: String!
    gender: String!
    role: String!
    date_of_birth: String!
    }
    
    type Query {
    getUsers: [User]
    }
`;

module.exports = userTypeDefs

