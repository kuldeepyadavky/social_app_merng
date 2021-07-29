const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const gql = require('graphql-tag');

const { MONGOURI } = require('./config.js');
const Post = require('./models/Post');
const User = require('./models/User');

const typeDefs = gql`
	type Post {
		id: ID!
		body: String!
		createdAt: String!
		username: String!
	}
	type Query {
		getPosts: [Post]
	}
`;

const resolvers = {
	Query: {
		async getPosts() {
			try {
				const posts = await Post.find();
				return posts;
			} catch (err) {
				throw new Error(err);
			}
		},
	},
};

const server = new ApolloServer({
	typeDefs,
	resolvers,
});

mongoose
	.connect(MONGOURI, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('Database Connected');
		return server.listen({ port: 5000 });
	})
	.then((res) => {
		console.log(`Server running at ${res.url}`);
	});
