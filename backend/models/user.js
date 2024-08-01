import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		posts: {
			type: Array,
			required: true,
		}
	},
	{
		timestamps: true,
	}
);

export const User = mongoose.model("User", userSchema);