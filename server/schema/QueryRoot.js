const graphql = require('graphql')
const joinMonster = require('join-monster')
const schema = require('./index.js');

const formatDate = require('../helpers/formatDate.js')

const createQueryRoot = client => {
  return new graphql.GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      entries: {
        type: new graphql.GraphQLList(schema.Entry),
        args: {
          month: { type: graphql.GraphQLInt },
          year: { type: graphql.GraphQLInt }
        },
        where: (entryTable, args) => {
          if (args.month && args.year) {
            const start = formatDate(new Date(args.year, args.month));
            const end = formatDate(new Date(args.year, args.month + 1));
            return `${entryTable}.date >= '${start}' AND ${entryTable}.date < '${end}' ORDER BY date ASC`
          }
        },
        resolve: (parent, args, context, resolveInfo) => {
          return joinMonster.default(resolveInfo, {}, sql => {
            return client.query(sql)
          })
        }
      },
      entry: {
        type: schema.Entry,
        args: {
          id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) }
        },
        where: (entryTable, args) => `${entryTable}.id = ${args.id}`,
        resolve: (parent, args, context, resolveInfo) => {
          return joinMonster.default(resolveInfo, {}, sql => {
            return client.query(sql)
          })
        }
      },
      types: {
        type: new graphql.GraphQLList(schema.Type),
        resolve: (parent, args, context, resolveInfo) => {
          return joinMonster.default(resolveInfo, {}, sql => {
            return client.query(sql)
          })
        }
      },
      type: {
        type: schema.Type,
        args: { id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) } },
        where: (typeTable, args, context) => `${typeTable}.id = ${args.id}`,
        resolve: (parent, args, context, resolveInfo) => {
          return joinMonster.default(resolveInfo, {}, sql => {
            return client.query(sql)
          })
        }
      },
      tags: {
        type: new graphql.GraphQLList(schema.Tag),
        resolve: (parent, args, context, resolveInfo) => {
          return joinMonster.default(resolveInfo, {}, sql => {
            return client.query(sql)
          })
        }
      },
      tag: {
        type: schema.Tag,
        args: { id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) } },
        where: (tagTable, args, context) => `${tagTable}.id = ${args.id}`,
        resolve: (parent, args, context, resolveInfo) => {
          return joinMonster.default(resolveInfo, {}, sql => {
            return client.query(sql)
          })
        }
      },
      statuses: {
        type: new graphql.GraphQLList(schema.Status),
        resolve: (parent, args, context, resolveInfo) => {
          return joinMonster.default(resolveInfo, {}, sql => {
            return client.query(sql)
          })
        }
      },
      status: {
        type: schema.Status,
        args: { id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) } },
        where: (statusTable, args, context) => `${statusTable}.id = ${args.id}`,
        resolve: (parent, args, context, resolveInfo) => {
          return joinMonster.default(resolveInfo, {}, sql => {
            return client.query(sql)
          })
        }
      },
    })
  })
}

module.exports = client => createQueryRoot(client);