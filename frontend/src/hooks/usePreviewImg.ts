import { ChangeEvent, useState } from "react";
import useShowToast from "./useShowToast";
import { MimeType } from "../utils/mimeTypes";

const usePreviewImg = () => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const showToast = useShowToast();
  const maxFileSize = 4 * 1024 * 1024; // 4MB

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (file) {
        if (file.type === MimeType.JPG || MimeType.PNG || MimeType.PDF) {
          if (file.size > maxFileSize) {
            showToast("Error", "File is too large. Max size is 4MB.", "error");
            setSelectedFile(null);
            return false;
          } else {
            const reader = new FileReader();

            reader.onloadend = () => setSelectedFile(reader.result as string);
            reader.readAsDataURL(file);

            return true;
          }
        } else {
          showToast("Error", "Please select an image file", "error");
          setSelectedFile(null);
        }
      }
      return false;
    }
  };

  return { selectedFile, setSelectedFile, handleImageChange };
};

export default usePreviewImg;
