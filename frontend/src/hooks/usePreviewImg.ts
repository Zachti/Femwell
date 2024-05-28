import { ChangeEvent, useState } from "react";
import useShowToast from "./useShowToast";
import { MimeType } from "../utils/mimeTypes";

const usePreviewImg = () => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [preflightFile, setPreflightFile] = useState<File | null>(null);
  const showToast = useShowToast();
  const maxFileSize = 4 * 1024 * 1024; // 4MB

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (file) {
        if (
          file.type === MimeType.JPG ||
          file.type === MimeType.PNG ||
          file.type === MimeType.PDF
        ) {
          if (file.size > maxFileSize) {
            showToast("Error", "File is too large. Max size is 4MB.", "error");
            setSelectedFile(null);
            setPreflightFile(null);
            return false;
          } else {
            const reader = new FileReader();

            reader.onloadend = () => setSelectedFile(reader.result as string);
            reader.readAsDataURL(file);

            setPreflightFile(file);
            return true;
          }
        } else {
          showToast("Error", "Please select an image file", "error");
          setSelectedFile(null);
          setPreflightFile(null);
        }
      }
      return false;
    }
  };

  return {
    selectedFile,
    setSelectedFile,
    preflightFile,
    setPreflightFile,
    handleImageChange,
  };
};

export default usePreviewImg;
