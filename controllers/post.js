import Post from "../models/posts.js";

export const getPosts = async (req, res) => {
  try {
    const post = await Post.find({});
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    console.log("error in fetching posts:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createPOst = async (req, res) => {
  const post = req.body;

  if (!post.name || !post.posts) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all fields" });
  }

  const newPost = new Post(post);

  try {
    await newPost.save();
    res.status(201).json({ success: true, data: newPost });
  } catch (error) {
    console.error("Error", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;

  const post = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Post Id " });
  }

  try {
    const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true });
    res.status(200).json({ success: true, date: updatedPost });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    await Post.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.log("error in deleting post:", error.message);
    res.status(404).json({ sucess: false, message: "Product not found" });
  }
};