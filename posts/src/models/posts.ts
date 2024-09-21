import mongoose from "mongoose";

export interface Post {
  title: string;
  content: string;
}

const postSchema = new mongoose.Schema<Post>({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

//also check if the model already exists
const PostModel = mongoose.models.Post || mongoose.model("Post", postSchema);
export default PostModel;
