import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		text: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			required: false,
		},
		username: {
			type: String,
			required: true,
		},
		isVolunteer: {
			type: Boolean,
			required: true,
		},
		isFundraiser: {
			type: Boolean,
			required: true,
		},
		volunteers: {
			type: [String],
			required: true,
		},
		donors: {
			type: [String],
			required: true,
		},
		numVolunteers: {
			type: Number,
			required: true,
		},
		numDonors: {
			type: Number,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const commentSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
		},
		text: {
			type: String,
			required: true,
		},
		likes: {
			type: [String],
			required: true,
			default: 0
		}
	},
	{
		timestamps: true,
	}
);

const socialPostSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		text: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			required: true,
		},
		likes: {
			type: [String],
			required: true,
		},
		comments: [commentSchema],
	},
	{
		timestamps: true,
	}
)

export const post = mongoose.model("post", postSchema);
export const socialPost = mongoose.model("socialPost", socialPostSchema);