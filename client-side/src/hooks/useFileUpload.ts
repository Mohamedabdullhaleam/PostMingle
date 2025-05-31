import { useState } from "react";
import api from "../api/axios";
import { toast } from "sonner";

const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file: File): Promise<string> => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!response.data?.data?.fileUrl) {
        throw new Error("Invalid response from server");
      }

      return response.data.data.fileUrl;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to upload file");
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFile, isUploading };
};

export default useFileUpload;
