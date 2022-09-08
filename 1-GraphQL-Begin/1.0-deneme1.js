const { ApolloServer, gql } = require("apollo-server");
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");

const typeDefs = gql`
  type Book {
    title: String! #non nullable (null olamaz) bu demek oluyor ki title değeri null olamaz. Tabii burada query sorgusunda
    # title çağırıldığında işe yarar eğer title null ama çağırılmışsa hata verir. Çağırılmamış ise hata vermez
    author: String!
  }
  type Query {
    books: [Book]! # bu da resolvers içerisindeki Query sorgumuzun () => null dönemeyeceği anlamına gelir ama eğer alanlarda...
    #non-nullable -!- işareti yok ve alanlar null olsa da sorun olmaz çünkü fonksiyon null dönmesin yeter.

    #eğer bize dönen Book arrayinin içindeki elemanlar null olamaz demek isityorsak [Book!] dememiz gerekir.
  }
`;

const resolvers = {
  Query: {
    books: () => {
      return [
        {
          title: null,
          author: "Kate Chopin",
        },
        {
          title: "City of Glass",
          author: "Paul Auster",
        },
      ];
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
