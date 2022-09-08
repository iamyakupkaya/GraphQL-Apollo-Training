const users = [
  {
    id: "1",
    fullName: "Yakup KAYA",
    age: 27,
  },
  {
    id: "2",
    fullName: "Muhammed KAYA",
    age: 26,
  },
];

const posts = [
  {
    id: "1",
    title: "Yakup'un Gönderisi",
    user_id: "1",
  },
  {
    id: "2",
    title: "Muhammed'in Gönderisi",
    user_id: "2",
  },
  {
    id: "3",
    title: "Yakup'un Gönderisi",
    user_id: "1",
  },
];

const comments = [
  {
    id: "1",
    text: "Bu çok güzel bir paylaşım",
    post_id: "1",
  },
  {
    id: "2",
    text: "Bravo! Kaptın bu işi :)",
    post_id: "1",
  },
  {
    id: "3",
    text: "I like it",
    post_id: "2",
  },
  {
    id: "4",
    text: "Congratulations!",
    post_id: "3",
  },
];

module.exports = {
  users,
  posts,
  comments,
};
