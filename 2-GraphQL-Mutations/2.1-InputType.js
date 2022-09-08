const { ApolloServer, gql } = require("apollo-server");
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");

const { users, posts, comments } = require("./DB-1.1-UsersDB");

const typeDefs = gql`
  type User {
    id: ID!
    fullName: String!
    age:Int!
    posts: [Post]
  }

  type Post {
    id: ID!
    title: String!
    user_id: String!
    comments: [Comment]
    user: User!
  }
  type Comment {
    id: ID!
    text: String!
    post_id: String!
  }
  #inputs
  input createInputUser {
    fullName: String!
    age: Int!
  }
  input createInputPost {
    title: String!
    user_id: String!
  }
  # Main types
  type Query {
    users: [User!]!
    user(id: ID!): User
    posts: [Post!]!
    post(id: ID!): Post
    comments: [Comment!]!
    comment(id: ID!): Comment
  }
  type Mutation {
    # createUser(fullName: String!): Boolean! #hangi tipte geriye veri döneceğini belirtiyoruz. Geriye Boolean tipinde veri dönecek
    createUser(data: createInputUser!): User! # burada kullanıcıya eklenen User ı User tipinde göstereceğiz.
    createPost(data: createInputPost!): Post!
  }
`;

const resolvers = {
  Mutation: {
    createUser: (parent, { data }) => {
      const ID = users.length + 1;
      const addedUser = {
        id: ID,
        ...data, // bu şekilde yaparak data içerisindeki fieldları objeden çıkarabiliriz.
      };
      users.push(addedUser);
      return users.length === ID
        ? addedUser
        : { id: ID, fullName: ` ${fullName} Eklenemedi` };
    },
    //args bize obje olarak döndüğü için onu object destructiring yöntemi ile direkt fieldlarını alabilirim.
    createPost: (parent, { data: { title, user_id } }) => {
      const ID = posts.length + 1;
      const addedPost = {
        id: ID,
        title,
        user_id,
      };
      let totalPosts = posts.push(addedPost);
      return totalPosts === ID
        ? addedPost
        : { id: ID, title: "Post eklenemedi", user_id: "0" };
    },
  },
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
    user: (parent) => {
      console.log(users.find((user) => user.id == parent.user_id));
      return users.find((user) => user.id == parent.user_id);
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
