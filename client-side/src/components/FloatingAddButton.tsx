import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";
import CreatePostModal from "./CreatePostModal";
import { toast } from "sonner";

const FloatingAddButton = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleClick = () => {
    if (user) {
      setShowCreateModal(true);
    } else {
      toast.error("You need to be logged in to add a posts.");
    }
  };

  return (
    <>
      <Button
        onClick={handleClick}
        className="fixed bottom-6 cursor-pointer right-6 w-14 h-14 rounded-full bg-flag-color hover:bg-flag-color/90 shadow-lg hover:shadow-xl transition-all duration-300 z-50 flex items-center justify-center group"
        size="icon"
      >
        <Plus className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      </Button>

      {user && (
        <CreatePostModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </>
  );
};

export default FloatingAddButton;
