const { ApolloServer, gql } = require("apollo-server");
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");

const infoAuthor = [
  {
    id: "1",
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
        name: "Black-Jack",
        pageNum: 255,
        score: 5,
        isPublished: false,
      },
    ],
  },
  {
    id: "2",
    name: "Muhammed",
    surname: "KAYA",
    age: 27,
    books: [
      //bir yazarın birden fazla kitabı olabilir
      {
        name: "King",
        pageNum: 244,
        score: 9.5,
        isPublished: true,
      },
      {
        name: "King Loyal",
        pageNum: 255,
        score: 5,
        isPublished: false,
      },
    ],
  },
];

const infoBook = [
  {
    id: "1",
    name: "Test",
    pageNum: 145,
    score: 9.5,
    isPublished: true,
    author: infoAuthor,
  },
  {
    id: "2",
    name: "Test-2",
    pageNum: 145,
    score: 9.5,
    isPublished: true,
    author: infoAuthor,
  },
  {
    id: "3",
    name: "Test-3",
    pageNum: 145,
    score: 9.5,
    isPublished: true,
    author: infoAuthor,
  },
];

const typeDefs = gql`
  type Books {
    id: ID!
    name: String
    pageNum: Int
    score: Float
    isPublished: Boolean
    author: Authors
  }
  type Authors {
    id: ID!
    name: String
    surname: String
    age: Int
    books: [Books!]
  }

  type Query {
    books: [Books]
    book(id: ID!): Books
    authors: [Authors]
    author(id:ID!): Authors
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
    author: async (parent, args) => {
      //Query schema da ne yazdıysak onu burada aynı isimle kullanmalıyız. book => book, books => books gibi
      // args.id string türünde dönüyor.
      const data = await infoAuthor.find((author) => author.id === args.id);
      return data;
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
