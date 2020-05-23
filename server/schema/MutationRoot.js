const graphql = require('graphql')
const graphqlIsoDate = require('graphql-iso-date')
const schema = require('./index.js')
const arrayString = require('../helpers/arrayString')

const createMutationRoot = client => {
  return new graphql.GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
      entry: {
        type: schema.Entry,
        args: {
          title: { type: graphql.GraphQLString },
          date: { type: graphqlIsoDate.GraphQLDateTime },
          body: { type: graphql.GraphQLString },
          link: { type: graphql.GraphQLString },
          tags: { type: graphql.GraphQLList(graphql.GraphQLString) },
          type: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
          image: { type: graphql.GraphQLString },
          subtitle: { type: graphql.GraphQLString },
          source: { type: graphql.GraphQLString },
          duration: { type: graphql.GraphQLInt },
          repeats: { type: graphql.GraphQLBoolean },
          location: { type: graphql.GraphQLString },
          status: { type: graphql.GraphQLString },
        },
        resolve: async (parent, args, context, resolveInfo) => {
          const { tags, ...restArgs } = args;
          const keyString = Object.keys(restArgs).map(arg => {
              return arg === 'type' || arg === 'status' ? `${arg}_id` : arg
          }).toString();
          const valuesString = Object.keys(restArgs).map((arg, i) => `$${i + 1}`).toString();
          let tagIds, entry;
          if (tags) {
            // If entry has tags, check which ones exist
            tagIds = await Promise.all(tags.map(async (tag) => {
              try {
                const result = await client.query(`SELECT * FROM tag WHERE name = '${tag}' LIMIT 1`);
                return { [tag]: result.rows.length > 0 ? result.rows[0].id : null };
              } catch {
                throw new Error("Failed to fetch tags");
              }
            }));
            // If a tag doesn't exist, create it
            tagIds = await Promise.all(tagIds.map(async (tag) => {
              const [name, id] = Object.entries(tag)[0];
              if (!id) {
                try {
                  const result = await client.query(`INSERT INTO tag (name) VALUES ($1) RETURNING id`, [name]);
                  return result.rows[0].id;
                } catch {
                  throw new Error(`Failed to create ${name} tag`);
                }
              }
              return id;
            }));
          }
          // Insert the entry
          try {
            console.log(`INSERT INTO entry (${keyString}) VALUES (${valuesString}) RETURNING *`);
            const result = await client.query(`INSERT INTO entry (${keyString}) VALUES (${valuesString}) RETURNING *`, Object.values(restArgs).map(arg => {
              return arg === 'type' || arg === 'status' ? +arg : arg
            }))
            entry = result.rows[0];
          } catch (err) {
            console.log(err);
            throw new Error("Failed to create entry")
          }
          // Insert the entry tag relations
          await Promise.all(tagIds.map(async tag_id => {
            try {
              await client.query(`INSERT INTO tags (entry_id, tag_id) VALUES ($1, $2)`, [entry.id, tag_id]);
            } catch (err) {
              console.log(err);
              throw new Error("Failed to attach tags to entry")
            }
          }));
          // Return the entry details
          return entry;
        }
      },
    })
  })
}

module.exports = client => createMutationRoot(client);