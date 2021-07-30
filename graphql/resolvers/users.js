const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { SECRET_KEY } = require('../../config');
const { UserInputError } = require('apollo-server');
const {
	validateRegisterInput,
	validateLoginInput,
} = require('../../utils/validators');

function generateToken(user) {
	return jwt.sign(
		{
			id: user.id,
			email: user.email,
			username: user.password,
		},
		SECRET_KEY,
		{ expiresIn: '1hr' }
	);
}
module.exports = {
	Mutation: {
		async login(_, { username, password }) {
			const { errors, valid } = validateLoginInput(username, password);

			if (!valid) {
				throw new UserInputError('Errors', { errors });
			}

			const user = await User.findOne({ username });

			if (!user) {
				errors.general = 'User not found';
				throw new UserInputError('User not found', { errors });
			}

			const match = await bcrypt.compare(password, user.password);
			if (!match) {
				errors.general = 'Wrong Credentials';
				throw new UserInputError('Wrong Credentials', { errors });
			}
			const token = generateToken(user);
			return {
				...user._doc,
				id: user._id,
				token,
			};
		},
		async register(
			_,
			{ registerInput: { username, email, password, confirmPassword } },
			context,
			info
		) {
			// Validate User
			const { valid, errors } = validateRegisterInput(
				username,
				email,
				password,
				confirmPassword
			);
			if (!valid) {
				throw new UserInputError('Errors', { errors });
			}
			// user already exist
			const user = await User.findOne({ username });
			if (user) {
				throw new UserInputError('Username is taken', {
					errors: {
						username: 'This username is taken',
					},
				});
			}
			// hash password and add auth token
			password = await bcrypt.hash(password, 12);

			const newUser = new User({
				email,
				username,
				password,
				createdAt: new Date().toISOString(),
			});

			const res = await newUser.save();

			const token = generateToken(res);

			return {
				...res._doc,
				id: res._id,
				token,
			};
		},
	},
};
