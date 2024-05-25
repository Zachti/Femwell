import { FC, useEffect, useState } from "react";

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";

interface EmailCodeVerificationProps {
  showEmailVerifyPage: boolean;
  handleCodeSubmit: (code: string) => void;
  isConfirmingCode: boolean;
}
const EmailCodeVerification: FC<EmailCodeVerificationProps> = ({
  showEmailVerifyPage,
  handleCodeSubmit,
  isConfirmingCode,
}) => {
  const [code, setCode] = useState("");

  const { onClose } = useDisclosure();

  return (
    <>
      <Modal
        preserveScrollBarGap
        isOpen={showEmailVerifyPage}
        onClose={onClose}
      >
        <ModalOverlay style={{ zIndex: 1000 }} />
        <ModalContent
          maxW={"400px"}
          bgColor={"var(--quaternary-color)"}
          style={{ zIndex: 1000 }}
        >
          <ModalHeader>{"Please enter email verification code"}</ModalHeader>

          <ModalBody>
            <Input
              type="text"
              onChange={(e) => {
                setCode(e.target.value);
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="pink"
              onClick={() => {
                handleCodeSubmit(code);
              }}
              isLoading={isConfirmingCode}
            >
              {"Submit"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EmailCodeVerification;
