const { ApolloServer, gql } = require("apollo-server");
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");

const { users, posts, comments } = require("./Two-GraphQL-Mutations/data");

const typeDefs = gql`
  type User {
    id: ID!
    fullName: String!
    age: Int!
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
  type DeleteAllOutput {
    count: Int!
  }
  #input USER
  input createInputUser {
    fullName: String!
    age: Int!
  }
  input updateInputUser {
    #kullanıcı her ikisini de girmek zorunda DEĞİlDİR. Belki sadece birini güncellemek istiyordur.
    fullName: String
    age: Int
  }
  input deleteUser {
    fullName: String
    age: Int
  }
  # Input POST
  input createInputPost {
    title: String!
    user_id: String!
  }
  input updateInputPost {
    title: String
    user_id: String
  }
  input deleteInputPost {
    title: String
    user_id: String
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
    #USER
    createUser(data: createInputUser!): User! # burada kullanıcıya eklenen User ı User tipinde göstereceğiz.
    updateUser(id: ID!, data: updateInputUser!): User! #ne olursa olsun bize bir data objesi dönmeli ama için boş olabilir.
    deleteUser(id: ID!): User!
    deleteAllUsers: DeleteAllOutput!

    #POST
    createPost(data: createInputPost!): Post!
    updatePost(id: ID!, data: updateInputPost!): Post!
    deletePost(id: ID!): Post!
    deleteAllPosts: DeleteAllOutput!
  }
`;

const resolvers = {
  Mutation: {
    //USER
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
    updateUser: (parent, { id, data }) => {
      const userIndex = users.findIndex((user) => user.id === id);
      if (userIndex < 0) {
        throw new Error("User Could not Found..!");
      }
      return (users[userIndex] = { ...users[userIndex], ...data });
    },
    deleteUser: (parent, { id }) => {
      const userIndex = users.findIndex((user) => user.id === id);
      if (userIndex < 0) {
        throw new Error("There is no User to delete..!");
      }
      const deletedUser = users[userIndex];
      users.splice(userIndex, 1);
      return deletedUser; // in specific index delete just one
    },
    deleteAllUsers: () => {
      const count = users.length;
      users.splice(0, count);
      return {
        count,
      };
    },
    //args bize obje olarak döndüğü için onu object destructiring yöntemi ile direkt fieldlarını alabilirim.
    //POST
    createPost: (parent, { id }) => {
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
    updatePost: (parent, { id, data }) => {
      const postIndex = posts.findIndex((post) => post.id === id);
      if (postIndex < 0) {
        throw new Error("Post Could not Found..!");
      }
      return (posts[postIndex] = { ...posts[postIndex], ...data });
    },
    deletePost: (parent, { id }) => {
      const postIndex = posts.findIndex((post) => post.id === id);
      if (postIndex < 0) {
        throw new Error("There is no Post to delete..!");
      }
      const deletedPost = posts[postIndex];
      posts.splice(postIndex, 1); //bu silinen elementi bi array içerisinde döner yani döner..!
      return deletedPost; // in specific index delete just one
    },
    deleteAllPosts: () => {
      const count = posts.length;
      posts.splice(0, count);
      return {
        count,
      };
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
