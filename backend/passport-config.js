import local from "passport-local";
import bcrypt from "bcrypt";
import { User } from "./models/user.js";
const LocalStrategy = local.Strategy;
// Creates a template for user using passport, a library/middleware that authenticates users and saves login information in a session in cookies
const initialize = (passport) => {
	const authenticateUser = async (username, password, done) => {
		const user = await User.findOne({ username: username.toLowerCase() });
		if (user == null) {
			return done(null, false, { message: "Username or Password Incorrect!" });
		}

		try {
			if (await bcrypt.compare(password, user.password)) {
				return done(null, user);
			} else {
				return done(null, false, {
					message: "Username or Password Incorrect!",
				});
			}
		} catch (e) {
			return done(e);
		}
	};

	passport.use(
		new LocalStrategy({ usernameField: "username" }, authenticateUser)
	);
	passport.serializeUser((user, done) => done(null, user.id));
	passport.deserializeUser(async (id, done) => {
		const user = await User.findOne({ _id: id });
		return done(null, user);
	});
};

export default initialize;
