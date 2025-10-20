import Blog from '../models/blogModel.js';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

export const createBlog = async (req, res) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    // Verify JWT
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { title, category, content, image } = req.body;

    if (!title || !category || !content) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newBlog = new Blog({
      title,
      category,
      content,
      image,
      author: user.name,
      userId: user._id,
    });

    const savedBlog = await newBlog.save();

    return res.status(201).json({
      message: "Blog created successfully",
      blog: savedBlog,
    });
  } catch (error) {
    console.error("Error in createBlog:", error.message);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};


export const getAllBlogs = async (req, res) => {
    try{
        const {category, author} = req.query;
        const filter = {};

        if(category) filter.category = category;
        if(author) filter.author = author;

        const blogs = await Blog.find(filter).sort({createdAt: -1});
        res.status(200).json(blogs);

    }catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// In blogController.js
export const getMyBlogs = async (req, res) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const blogs = await Blog.find({ userId: decoded.id }).sort({ createdAt: -1 });

    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user blogs", error: error.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Only the owner can update
    if (blog.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only update your own blogs" });
    }

    const { title, category, content, image } = req.body;

    if (title) blog.title = title;
    if (category) blog.category = category;
    if (content) blog.content = content;
    if (image) blog.image = image;

    blog.updatedAt = Date.now();

    const updatedBlog = await blog.save();

    return res.status(200).json({ message: "Blog updated successfully", blog: updatedBlog });
  } catch (error) {
    console.error("Update blog error:", error.message);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const deleteBlog = async (req, res) => {
    try{
        const blog = await Blog.findById(req.params.id);
        if(!blog) return res.status(404).json({ message: "Blog not found" });

        if(blog.userId.toString() !== req.user.id)
            return res.status(403).json({ message: "Unauthorized" });

        await blog.deleteOne();
    }catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
