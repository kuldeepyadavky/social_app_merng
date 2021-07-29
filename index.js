const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const gql = require('graphql-tag');

const { MONGOURI } = require('./config.js');

const typeDefs = gql`
	type Query {
		sayHi: String!
	}
`;

const resolvers = {
	Query: {
		sayHi: () => {
			'Hello World !';
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
