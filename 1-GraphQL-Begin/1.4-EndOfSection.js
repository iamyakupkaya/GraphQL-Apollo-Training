const { ApolloServer, gql } = require("apollo-server");
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");

const { users, posts, comments } = require("./DB-1.1-UsersDB");

const typeDefs = gql`
  type User {
    id: ID!
    fullName: String!
    posts: [Post]
  }
  type Post {
    id: ID!
    title: String!
    user_id: String!
    comments: [Comment]
  }
  type Comment {
    id: ID!
    text: String!
    post_id: String!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    posts: [Post!]!
    post(id: ID!): Post
    comments: [Comment!]!
    comment(id: ID!): Comment
  }
`;

const resolvers = {
  Query: {
    //USER
    users: () => users,
    user: (parent, args) => users.find((user) => user.id === args.id),
    //POST
    posts: () => posts,
    post: (parent, args) => posts.find((post) => post.id === args.id),
    //POST
    comments: () => comments,
    comment: (parent, args) =>
      comments.find((comment) => comment.id === args.id),
  },
  User: {
    posts: (parent, args) => {
      console.log("Parent User-posts", parent);
      return posts.filter((post) => post.user_id === parent.id);
    },
  },
  Post: {
    comments: (parent) => {
      console.log("Parent Post-comments", parent);
      return comments.filter((comment) => comment.post_id === parent.id);
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
