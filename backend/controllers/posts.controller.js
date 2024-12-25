import Post from "../models/posts.model.js";
import User from "../models/user.model.js";

//CREATE

export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save(); // Save the new post to the database
    const post = await Post.find(); //find all posts
    res.status(201).json(post); // 201 Created
  } catch (error) {
    res.status(409).json({ error: error.message }); // 409 Conflict
  }
};

//READ

export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find(); //find all posts
    res.status(200).json(posts); // 200 OK
  } catch (error) {
    res.status(404).json({ error: error.message }); // 404 Not Found
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ userId }); //find all posts of a specific user
  } catch (error) {}
};

//UPDATE

export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId); // Check if the user has already liked the post
    if (isLiked) {
      post.likes.delete(userId); // Unlike the post
    } else {
      post.likes.set(userId, true); // Like the post
    }
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true } // Return the updated post
    ); // Update the post with the new likes
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
