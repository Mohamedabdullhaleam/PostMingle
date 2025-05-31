import React, { useState, useCallback } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useFormik } from "formik";
import * as Yup from "yup";
import usePost from "../hooks/usePost";
import useFileUpload from "../hooks/useFileUpload";
import { usePosts } from "@/contexts/PostContext";
import { useAuth } from "@/contexts/AuthContext";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .required("Title is required")
    .max(100, "Title must be 100 characters or less"),
  content: Yup.string()
    .required("Content is required")
    .max(5000, "Content must be 5000 characters or less"),
});

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onPostCreated,
}) => {
  const { addPost } = usePosts();
  const { user } = useAuth();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { uploadFile, isUploading } = useFileUpload();
  const { createPost, isCreating } = usePost();

  const formik = useFormik({
    initialValues: {
      title: "",
      content: "",
      image: null as File | null,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        let imageUrl = "";

        if (values.image) {
          imageUrl = await uploadFile(values.image);
          if (!imageUrl) return;
        }

        // Create post and get the response
        const response = await createPost({
          title: values.title,
          content: values.content,
          image: imageUrl,
        });

        // Add new post to context for immediate UI update
        if (response && response.data) {
          addPost({
            ...response.data,
            user: {
              _id: user?.id || "",
              username: user?.username || "You",
              email: user?.email || "",
            },
            likes: [],
            comments: [],
            isLiked: false,
            createdAt: new Date().toISOString(),
          });
        }

        toast.success("Post created successfully!");
        onPostCreated?.();
        handleModalClose();
      } catch (error: any) {
        toast.error(error.message || "Error creating post");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setImagePreview(URL.createObjectURL(file));
      formik.setFieldValue("image", file);
    },
    [formik]
  );

  const removeImage = useCallback(() => {
    setImagePreview(null);
    formik.setFieldValue("image", null);

    const fileInput = document.getElementById(
      "image-upload"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  }, [formik]);

  const handleModalClose = useCallback(() => {
    formik.resetForm();
    setImagePreview(null);
    onClose();
  }, [formik, onClose]);

  const isSubmitting = formik.isSubmitting || isCreating || isUploading;

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-text-color">
            Create New Post
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-text-color font-medium">
              Title *
            </Label>
            <Input
              id="title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your post title..."
              className="border-light-color focus:border-main-color"
            />
            {formik.touched.title && formik.errors.title && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.title}</p>
            )}
          </div>

          {/* Image Upload Field */}
          <div className="space-y-2">
            <Label className="text-text-color font-medium">
              Cover Image (Optional)
            </Label>

            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg border border-light-color"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white shadow-sm"
                  disabled={isSubmitting}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-light-color rounded-lg p-8">
                <Upload className="w-8 h-8 text-light-color mb-3" />
                <p className="text-light-color mb-3">
                  Drag & drop an image or click to upload
                </p>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  disabled={isSubmitting}
                >
                  <Label htmlFor="image-upload" className="cursor-pointer">
                    Select Image
                  </Label>
                </Button>
                <p className="text-xs text-light-color mt-2">
                  Max 5MB - JPG, PNG, GIF
                </p>
              </div>
            )}

            {isUploading && (
              <div className="flex items-center mt-2">
                <Loader2 className="w-4 h-4 mr-2 animate-spin text-main-color" />
                <span className="text-light-color">Uploading image...</span>
              </div>
            )}
          </div>

          {/* Content Field */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-text-color font-medium">
              Content *
            </Label>
            <Textarea
              id="content"
              name="content"
              value={formik.values.content}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Write your post content..."
              className="min-h-[200px] border-light-color focus:border-main-color resize-none"
            />
            {formik.touched.content && formik.errors.content && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.content}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 cursor-pointer">
            <Button
              type="button"
              className="cursor-pointer"
              variant="outline"
              onClick={handleModalClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-btn-color hover:bg-sec-color cursor-pointer text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Publishing...
                </>
              ) : (
                "Publish Post"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;
