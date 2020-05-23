const express = require('express')
const graphqlHTTP = require('express-graphql')
const graphql = require('graphql')
require('dotenv').config()

const createQueryRoot = require('./schema/QueryRoot')
const createMutationRoot = require('./schema/MutationRoot')

// Connect to database
const { Client } = require('pg')
const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "organiser"
})
client.connect()

const schema = new graphql.GraphQLSchema({
  query: createQueryRoot(client),
  mutation: createMutationRoot(client)
});

// Create the Express app
const app = express();
app.use('/api', graphqlHTTP({
  schema: schema,
  graphiql: true
}));
app.listen(4000);