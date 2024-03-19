import { useToast } from "@chakra-ui/react";

type ToastStatus = "info" | "warning" | "success" | "error";

const useShowToast = () => {
  const toast = useToast();

  const showToast = (title: String, description: any, status: ToastStatus) => {
    toast({
      title: title,
      description: description,
      status: status,
      duration: 3000,
      isClosable: true,
      colorScheme: status === "success" ? "pink" : undefined,
    });
  };

  return showToast;
};

export default useShowToast;
