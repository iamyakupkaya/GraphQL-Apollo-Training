const { ApolloServer, gql } = require("apollo-server");
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");

const infoAuthor = {
  id: "454kaka55",
  name: "Yakup",
  surname: "KAYA",
  age: 27,
  books: [
    //bir yazarın birden fazla kitabı olabilir
    {
      name: "Test",
      pageNum: 145,
      score: 9.5,
      isPublished: true,
    },
    {
      name: "Deneme",
      pageNum: 255,
      score: 5,
      isPublished: false,
    },
  ],
};

const infoBook = [
  {
    name: "Test",
    pageNum: 145,
    score: 9.5,
    isPublished: true,
    author: infoAuthor,
  },
];

const typeDefs = gql`
  type Book {
    name: String
    pageNum: Int
    score: Float
    isPublished: Boolean
    author: Author
  }
  type Author {
    id: ID
    name: String
    surname: String
    age: Int
    books: [Book!]
  }
  type Query {
    book: [Book]
    author: Author
  }
`;

const resolvers = {
  Query: {
    book: () => {
      return infoBook;
    },
    author: () => infoAuthor,
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
