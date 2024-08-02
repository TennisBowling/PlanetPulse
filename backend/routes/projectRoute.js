import express from "express";
import { User } from "../models/user.js";
import Fuse from "fuse.js";

const router = express.Router();

router.post("/donate", async (req, res) => {
    // donate to a post
    try {
        if (!req.body.post_title) {
            return res.status(400).send({ message: "post_title is required" });
        }

        let users = await User.find();
        let posts = [];
        users.forEach((user) => {
            posts = posts.concat(user.posts);
        });

        let post = posts.find((post) => post.title === req.body.post_title);
        if (!post) {
            return res.status(400).send({ message: "Post not found" });
        }

        if (post.donors.includes(req.user.username)) {
            return res
                .status(400)
                .send({ message: "User is already donating for this post" });
        }

        let user = await User.findOne({ username: post.username });
        user.set({
            posts: user.posts.map((p) =>
                p.title === req.body.post_title
                    ? { ...p, donors: p.donors.concat(req.user.username) }
                    : p,
            ),
        }); // same logic as volunteering
        user.set({
            posts: user.posts.map((p) =>
                p.title === req.body.post_title
                    ? { ...p, numDonors: p.numDonors + 1 }
                    : p,
            ),
        }); // same logic as volunteering
        await user.save();

        return res.status(200).send("Donated successfully");
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
});

router.get("/get_user_posts", async (req, res) => {
    // get all posts of a user
    try {
        var userId = req.user._id;
        if (req.body.user_id != undefined) {
            userId = req.body.user_id;
        }

        const user = await User.findById(userId);
        return res.status(200).send(user.posts);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
});

router.post("/delete_post", async (req, res) => {
    // delete a post
    try {
        if (!req.body.post_title) {
            return res.status(400).send({ message: "post_title is required" });
        }

        let users = await User.find();
        let posts = [];
        users.forEach((user) => {
            posts = posts.concat(user.posts);
        });

        let post = posts.find((post) => post.title === req.body.post_title); // find post by title
        if (!post) {
            return res.status(400).send({ message: "Post not found" });
        }

        let user = await User.findOne({ username: post.username });
        user.set({
            posts: user.posts.filter((p) => p.title !== req.body.post_title),
        }); // keep every post except for the one with the same title as the passed in title
        await user.save();

        return res.status(200).send("Post deleted successfully");
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
});

router.get("/get_all_posts", async (req, res) => {
    // get all posts
    try {
        let users = await User.find();
        let posts = [];
        users.forEach((user) => {
            posts = posts.concat(user.posts); // add all posts to the posts array
        });

        // if the search query is sent filter posts
        if (req.body.search_query) {
            // ignore this, this is, will never be used in our code but kept in for future's sake
            const options = {
                keys: ["title"],
                includeScore: true,
            };
            const fuse = new Fuse(posts, options);
            const result = fuse.search(req.body.search_query);
            posts = result.map(({ item }) => item);
        }

        return res.status(200).send(posts); // return all posts
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
});

router.post("/search_posts", async (req, res) => {
    // search posts using fuzzy searching library fuse
    try {
        let users = await User.find();
        let posts = [];
        users.forEach((user) => {
            posts = posts.concat(user.posts);
        });

        const options = {
            keys: ["title", "text"],
            includeScore: true,
        };
        const fuse = new Fuse(posts, options);
        const result = fuse.search(req.body.search_query); // use fuse with options to search
        for (let i = 0; i < result.length; i++) {
            if (result[i].score > 0.3) {
                // filter out things not similar enough
                result.splice(i, 1);
                i--;
            }
        }

        posts = result.map(({ item }) => item);
        return res.status(200).send(posts);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
});

router.post("/get_post", async (req, res) => {
    // get a post using the title
    try {
        if (!req.body.post_title) {
            return res.status(400).send({ message: "post_title is required" });
        }

        let users = await User.find();
        let posts = [];
        users.forEach((user) => {
            posts = posts.concat(user.posts);
        });

        let post = posts.find((post) => post.title === req.body.post_title); // find post by title
        if (!post) {
            return res.status(400).send({ message: "Post not found" });
        }

        return res.status(200).send(post);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
});

// social posts

router.get("/get_user_social_posts", async (req, res) => {
    // get all social posts of a user
    try {
        var userId = req.user._id;
        if (req.body.user_id != undefined) {
            userId = req.body.user_id;
        }

        const user = await User.findById(userId);
        return res.status(200).send(user.socialPosts);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
});

router.post("/delete_social_post", async (req, res) => {
    // delete a social post
    try {
        if (!req.body.post_title) {
            return res.status(400).send({ message: "post_title is required" });
        }

        // I don't think we really need this, its just to confirm that the post is found and it's quite inneficient.
        let users = await User.find();
        let posts = [];
        users.forEach((user) => {
            posts = posts.concat(user.socialPosts);
        });

        let post = posts.find((post) => post.title === req.body.post_title); // find post by title
        if (!post) {
            return res.status(400).send({ message: "Social Post not found" });
        }

        let user = await User.findOne({ username: post.username });
        user.set({
            socialPosts: user.socialPosts.filter(
                (p) => p.title !== req.body.post_title,
            ),
        }); // keep every post except for the one with the same title as the passed in title
        await user.save();

        return res.status(200).send("Social Post deleted successfully");
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
});

router.get("/get_all_social_posts", async (req, res) => {
    // get all posts
    try {
        let users = await User.find();
        let posts = [];
        users.forEach((user) => {
            posts = posts.concat(user.socialPosts); // add all posts to the posts array
        });

        // if the search query is sent filter posts
        if (req.body.search_query) {
            // ignore this, this is, will never be used in our code but kept in for future's sake
            const options = {
                keys: ["title"],
                includeScore: true,
            };
            const fuse = new Fuse(posts, options);
            const result = fuse.search(req.body.search_query);
            posts = result.map(({ item }) => item);
        }

        return res.status(200).send(posts); // return all posts
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
});

router.post("/search_social_posts", async (req, res) => {
    // search posts using fuzzy searching library fuse
    try {
        let users = await User.find();
        let posts = [];
        users.forEach((user) => {
            posts = posts.concat(user.socialPosts);
        });

        const options = {
            keys: ["title", "text"],
            includeScore: true,
        };
        const fuse = new Fuse(posts, options);
        const result = fuse.search(req.body.search_query); // use fuse with options to search
        for (let i = 0; i < result.length; i++) {
            if (result[i].score > 0.3) {
                // filter out things not similar enough
                result.splice(i, 1);
                i--;
            }
        }

        posts = result.map(({ item }) => item);
        return res.status(200).send(posts);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
});

router.post("/get_social_post", async (req, res) => {
    // get a post using the title
    try {
        if (!req.body.post_title) {
            return res.status(400).send({ message: "post_title is required" });
        }

        let users = await User.find();
        let posts = [];
        users.forEach((user) => {
            posts = posts.concat(user.socialPosts);
        });

        let post = posts.find((post) => post.title === req.body.post_title); // find post by title
        if (!post) {
            return res.status(400).send({ message: "Social Post not found" });
        }

        return res.status(200).send(post);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
});



export default router;
