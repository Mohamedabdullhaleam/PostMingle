import { useState } from "react";
import api from "../api/axios";
import { toast } from "sonner";

interface PostData {
  title: string;
  content: string;
  image?: string;
}

const usePost = () => {
  const [isCreating, setIsCreating] = useState(false);

  const createPost = async (postData: PostData) => {
    try {
      setIsCreating(true);
      const response = await api.post("/posts", postData);

      if (response.status < 200 || response.status >= 300) {
        throw new Error("Failed to create post");
      }

      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error creating post");
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  return { createPost, isCreating };
};

export default usePost;
