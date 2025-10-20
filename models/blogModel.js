import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      enum: ["Career", "Finance", "Travel", "Technology", "Health", "Education"],
    },
    author: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    image: {
      type: String,
      default: "",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;