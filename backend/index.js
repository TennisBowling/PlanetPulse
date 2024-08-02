import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import { PORT, MONGO_URL, SESSION_SECRET } from "./config.js";
import flash from "express-flash";
import session from "express-session";
import passport from "passport";
import bcrypt from "bcrypt";
import initializePassport from "./passport-config.js";
import { User } from "./models/user.js";

const app = express(); // create an express app
initializePassport(passport);
app.use(express.urlencoded({ extended: false })); // parse url-encoded data
app.use(flash()); // flash messages
app.use( // session middleware
	session({
		secret: SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
	})
);

app.use(cors({
	origin: 'https://planetpulse.tennisbowling.com',
	methods: "GET, POST, PUT, DELETE",
	credentials: true,
}));


app.use(express.json()); // parse json data
app.use(passport.initialize()); // passport middleware
app.use(passport.session()); // passport middleware

import router from "./routes/projectRoute.js";
app.use('/projects', router); // use the router for all routes starting with /projects

app.get("/", async (req, res) => { // send the authenticated status of the user
	return res.status(200).send({ authenticated: req.isAuthenticated() });
});


app.get("/get_user", async (req, res) => { // send the user object
	if (checkNotAuthenticated) {
		return res.status(200).send({ user: req.user });
	}
});

app.post("/like_social_post", async (req, res) => { // like a socialpost
    try {
        if (!req.body.post_title) {
            return res.status(400).send({ message: "post_title is required" });
        }

        let users = await User.find();
        let posts = [];
        users.forEach(user => {
            posts = posts.concat(user.socialPosts);
        });

        let post = posts.find(post => post.title === req.body.post_title);
        if (!post) {
            return res.status(400).send({ message: "Post not found" });
        }

        // todo: move this to index.js and figure out what to do instead of .includes
        if (post.likes.includes(req.user.username)) {
            return res.status(400).send({ message: "User already likes this post" });
        }

        let user = await User.findOne({ username: post.username });
        user.set({ socialPosts: user.socialPosts.map(p => p.title === req.body.post_title ? { ...p, likes: p.likes.concat(req.user.username) } : p) });
        await user.save();

        return res.status(200).send("Liked successfully");

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
});

app.post("/volunteer", async (req, res) => { // volunteer for a post
    try {
        if (!req.body.post_title) {
            return res.status(400).send({ message: "post_title is required" });
        }

        let users = await User.find();
        let posts = [];
        users.forEach(user => {
            posts = posts.concat(user.posts); // add the post to the posts array
        });

        let post = posts.find(post => post.title === req.body.post_title);
        if (!post) {
            return res.status(400).send({ message: "Post not found" });
        }

        if (post.volunteers.includes(req.user.username)) {
            return res.status(400).send({ message: "User is already volunteering for this post" });
        }

        let user = await User.findOne({ username: post.username })
        user.set({ posts: user.posts.map(p => p.title === req.body.post_title ? { ...p, volunteers: p.volunteers.concat(req.user.username) } : p) }); // add the user to the volunteers list in the post
        user.set({ posts: user.posts.map(p => p.title === req.body.post_title ? { ...p, numVolunteers: p.numVolunteers + 1 } : p) }); // add 1 to the number of volunteers in the post
        await user.save()

        return res.status(200).send("Volunteered successfully");

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
});

app.post("/create_post", async (req, res) => { // create a post
    try {
        if ( // check if all required fields are sent
            !req.body.post.title || !req.body.post.text || req.body.post.isVolunteer == undefined || req.body.post.isFundraiser == undefined 
        ) {
            return res.status(400).send({
                message: 'Send all required fields: post, post.title, post.text, post.isVolunteer, post.isFundraiser'
            });
        }

        var newPost = req.body.post;
        newPost.username = req.user.username;
        newPost.volunteers = [];
        newPost.donors = [];
        newPost.numVolunteers = 0;
        newPost.numDonors = 0;

        if(newPost.isVolunteer == "true") { // convert from string to boolean, something within js is broken and randomly decides to send "true" instead of true and "false" instead of false
            newPost.isVolunteer = true;
        } if(newPost.isVolunteer == "false"){
            newPost.isVolunteer = false;
        }
        if(newPost.isFundraiser == "true") {
            newPost.isFundraiser = true;
        } if(newPost.isFundraiser == "false") {
            newPost.isFundraiser = false;
        }

        const userId = req.user._id;
        let user = await User.findById(userId); // find the user based on their id
        user.set({ posts: user.posts.concat(newPost) }); // add the new post to the user's posts
        await user.save();


        return res.status(201).send("Post created successfully");
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
});

app.post("/user_status", async (req, res) => { // get user status for a post (if volunteering and if donating)
	
    try {

        if (!req.body.post_title) {
            return res.status(400).send({ message: "post_title is required" });
        }

        let users = await User.find();
        let posts = [];
        users.forEach(user => {
            posts = posts.concat(user.posts);
        });

        let post = posts.find(post => post.title === req.body.post_title)
        if (!post) {
            return res.status(400).send({ message: "Post not found" });
        }

        let donating = false;
        let volunteering = false;
        if (post.donors.includes(req.user.username)) { // check if list of donors includes user's username
            donating = true;
        }
        if (post.volunteers.includes(req.user.username)) { // same logic as for donors
            volunteering = true;
        }
        
        return res.status(200).send({ "donating": donating, "volunteering": volunteering });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
});

app.post("/create_social_post", async (req, res) => {
    try {
        if ( // check if all required fields are sent
            !req.body.post.title || !req.body.post.text
        ) {
            return res.status(400).send({
                message: 'Send all required fields: post, post.title, post.text'
            });
        }

        if (!req.body.post.image) {
            req.body.post.image = "https://cdn.tennisbowling.com/hLSUfRvOqjopxuGT-LqxsXwYukIBpkgroQDJKpV4.jpg";
        }

        var newPost = req.body.post;
        newPost.username = req.user.username;
        newPost.likes = [];
        newPost.comments = [];

        const userId = req.user._id;
        let user = await User.findById(userId); 
        user.set({ socialPosts: user.socialPosts.concat(newPost) }); // add the new socialpost to the user's socialposts
        await user.save();


        return res.status(201).send("Social Post created successfully");
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
});

app.post( // login route
	"/login",
	checkNotAuthenticated,
	// knows because told field name in config
	passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/login",
		failureFlash: true,
	})
);
app.get("/login", checkNotAuthenticated, async (req, res) => { // send the authenticated status of the user
	const flashData = req.flash();
	if (flashData.error) {
		return res.status(400).send({ message: flashData.error[0] });
	}
	return res.status(200).send({ authenticated: false });
});

app.post("/register", async (req, res) => { // register route to create an account
	try {
		// Check if the user username already exists in the database
		if (await User.exists({ username: req.body.username.toLowerCase() })) {
			return res.status(400).send({
				message: "This username is already in use.",
			});
		} else if (!req.body.username || !req.body.password) {
			return res.status(400).send({
				message: "Send all required fields.",
			});
		}
		// Hash the user's password before storing it in the database
		var hashedPassword = await bcrypt.hash(req.body.password, 10);
		const newUser = {
			username: req.body.username.toLowerCase(),
			password: hashedPassword,
			posts: [],
			socialPosts: [],
		};
		// Create a new user record in the database
		const user = await User.create(newUser);
		req.logIn(user, function (err) {
			if (err) {
				return res.status(500).send({ message: "Error logging out." });
			}
			return res.status(200).redirect("/");
		});

	} catch (error) {
		console.log(error.message);
		res.status(500).send({ message: error.message });
	}
});

app.delete("/logout", (req, res) => { // logout route
	req.logOut(function (err) {
		if (err) {
			return res.status(500).send({ message: "Error logging out." });
		}
		return res.redirect(303, "/");
	});
});

function checkNotAuthenticated(req, res, next) { // middleware to check if the user is not authenticated
	if (req.isAuthenticated()) {
		return res.status(200).redirect("/");
	}
	next();
}

mongoose // connect to the MongoDB database
	.connect(MONGO_URL)
	.then(() => {
		console.log("Connected to MongoDB");
		app.listen(PORT, () => {
			console.log(`Server is listening on port ${PORT}`);
		});
	})
	.catch((error) => {
		console.log(error);
	});
