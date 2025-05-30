import React, { useState, useCallback } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../api/axios";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onPostCreated,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();

  const validationSchema = Yup.object({
    title: Yup.string()
      .required("Title is required")
      .max(100, "Title must be 100 characters or less"),
    content: Yup.string()
      .required("Content is required")
      .max(5000, "Content must be 5000 characters or less"),
    image: Yup.string(),
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setImagePreview(URL.createObjectURL(file));
    formik.setFieldValue("image", file);
  };

  const removeImage = () => {
    setImagePreview(null);
    formik.setFieldValue("image", null);
    // Clear file input
    const fileInput = document.getElementById(
      "image-upload"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.data.fileUrl;
    } catch (error) {
      toast.error("Failed to upload image");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

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
          const uploadedUrl = await uploadImage(values.image);
          if (!uploadedUrl) return;
          imageUrl = uploadedUrl;
        }

        // Create post
        const response = await api.post("/posts", {
          title: values.title,
          content: values.content,
          image: imageUrl,
        });

        if (response.status >= 200 && response.status < 300) {
          toast.success("Post created successfully!");
          onPostCreated?.();
          onClose();
          resetForm();
          setImagePreview(null);
        } else {
          throw new Error("Failed to create post");
        }
      } catch (error: any) {
        toast.error(error.message || "Error creating post");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    setImagePreview(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-text-color">
            Create New Post
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Title */}
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

          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-text-color font-medium">
              Cover Image (Optional)
            </Label>

            {/* Image Preview */}
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
                  disabled={formik.isSubmitting}
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
                  disabled={formik.isSubmitting}
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

            {/* Uploading indicator */}
            {isUploading && (
              <div className="flex items-center mt-2">
                <Loader2 className="w-4 h-4 mr-2 animate-spin text-main-color" />
                <span className="text-light-color">Uploading image...</span>
              </div>
            )}

            {formik.touched.image && formik.errors.image && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.image}</p>
            )}
          </div>

          {/* Content */}
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

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={formik.isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-btn-color hover:bg-sec-color text-white"
              disabled={formik.isSubmitting || isUploading}
            >
              {formik.isSubmitting ? (
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
