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
import {
  validateEmail,
  validateUsername,
  validatePassword,
  validateConfirmPassword,
  validatePhone,
} from "../utils/formValidations";
import useSignupEmailPassword from "../hooks/useSignupEmailPassword";
import useLogin from "../hooks/useLogin";
import useGoogleAuth from "../hooks/useGoogleAuth";
import { reloadPage } from "../utils/genericFunctions";

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
  const { signup, isSigningUp } = useSignupEmailPassword();
  const { login, isLoggingIn } = useLogin();
  const { handleGoogleAuth } = useGoogleAuth();
  const [isLargerThan650] = useMediaQuery("(min-width: 650px)");

  return (
    <>
      <Modal preserveScrollBarGap isOpen={isOpen} onClose={onClose}>
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(3px) hue-rotate(25deg)"
        />
        <ModalOverlay />
        <ModalContent
          width={isLargerThan650 ? "100%" : "85vw"}
          bgColor={"var(--primary-color)"}
        >
          <ModalHeader>{isLogin ? "Login" : "Create Account"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik
              initialValues={{
                email: "",
                password: "",
                confirmPassword: isLogin ? undefined : "",
                username: isLogin ? undefined : "",
                phone: isLogin ? undefined : "",
                login: isLogin,
              }}
              onSubmit={
                isLogin
                  ? async (values) => {
                      const success = await login(values);
                      if (success) {
                        onClose();
                        //reloadPage();
                      }
                    }
                  : async (values) => {
                      const success = await signup(values);
                      if (success) {
                        onClose();
                        //reloadPage();
                      }
                    }
              }
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

                    {/* username input */}
                    {!isLogin && (
                      <FormControl
                        isInvalid={!!errors.username && touched.username}
                      >
                        <FormLabel htmlFor="username">Username</FormLabel>
                        <InputGroup>
                          <Field
                            as={Input}
                            placeholder="JohnDoe"
                            id="username"
                            name="username"
                            type="text"
                            variant="filled"
                            validate={validateUsername}
                          />
                        </InputGroup>
                        <FormErrorMessage>{errors.username}</FormErrorMessage>
                      </FormControl>
                    )}

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
                          validate={
                            isLogin
                              ? ""
                              : (value: string) =>
                                  validatePassword(value, setPassValue)
                          }
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
                              validate={(value: string) =>
                                validateConfirmPassword(value, passValue)
                              }
                            ></Field>
                          </InputGroup>
                          <FormErrorMessage>
                            {errors.confirmPassword}
                          </FormErrorMessage>
                        </FormControl>

                        {/* phone  input */}
                        <FormControl
                          isInvalid={!!errors.phone && touched.phone}
                        >
                          <FormLabel htmlFor="phone">Phone</FormLabel>
                          <InputGroup>
                            <Field
                              as={Input}
                              placeholder="Phone"
                              id="phone"
                              name="phone"
                              type="tel"
                              variant="filled"
                              validate={validatePhone}
                            ></Field>
                          </InputGroup>
                          <FormErrorMessage>{errors.phone}</FormErrorMessage>
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
                          onClick={async () => {
                            const success = await handleGoogleAuth();
                            if (success) {
                              onClose();
                              //reloadPage();
                            }
                          }}
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
                      <Button
                        type="submit"
                        mr={4}
                        colorScheme="pink"
                        isLoading={isSigningUp || isLoggingIn}
                      >
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
