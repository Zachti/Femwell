import { create } from "zustand";
import { Post } from "../models";
import { Comment } from "../models";

type State = {
  posts: Post[];
  queryType: string;
  prevQueryType: string;
  createPost: (post: Post) => void;
  editPost: (postId: string, content: string, imageUrl: string) => void;
  deletePost: (postId: string) => void;
  createComment: (comment: Comment, postId: string) => void;
  deleteComment: (comment: Comment, postId: string) => void;
  setPosts: (posts: Post[]) => void;
  setPostsQuery: (queryType: string) => void;
  setPrevPostsQuery: (queryType: string) => void;
};

const usePostStore = create<State>((set) => ({
  posts: [],
  queryType: "",
  prevQueryType: "",
  createPost: (post) =>
    set((state) => ({ ...state, posts: [post, ...state.posts] })),
  editPost: (postId, content, imageUrl) =>
    set((state) => ({
      ...state,
      posts: state.posts.map((post) =>
        post.id === postId ? { ...post, content, imageUrl } : post,
      ),
    })),
  deletePost: (postId) =>
    set((state) => ({
      ...state,
      posts: state.posts.filter((p) => p.id !== postId),
    })),
  createComment: (comment, postId) =>
    set((state) => ({
      ...state,
      posts: state.posts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, comment] }
          : post,
      ),
    })),
  deleteComment: (comment, postId) =>
    set((state) => ({
      ...state,
      posts: state.posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments.filter((c) => c.id !== comment.id),
            }
          : post,
      ),
    })),
  setPosts: (posts) => set((state) => ({ ...state, posts })),
  setPostsQuery: (queryType) => set((state) => ({ ...state, queryType })),
  setPrevPostsQuery: (prevQueryType) =>
    set((state) => ({ ...state, prevQueryType })),
}));

export default usePostStore;
