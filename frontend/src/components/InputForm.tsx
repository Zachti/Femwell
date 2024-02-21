import { FC, useState } from "react";
import {
  Button,
  Input,
  Flex,
  Text,
  Box,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  VStack,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  FormErrorMessage,
  useMediaQuery,
} from "@chakra-ui/react";

import "../assets/Navbar.css";
import { Formik, Field } from "formik";

interface InputFormProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

const InputForm: FC<InputFormProps> = ({ isOpen, onClose, onOpen }) => {
  const [passValue, setPassValue] = useState("");
  const [show, setShow] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const handleShowClick = () => setShow(!show);
  const [isLargerThan650] = useMediaQuery("(min-width: 650px)");

  const validateEmail = (value: string) => {
    let error = "";
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    !emailRegex.test(value) ? (error = "Invalid email") : "";
    if (!value) {
      error = "*Required";
    }
    return error;
  };

  const validatePassword = (value: string) => {
    let error = "";
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).*$/;

    value.length < 8 ? (error = "Password must be 8 characters long") : "";
    !passwordRegex.test(value)
      ? (error = "Password invalid")
      : setPassValue(value);
    if (!value) {
      error = "*Required";
    }

    return error;
  };

  const validateConfirmPassword = (value: string) => {
    let error = "";
    if (passValue && value) {
      if (passValue !== value) {
        error = "Password not matched";
      }
    }
    return error;
  };

  return (
    <>
      <Modal preserveScrollBarGap isOpen={isOpen} onClose={onClose}>
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(3px) hue-rotate(25deg)"
        />
        <ModalOverlay />
        <ModalContent width={isLargerThan650 ? "100%" : "85vw"}>
          <ModalHeader>{isLogin ? "Login" : "Create Account"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik
              initialValues={{
                email: "",
                password: "",
                confirmPassword: isLogin ? undefined : "",
                phone: isLogin ? undefined : "",
                login: isLogin,
              }}
              onSubmit={(values) => alert(JSON.stringify(values, null, 2))}
              enableReinitialize
            >
              {({ handleSubmit, errors, touched }) => (
                <form onSubmit={handleSubmit} noValidate>
                  <VStack spacing={4} align="flex-start">
                    {/* email input */}

                    <FormControl isInvalid={!!errors.email && touched.email}>
                      <FormLabel htmlFor="email">Email Address</FormLabel>
                      <InputGroup>
                        <Field
                          as={Input}
                          placeholder="Example@domain.com"
                          id="email"
                          name="email"
                          type="email"
                          variant="filled"
                          validate={validateEmail}
                        />
                      </InputGroup>
                      <FormErrorMessage>{errors.email}</FormErrorMessage>
                    </FormControl>

                    {/* password input */}
                    <FormControl
                      isInvalid={!!errors.password && touched.password}
                    >
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <InputGroup>
                        <Field
                          as={Input}
                          placeholder="Password"
                          id="password"
                          name="password"
                          type={show ? "text" : "password"}
                          variant="filled"
                          validate={validatePassword}
                        ></Field>
                        <InputRightElement width="4.5rem">
                          <Button size="sm" onClick={handleShowClick}>
                            {show ? "Hide" : "Show"}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                      <FormErrorMessage>{errors.password}</FormErrorMessage>
                    </FormControl>

                    {/* confrim password input */}
                    {!isLogin && (
                      <>
                        <FormControl
                          isInvalid={
                            !!errors.confirmPassword && touched.confirmPassword
                          }
                        >
                          <FormLabel htmlFor="confirmPassword">
                            Confirm Password
                          </FormLabel>
                          <InputGroup>
                            <Field
                              as={Input}
                              placeholder="Re-type password"
                              id="confirmPassword"
                              name="confirmPassword"
                              type={show ? "text" : "password"}
                              variant="filled"
                              validate={validateConfirmPassword}
                            ></Field>
                          </InputGroup>
                          <FormErrorMessage>
                            {errors.confirmPassword}
                          </FormErrorMessage>
                        </FormControl>

                        {/* phone  input */}
                        <FormControl isInvalid={!!errors.phone}>
                          <FormLabel htmlFor="phone">Phone</FormLabel>
                          <InputGroup>
                            <Field
                              as={Input}
                              placeholder="Phone"
                              id="phone"
                              name="phone"
                              type="tel"
                              variant="filled"
                            ></Field>
                          </InputGroup>
                        </FormControl>

                        <Flex
                          alignItems="center"
                          justifyContent="center"
                          my={1}
                          w="full"
                        >
                          <Box flex={1} h="1px" bg="gray.300" />
                          <Text mx={1} color="gray.400">
                            OR
                          </Text>
                          <Box flex={1} h="1px" bg="gray.300" />
                        </Flex>

                        <Flex
                          alignItems="center"
                          justifyContent="center"
                          cursor="pointer"
                          w="full"
                        >
                          <Image src="/google.png" alt="Google logo" w={5} />
                          <Text mx={2} color="blue.500">
                            Log in with Google
                          </Text>
                        </Flex>
                      </>
                    )}

                    {/* submit and form change buttons */}
                    <ModalFooter pl={0}>
                      <Button type="submit" mr={4} colorScheme="pink">
                        {isLogin ? "Login" : "Submit"}
                      </Button>
                      <Button
                        onClick={() => {
                          setIsLogin(!isLogin);
                        }}
                      >
                        {isLogin ? "Create Account" : "Login"}
                      </Button>
                    </ModalFooter>
                  </VStack>
                </form>
              )}
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default InputForm;
