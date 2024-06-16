import {
  Box,
  Button,
  FormControl,
  FormLabel,
  InputGroup,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  VStack,
  Text,
  Tabs,
  useMediaQuery,
  InputRightElement,
  Flex,
  UnorderedList,
  ListItem,
  ListIcon,
  FormErrorMessage,
  Avatar,
  Skeleton,
  useColorModeValue,
} from "@chakra-ui/react";
import { CheckCircleIcon, NotAllowedIcon } from "@chakra-ui/icons";
import { Formik, Field, Form } from "formik";
import { FC, useEffect, useRef, useState } from "react";
import {
  validateConfirmPassword,
  validateEmail,
  validatePassword,
  validatePhone,
  validateUsername,
} from "../utils/formValidations";
import useAuthStore from "../store/authStore";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import usePreviewImg from "../hooks/usePreviewImg";
import useEditProfile from "../hooks/useEditProfile";
import ColorModeSwitch from "../components/ColorModeSwitch";

const AccountSettings: FC<{}> = () => {
  const [isLargerThan650] = useMediaQuery("(min-width: 650px)");
  const [isLargerThan930] = useMediaQuery("(min-width: 930px)");
  const [show, setShow] = useState(false);
  const handleShowClick = () => setShow(!show);
  const [passValue, setPassValue] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const authUser = useAuthStore((state) => state.user);
  const panelBackgoundColor = useColorModeValue("white", "#533142");
  const newPWBackgroundColor = useColorModeValue("lightgray", "dimgray");
  const {
    selectedFile,
    setSelectedFile,
    preflightFile,
    setPreflightFile,
    handleImageChange,
  } = usePreviewImg();
  const { isUpdating, editProfile } = useEditProfile();

  const checkPasswordRequirements = (password: string) => {
    return {
      length: password.length >= 7,
      upperCase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      symbol: /\W/.test(password),
      noSpaces: !/\s/.test(password),
    };
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="page">
      <Box
        p={isLargerThan650 ? 5 : 0}
        maxWidth={isLargerThan930 ? "1400px" : "100%"}
        mx="auto"
      >
        <Skeleton fadeDuration={1} isLoaded={!loading}>
          <Tabs
            orientation={isLargerThan650 ? "vertical" : "horizontal"}
            ml={isLargerThan930 ? 20 : isLargerThan650 ? 6 : ""}
            mr={isLargerThan930 ? 20 : isLargerThan650 ? 6 : ""}
            width={isLargerThan650 ? "" : "100%"}
          >
            <TabList
              justifyContent={isLargerThan650 ? "start" : "center"}
              bgColor={panelBackgoundColor}
              borderRadius={5}
              whiteSpace={isLargerThan650 ? "nowrap" : "normal"}
              minWidth={"200px"}
            >
              <Tab py={4}>Account Details</Tab>
              <Tab py={4}>Account Security</Tab>
              <Tab py={4}>Premium Content</Tab>
            </TabList>

            <TabPanels
              ml={isLargerThan650 ? 5 : 0}
              bgColor={panelBackgoundColor}
              borderRadius={5}
              minHeight={isLargerThan650 ? "500px" : "85vh"}
            >
              <TabPanel>
                <Formik
                  initialValues={{
                    username: authUser?.username,
                    email: authUser?.email,
                    phone: authUser?.phoneNumber || "",
                  }}
                  onSubmit={async (values) => {
                    await editProfile(values, preflightFile);
                    setSelectedFile(null);
                    setPreflightFile(null);
                  }}
                  enableReinitialize
                >
                  {({ errors, touched }) => (
                    <Form>
                      <Flex
                        direction={"column"}
                        justify={"space-between"}
                        h="80vh"
                      >
                        <VStack spacing={5} alignItems={"flex-start"}>
                          <FormControl id="profilePicture">
                            <Input
                              name="profilePicture"
                              type="file"
                              ref={fileRef}
                              onChange={handleImageChange}
                              hidden
                            />
                          </FormControl>
                          <FormLabel>Profile Picture</FormLabel>
                          <Box position="relative" cursor="pointer">
                            <Avatar
                              size={"xl"}
                              name={`${authUser?.username}`}
                              src={selectedFile || `${authUser?.profilePic}`}
                            />
                            <Box
                              position="absolute"
                              top="0"
                              right="0"
                              bottom="0"
                              left="0"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              borderRadius={"50%"}
                              backgroundColor="rgba(0, 0, 0, 0.6)"
                              opacity="0"
                              _hover={{ opacity: 1 }}
                              onClick={() => {
                                console.log(fileRef);
                                fileRef.current ? fileRef.current.click() : "";
                              }}
                            >
                              <FontAwesomeIcon icon={faEdit} color="white" />
                            </Box>
                          </Box>
                          <FormControl
                            id="username"
                            isInvalid={!!errors.username && touched.username}
                          >
                            <FormLabel>Username</FormLabel>
                            <Field
                              name="username"
                              type="text"
                              as={Input}
                              validate={validateUsername}
                            />
                            <FormErrorMessage>
                              {errors.username}
                            </FormErrorMessage>
                          </FormControl>

                          <FormControl
                            id="email"
                            isInvalid={!!errors.email && touched.email}
                          >
                            <FormLabel>Email</FormLabel>
                            <Field
                              name="email"
                              type="email"
                              as={Input}
                              validate={validateEmail}
                            />
                            <FormErrorMessage>{errors.email}</FormErrorMessage>
                          </FormControl>

                          <FormControl
                            id="phone"
                            isInvalid={!!errors.phone && touched.phone}
                          >
                            <FormLabel>Phone</FormLabel>
                            <Field
                              name="phone"
                              type="tel"
                              as={Input}
                              validate={validatePhone}
                            />
                            <FormErrorMessage>{errors.phone}</FormErrorMessage>
                          </FormControl>
                          <ColorModeSwitch />
                        </VStack>
                        <Button
                          w={"full"}
                          p={10}
                          colorScheme="pink"
                          type="submit"
                          isLoading={isUpdating}
                        >
                          Save Changes
                        </Button>
                      </Flex>
                    </Form>
                  )}
                </Formik>
              </TabPanel>

              <TabPanel>
                <Formik
                  initialValues={{
                    currentPassword: "",
                    newPassword: "",
                    retypePassword: "",
                  }}
                  onSubmit={(values) => {
                    console.log(values);
                  }}
                >
                  {({ values, errors, touched }) => (
                    <Form>
                      <Flex
                        direction={"column"}
                        justify={"space-between"}
                        h="80vh"
                      >
                        <VStack spacing={5}>
                          <FormControl id="CurrentPassword">
                            <FormLabel>Current Password</FormLabel>
                            <InputGroup>
                              <Field
                                name="currentPassword"
                                type={show ? "text" : "password"}
                                placeholder="Current Password"
                                as={Input}
                              />
                              <InputRightElement width="4.5rem">
                                <Button size="sm" onClick={handleShowClick}>
                                  {show ? "Hide" : "Show"}
                                </Button>
                              </InputRightElement>
                            </InputGroup>
                          </FormControl>

                          <FormControl
                            id="NewPassword"
                            isInvalid={
                              !!errors.newPassword && touched.newPassword
                            }
                          >
                            <FormLabel>New Password</FormLabel>
                            <Field
                              name="newPassword"
                              p={5}
                              type={show ? "text" : "password"}
                              placeholder="New Password"
                              as={Input}
                              validate={(value: string) =>
                                validatePassword(value, setPassValue)
                              }
                            />
                          </FormControl>

                          <Flex
                            bgColor={`${newPWBackgroundColor}`}
                            borderRadius={8}
                            pt={5}
                            pb={5}
                            w={"full"}
                          >
                            <UnorderedList sx={{ listStyleType: "none" }}>
                              <ListItem>
                                {checkPasswordRequirements(values.newPassword)
                                  .length ? (
                                  <ListIcon
                                    as={CheckCircleIcon}
                                    color="green.500"
                                  />
                                ) : (
                                  <ListIcon
                                    as={NotAllowedIcon}
                                    color="red.500"
                                  />
                                )}
                                Use 7+ characters
                              </ListItem>
                              <ListItem>
                                {checkPasswordRequirements(values.newPassword)
                                  .upperCase ? (
                                  <ListIcon
                                    as={CheckCircleIcon}
                                    color="green.500"
                                  />
                                ) : (
                                  <ListIcon
                                    as={NotAllowedIcon}
                                    color="red.500"
                                  />
                                )}
                                Use at least 1 upper case
                              </ListItem>
                              <ListItem>
                                {checkPasswordRequirements(values.newPassword)
                                  .number ? (
                                  <ListIcon
                                    as={CheckCircleIcon}
                                    color="green.500"
                                  />
                                ) : (
                                  <ListIcon
                                    as={NotAllowedIcon}
                                    color="red.500"
                                  />
                                )}
                                Use at least 1 number
                              </ListItem>
                              <ListItem>
                                {checkPasswordRequirements(values.newPassword)
                                  .symbol ? (
                                  <ListIcon
                                    as={CheckCircleIcon}
                                    color="green.500"
                                  />
                                ) : (
                                  <ListIcon
                                    as={NotAllowedIcon}
                                    color="red.500"
                                  />
                                )}
                                Use at least 1 symbol
                              </ListItem>
                              <ListItem>
                                {checkPasswordRequirements(values.newPassword)
                                  .noSpaces ? (
                                  <ListIcon
                                    as={CheckCircleIcon}
                                    color="green.500"
                                  />
                                ) : (
                                  <ListIcon
                                    as={NotAllowedIcon}
                                    color="red.500"
                                  />
                                )}
                                No spaces
                              </ListItem>
                            </UnorderedList>
                          </Flex>

                          <FormControl
                            id="RetypePassword"
                            isInvalid={
                              !!errors.retypePassword && touched.retypePassword
                            }
                          >
                            <Field
                              name="retypePassword"
                              type={show ? "text" : "password"}
                              placeholder="Retype New Password"
                              as={Input}
                              validate={(value: string) =>
                                validateConfirmPassword(value, passValue)
                              }
                            />
                            <FormErrorMessage>
                              {errors.retypePassword}
                            </FormErrorMessage>
                          </FormControl>
                        </VStack>
                        <VStack spacing={5}>
                          <Button
                            w={"full"}
                            p={10}
                            colorScheme="pink"
                            type="submit"
                          >
                            Change Password
                          </Button>

                          <Button
                            w={"full"}
                            p={10}
                            colorScheme="red"
                            type="button"
                          >
                            Delete Account
                          </Button>
                        </VStack>
                      </Flex>
                    </Form>
                  )}
                </Formik>
              </TabPanel>

              <TabPanel>
                <Box>
                  <Text>Premium Content</Text>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Skeleton>
      </Box>
    </div>
  );
};

export default AccountSettings;
