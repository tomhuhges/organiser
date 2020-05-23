const graphql = require('graphql')
const graphqlIsoDate = require('graphql-iso-date')

const Entry = new graphql.GraphQLObjectType({
  name: 'Entry',
  fields: () => ({
    id: { type: graphql.GraphQLInt },
    title: { type: graphql.GraphQLString },
    date: { type: graphqlIsoDate.GraphQLDateTime },
    body: { type: graphql.GraphQLString },
    link: { type: graphql.GraphQLString },
    type: {
      type: Type,
      sqlJoin: (entryTable, typeTable) => `${typeTable}.id = ${entryTable}.type_id`
    },
    tags: {
      type: graphql.GraphQLList(Tags),
      sqlJoin: (entryTable, tagsTable) => `${tagsTable}.entry_id = ${entryTable}.id`
    },
    image: { type: graphql.GraphQLString },
    subtitle: { type: graphql.GraphQLString },
    source: { type: graphql.GraphQLString },
    duration: { type: graphql.GraphQLInt },
    repeats: { type: graphql.GraphQLBoolean },
    location: { type: graphql.GraphQLString },
    status: {
      type: Status,
      sqlJoin: (entryTable, statusTable) => `${statusTable}.id = ${entryTable}.status_id`
    }
  })
});

Entry._typeConfig = {
  sqlTable: 'entry',
  uniqueKey: 'id',
}

var Type = new graphql.GraphQLObjectType({
  name: 'Type',
  fields: () => ({
    id: { type: graphql.GraphQLInt },
    name: { type: graphql.GraphQLString },
    entries: {
      type: graphql.GraphQLList(Entry),
      sqlJoin: (typeTable, entryTable) => `${typeTable}.id = ${entryTable}.type_id`
    }
  })
})

Type._typeConfig = {
  sqlTable: 'type',
  uniqueKey: 'id'
}

var Tag = new graphql.GraphQLObjectType({
  name: 'Tag',
  fields: () => ({
    id: { type: graphql.GraphQLInt },
    name: { type: graphql.GraphQLString },
    entries: {
      type: graphql.GraphQLList(Entry),
      sqlJoin: (tagTable, entryTable) => `${tagTable}.id = ${entryTable}.tag_id`
    }
  })
})

Tag._typeConfig = {
  sqlTable: 'tag',
  uniqueKey: 'id'
}

var Tags = new graphql.GraphQLObjectType({
  name: 'Tags',
  fields: () => ({
    id: { type: graphql.GraphQLInt },
    entry: {
      type: Entry,
      sqlJoin: (tagsTable, entryTable) => `${tagsTable}.entry_id = ${entryTable}.id`
    },
    tag: {
      type: Tag,
      sqlJoin: (tagsTable, tagTable) => `${tagsTable}.tag_id = ${tagsTable}.id`
    },
  })
})

Tags._typeConfig = {
  sqlTable: 'tags',
  uniqueKey: 'id'
}

var Status = new graphql.GraphQLObjectType({
  name: 'Status',
  fields: () => ({
    id: { type: graphql.GraphQLInt },
    name: { type: graphql.GraphQLString },
    entries: {
      type: graphql.GraphQLList(Entry),
      sqlJoin: (statusTable, entryTable) => `${statusTable}.id = ${entryTable}.type_id`
    }
  })
})

Status._typeConfig = {
  sqlTable: 'status',
  uniqueKey: 'id'
}

module.exports = {
  Entry,
  Type,
  Tag,
  Tags,
  Status
}