const { ApolloServer, gql } = require("apollo-server");
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");

const { infoBook, infoAuthor } = require("./data");

const typeDefs = gql`
  type Authors {
    id: ID!
    name: String
    surname: String
    age: Int
    books: [Books]
  }

  type Books {
    id: ID
    name: String
    pageNum: Int
    score: Float
    isPublished: Boolean
    author: Authors
    author_id: String
  }

  type Query {
    books: [Books]
    book(id: ID!): Books
    authors: [Authors]
    author(id: ID!): Authors
  }
`;

const resolvers = {
  Query: {
    books: () => {
      return infoBook;
    },
    book: async (parent, args) => {
      //Query schema da ne yazdıysak onu burada aynı isimle kullanmalıyız. book => book, books => books gibi
      // args.id string türünde dönüyor.
      const data = await infoBook.find((book) => book.id === args.id);
      return data;
    },
    authors: () => infoAuthor,
    author: async (args) => {
      //Query schema da ne yazdıysak onu burada aynı isimle kullanmalıyız. book => book, books => books gibi
      // args.id string türünde dönüyor.
      const data = await infoAuthor.find((author) => author.id === args.id);
      return data;
    },
  },
  Books: {
    author: (parent) => {
      //console.log(parent); Book bilgilerini içerir.
      return infoAuthor.find((author) => author.id === parent.author_id);
    },
  },
  Authors: {
    books: (parent) => {
      console.log(parent);
      return infoBook.filter((book) => {
        console.log("author.id", book.author_id);
        console.log("parent.id", parent.id);
        return book.author_id === parent.id;
      });
    },
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground({
      // options
    }),
  ],
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
