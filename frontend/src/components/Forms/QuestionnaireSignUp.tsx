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
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  RadioGroup,
  Radio,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Alert,
  AlertIcon,
  UnorderedList,
  ListItem,
  Highlight,
  Tooltip,
  CheckboxGroup,
  Checkbox,
  Grid,
} from "@chakra-ui/react";
import "../../assets/Navbar.css";
import { Formik, Field } from "formik";
import {
  validateEmail,
  validateUsername,
  validatePassword,
  validateConfirmPassword,
  validatePhone,
} from "../../utils/formValidations";
// import useGoogleAuth from "../../hooks/useGoogleAuth";
import EmailCodeVerification from "./EmailCodeVerification";
import useSignupEmailPassword from "../../hooks/useSignupEmailPassword";

interface InputFormProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

const steps = [
  { title: "First", description: "Questionnaire" },
  { title: "Second", description: "Create Account" },
];

const QuestionnaireSignUp: FC<InputFormProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [passValue, setPassValue] = useState("");
  const [show, setShow] = useState(false);
  const handleShowClick = () => setShow(!show);
  // const { handleGoogleAuth } = useGoogleAuth();

  const {
    showEmailVerifyPage,
    signup,
    isConfirmingCode,
    handleVerification,
    isSigningUp,
  } = useSignupEmailPassword();

  const { activeStep, goToNext, goToPrevious } = useSteps({
    index: 0,
    count: steps.length,
  });
  const [isLargerThan460] = useMediaQuery("(min-width: 460px)");
  const [isLargerThan500] = useMediaQuery("(min-width: 500px)");
  const [isLargerThan650] = useMediaQuery("(min-width: 650px)");
  const [isLargerThan945] = useMediaQuery("(min-width: 945px)");

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
    goToNext();
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
    goToPrevious();
  };

  const handleCodeSubmit = async (code: string) => {
    const success = await handleVerification(code);
    if (success) onClose();
    else if (currentStep >= 2) goToPrevious();
  };

  return (
    <>
      <Modal
        preserveScrollBarGap
        isOpen={isOpen}
        onClose={onClose}
        size={
          isLargerThan945
            ? "3xl"
            : isLargerThan650
            ? "xl"
            : isLargerThan500
            ? "xl"
            : "full"
        }
      >
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(3px) hue-rotate(25deg)"
        />
        <ModalOverlay />
        <ModalContent
          width={isLargerThan650 ? "100%" : isLargerThan500 ? "85vw" : "100%"}
          bgColor={"var(--primary-color)"}
        >
          <ModalHeader>{"Registration"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik
              initialValues={{
                email: "",
                password: "",
                confirmPassword: "",
                username: "",
                phone: "",
                question1: "",
                question2: "",
                question3a: "",
                question3b: "",
                question3c: "",
                question4a: "",
                question4b: "",
                question4c: "",
                question5: "",
                question6: [],
                question7: "",
                question8: "",
                question9: "",
                question10: "",
              }}
              onSubmit={async (values) => {
                console.log("formik submit");
                goToNext();
                const responses = Object.keys(values)
                  .filter((key) => key.startsWith("question")) // Only process keys that represent questions
                  .map((key) => {
                    const value = (values as Record<string, any>)[key];
                    const answer = Array.isArray(value)
                      ? value.join(", ")
                      : value;
                    return {
                      question: key,
                      answer,
                    };
                  });
                const data = {
                  email: values.email,
                  username: values.username,
                  password: values.password,
                  confirmPassword: values.confirmPassword,
                  phone: values.phone,
                  responses,
                };

                const success = await signup(data);
                if (success) {
                  onClose();
                  //reloadPage();
                }
              }}
              enableReinitialize
            >
              {({ handleSubmit, setFieldValue, errors, touched, values }) => (
                <form onSubmit={handleSubmit} noValidate>
                  <Stepper
                    index={activeStep}
                    pb={4}
                    size={
                      isLargerThan650 ? "lg" : isLargerThan460 ? "md" : "sm"
                    }
                  >
                    {steps.map((step, index) => (
                      <Step key={index}>
                        <StepIndicator>
                          <StepStatus
                            complete={<StepIcon />}
                            incomplete={<StepNumber />}
                            active={<StepNumber />}
                          />
                        </StepIndicator>

                        <Box>
                          <StepTitle>{step.title}</StepTitle>
                          <StepDescription>{step.description}</StepDescription>
                        </Box>

                        <StepSeparator />
                      </Step>
                    ))}
                  </Stepper>

                  <VStack spacing={4} align="flex-start">
                    {/* QUESTIONNAIRE FORM */}
                    {currentStep === 0 && (
                      <>
                        <Tooltip
                          p={3}
                          placement={isLargerThan460 ? "right" : "bottom"}
                          label={
                            <UnorderedList>
                              <ListItem>
                                {" "}
                                Your answers are{" "}
                                <Highlight
                                  query="confidential"
                                  styles={{
                                    px: "2",
                                    py: "0",
                                    rounded: "full",
                                    bg: "red.100",
                                  }}
                                >
                                  confidential and will not be shared without
                                  your consent.
                                </Highlight>{" "}
                              </ListItem>
                              <ListItem>
                                {" "}
                                Your answers will solely be used to provide you
                                with tailored guidance and assistance.
                              </ListItem>
                              <ListItem>
                                {" "}
                                <Highlight
                                  query={["not mandatory."]}
                                  styles={{
                                    px: "2",
                                    py: "0",
                                    rounded: "full",
                                    bg: "red.100",
                                  }}
                                >
                                  This questionnaire is not mandatory.
                                </Highlight>
                              </ListItem>
                              <ListItem>
                                {" "}
                                You will be able to fill this questionnaire at
                                any time.
                              </ListItem>
                            </UnorderedList>
                          }
                        >
                          <Alert
                            fontSize={"sm"}
                            w={isLargerThan460 ? "fit-content" : "full"}
                            justifyContent={
                              isLargerThan460 ? "flex-start" : "center"
                            }
                            status="info"
                            bg="blue.700"
                            borderRadius={4}
                            p={3}
                            tabIndex={0}
                          >
                            <Flex alignItems={"center"}>
                              <AlertIcon color={"blue.200"} mr={2} />
                              <Text fontSize={16} fontWeight={500}>
                                Notice
                              </Text>
                            </Flex>
                          </Alert>
                        </Tooltip>

                        {currentQuestion >= 0 && (
                          <>
                            <FormLabel>
                              Are you in the process of miscarriage?
                            </FormLabel>
                            <RadioGroup
                              mt={-2}
                              onChange={(value) => {
                                if (value === "no") {
                                  setFieldValue("question2", "");
                                  setFieldValue("question3a", "");
                                  setFieldValue("question3b", "");
                                  setFieldValue("question3c", "");
                                  setFieldValue("question4a", "");
                                  setFieldValue("question4b", "");
                                  setFieldValue("question5", "");
                                  setCurrentQuestion(0);
                                } else {
                                  setCurrentQuestion(1);
                                }
                                setFieldValue("question1", value);
                              }}
                              id="question1"
                              value={values.question1}
                            >
                              <Radio value="yes">Yes</Radio>
                              <Radio value="no" ml={2}>
                                No
                              </Radio>
                            </RadioGroup>{" "}
                          </>
                        )}

                        {currentQuestion >= 1 && values.question1 === "yes" && (
                          <>
                            <FormLabel mt={4}>
                              What is the nature of the process?
                            </FormLabel>
                            <Select
                              mt={-2}
                              onChange={(e) => {
                                if (!values.question2 && currentQuestion < 2) {
                                  setCurrentQuestion(currentQuestion + 1);
                                }
                                setFieldValue("question2", e.target.value);
                                if (!e.target.value) {
                                  setFieldValue("question3a", "");
                                  setFieldValue("question3b", "");
                                  setFieldValue("question3c", "");
                                  setFieldValue("question4a", "");
                                  setFieldValue("question4b", "");
                                  setFieldValue("question4c", "");
                                  setFieldValue("question5", "");
                                } else if (e.target.value === "spontaneous") {
                                  setFieldValue("question3b", "");
                                  setFieldValue("question3c", "");
                                  setFieldValue("question4b", "");
                                  setFieldValue("question4c", "");
                                } else if (e.target.value === "induced") {
                                  setFieldValue("question3a", "");
                                  setFieldValue("question3c", "");
                                  setFieldValue("question4a", "");
                                  setFieldValue("question5", "");
                                } else {
                                  setFieldValue("question3a", "");
                                  setFieldValue("question3b", "");
                                  setFieldValue("question4a", "");
                                  setFieldValue("question4b", "");
                                  setFieldValue("question4c", "");
                                  setFieldValue("question5", "");
                                }
                              }}
                              id="question2"
                              value={values.question2}
                            >
                              <option value="">Please choose...</option>
                              <option value="spontaneous">
                                Spontaneous termination
                              </option>
                              <option value="induced">
                                Induced termination
                              </option>
                              <option value="ectopic">Ectopic pregnancy</option>
                            </Select>
                          </>
                        )}

                        {currentQuestion >= 2 &&
                          values.question2 === "spontaneous" && (
                            <>
                              <FormLabel mt={4}>
                                Is there still content in the uterus?
                                (Spontaneous termination)
                              </FormLabel>
                              <Select
                                mt={-2}
                                onChange={(e) => {
                                  if (
                                    !values.question3a &&
                                    currentQuestion < 3
                                  ) {
                                    setCurrentQuestion(currentQuestion + 1);
                                  }
                                  setFieldValue("question3a", e.target.value);
                                  if (e.target.value !== "yes") {
                                    setFieldValue("question4a", "");
                                    setFieldValue("question5", "");
                                  } else {
                                    setFieldValue("question4b", "");
                                  }
                                }}
                                id="question3a"
                                value={values.question3a}
                              >
                                <option value="">Please choose...</option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                                <option value="residue">Only residue</option>
                              </Select>
                            </>
                          )}

                        {currentQuestion >= 2 &&
                          values.question2 === "induced" && (
                            <>
                              <FormLabel mt={4}>
                                Is there still content in the uterus? (Induced
                                termination)
                              </FormLabel>
                              <Select
                                mt={-2}
                                onChange={(e) => {
                                  if (
                                    !values.question3b &&
                                    currentQuestion < 3
                                  ) {
                                    setCurrentQuestion(currentQuestion + 1);
                                  }
                                  setFieldValue("question3b", e.target.value);
                                  if (!e.target.value) {
                                    setFieldValue("question4b", "");
                                    setFieldValue("question4c", "");
                                  } else if (e.target.value !== "yes") {
                                    setFieldValue("question4c", "");
                                  } else {
                                    setFieldValue("question4b", "");
                                  }
                                }}
                                id="question3b"
                                value={values.question3b}
                              >
                                <option value="">Please choose...</option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                                <option value="residue">Only residue</option>
                              </Select>
                            </>
                          )}

                        {currentQuestion >= 2 &&
                          values.question2 === "ectopic" && (
                            <>
                              <FormLabel mt={4}>
                                Is there still pregnancy tissue present?
                              </FormLabel>
                              <Select
                                mt={-2}
                                onChange={(e) => {
                                  if (
                                    !values.question3c &&
                                    currentQuestion < 3
                                  ) {
                                    setCurrentQuestion(currentQuestion + 1);
                                  }
                                  setFieldValue("question3c", e.target.value);
                                  if (!e.target.value)
                                    setFieldValue("question6", []);
                                }}
                                id="question3c"
                                value={values.question3c}
                              >
                                <option value="">Please choose...</option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                              </Select>
                            </>
                          )}

                        {currentQuestion >= 3 &&
                          values.question3a === "yes" && (
                            <>
                              <FormLabel mt={4}>
                                Up to how many weeks did the fetus develop? (If
                                there was only a gestational sac with no fetus,
                                please enter 0)
                              </FormLabel>
                              <Slider
                                min={0}
                                defaultValue={0}
                                max={40}
                                mt={2}
                                aria-label="slider-ex-4a"
                                id="question4a"
                                value={Number(values.question4a)}
                                onChange={(value) => {
                                  if (
                                    !values.question4a &&
                                    currentQuestion < 4
                                  ) {
                                    setCurrentQuestion(currentQuestion + 1);
                                  }
                                  setFieldValue("question4a", value.toString());
                                  if (!value) {
                                    setFieldValue("question5", "");
                                  }
                                }}
                              >
                                <SliderMark
                                  value={Number(values.question4a) ?? 0}
                                  textAlign="center"
                                  borderRadius={3}
                                  bg="pink.200"
                                  color="black"
                                  mt="-10"
                                  ml="-4"
                                  w="9"
                                >
                                  {values.question4a}
                                </SliderMark>
                                <SliderTrack>
                                  <SliderFilledTrack bgColor={"pink"} />
                                </SliderTrack>
                                <SliderThumb boxSize={5} />
                              </Slider>
                            </>
                          )}

                        {currentQuestion >= 3 &&
                          values.question3b === "yes" && (
                            <>
                              <FormLabel mt={4}>
                                What week of pregnancy? (estimate)
                              </FormLabel>
                              <Slider
                                min={0}
                                defaultValue={0}
                                max={40}
                                mt={2}
                                aria-label="slider-ex-4c"
                                id="question4c"
                                value={Number(values.question4c)}
                                onChange={(value) => {
                                  if (
                                    !values.question4c &&
                                    currentQuestion < 4
                                  ) {
                                    setCurrentQuestion(currentQuestion + 1);
                                  }
                                  setFieldValue("question4c", value.toString());
                                }}
                              >
                                <SliderMark
                                  value={Number(values.question4c) ?? 0}
                                  textAlign="center"
                                  borderRadius={3}
                                  bg="pink.200"
                                  color="black"
                                  mt="-10"
                                  ml="-4"
                                  w="9"
                                >
                                  {values.question4c}
                                </SliderMark>
                                <SliderTrack>
                                  <SliderFilledTrack bgColor={"pink"} />
                                </SliderTrack>
                                <SliderThumb boxSize={5} />
                              </Slider>
                            </>
                          )}

                        {currentQuestion >= 3 &&
                          (values.question3a === "no" ||
                            values.question3a === "residue" ||
                            values.question3b === "no" ||
                            values.question3b === "residue") && (
                            <>
                              <FormLabel mt={4}>
                                How was the uterus evacuated?
                              </FormLabel>
                              <Select
                                mt={-2}
                                onChange={(e) => {
                                  if (
                                    !values.question4b &&
                                    currentQuestion < 4
                                  ) {
                                    setCurrentQuestion(currentQuestion + 1);
                                  }
                                  setFieldValue("question4b", e.target.value);
                                }}
                                id="question4b"
                                value={values.question4b}
                              >
                                <option value="">Please choose...</option>
                                <option value="dilation">
                                  Dilation and curettage under full anesthesia
                                </option>
                                <option value="suction">
                                  Suction evacuation without anesthesia
                                </option>
                                <option value="cytotec">Cytotec</option>
                                <option value="natural">Natural process</option>
                              </Select>
                            </>
                          )}

                        {currentQuestion >= 4 && values.question4a && (
                          <>
                            <FormLabel mt={4}>
                              "What is the gestational age? (The time elapsed
                              from the first day of the last menstrual period to
                              today, estimate)
                            </FormLabel>
                            <Slider
                              min={0}
                              defaultValue={0}
                              max={40}
                              mt={2}
                              aria-label="slider-ex-5"
                              id="question5"
                              value={Number(values.question5)}
                              onChange={(value) => {
                                if (!values.question5 && currentQuestion < 5) {
                                  setCurrentQuestion(currentQuestion + 1);
                                }
                                setFieldValue("question5", value.toString());
                              }}
                            >
                              <SliderMark
                                value={Number(values.question5) ?? 0}
                                textAlign="center"
                                borderRadius={3}
                                bg="pink.200"
                                color="black"
                                mt="-10"
                                ml="-4"
                                w="9"
                              >
                                {values.question5}
                              </SliderMark>
                              <SliderTrack>
                                <SliderFilledTrack bgColor={"pink"} />
                              </SliderTrack>
                              <SliderThumb boxSize={5} />
                            </Slider>
                          </>
                        )}

                        <FormLabel mt={4}>
                          Which of the following have you been through before?
                          (You can select multiple answers)
                        </FormLabel>

                        <CheckboxGroup
                          value={values.question6}
                          onChange={(value) => {
                            if (value.includes("none") && value.length > 1) {
                              value = value.filter(
                                (option) => option !== "none",
                              );
                            }
                            setFieldValue("question6", value);
                          }}
                        >
                          <Grid
                            templateColumns={
                              isLargerThan460
                                ? "repeat(3, 1fr)"
                                : "repeat(2, 1fr)"
                            }
                            gap={6}
                          >
                            <Checkbox
                              value="natural"
                              colorScheme="pink"
                              iconColor="transparent"
                              size="lg"
                            >
                              Natural childbirth
                            </Checkbox>
                            <Checkbox
                              value="csection"
                              colorScheme="pink"
                              iconColor="transparent"
                              size="lg"
                            >
                              C-section childbirth
                            </Checkbox>
                            <Checkbox
                              value="stillbirth"
                              colorScheme="pink"
                              iconColor="transparent"
                              size="lg"
                            >
                              Stillbirth
                            </Checkbox>
                            <Checkbox
                              value="ectopic"
                              colorScheme="pink"
                              iconColor="transparent"
                              size="lg"
                            >
                              Ectopic pregnancy
                            </Checkbox>
                            <Checkbox
                              value="Induced"
                              colorScheme="pink"
                              iconColor="transparent"
                              size="lg"
                            >
                              Induced abortion
                            </Checkbox>
                            <Checkbox
                              value="spontaneous"
                              colorScheme="pink"
                              iconColor="transparent"
                              size="lg"
                            >
                              Spontaneous abortion
                            </Checkbox>
                            <Checkbox
                              value="chemical"
                              colorScheme="pink"
                              iconColor="transparent"
                              size="lg"
                            >
                              Chemical pregnancy
                            </Checkbox>
                            <Checkbox
                              value="fertility"
                              colorScheme="pink"
                              iconColor="transparent"
                              size="lg"
                            >
                              Fertility treatments
                            </Checkbox>
                            <Checkbox
                              value="none"
                              colorScheme="pink"
                              iconColor="transparent"
                              size="lg"
                              isDisabled={
                                (values.question1 !== "no" &&
                                  values.question1 !== undefined) ||
                                values.question6.some(
                                  (option) => option && option !== "none",
                                )
                              }
                            >
                              None
                            </Checkbox>
                          </Grid>
                        </CheckboxGroup>

                        <FormLabel mt={4}>
                          Are you undergoing regular medication treatment?
                        </FormLabel>
                        <Select
                          mt={-2}
                          onChange={(e) => {
                            if (!values.question7 && currentQuestion < 3) {
                              setCurrentQuestion(currentQuestion + 1);
                            }
                            setFieldValue("question7", e.target.value);
                          }}
                          id="question7"
                          value={values.question7}
                        >
                          <option value="">Please choose...</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </Select>

                        <FormLabel mt={4}>
                          Do you have any underlying medical conditions?
                        </FormLabel>
                        <Select
                          mt={-2}
                          onChange={(e) => {
                            if (!values.question8 && currentQuestion < 3) {
                              setCurrentQuestion(currentQuestion + 1);
                            }
                            setFieldValue("question8", e.target.value);
                          }}
                          id="question8"
                          value={values.question8}
                        >
                          <option value="">Please choose...</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </Select>
                        {((values.question6.length > 0 &&
                          !values.question6.find((e) => e === "none")) ||
                          values.question1 === "yes") && (
                          <>
                            <FormLabel mt={4}>
                              Have you had enough support during the process?
                            </FormLabel>
                            <Select
                              mt={-2}
                              onChange={(e) => {
                                if (!values.question9 && currentQuestion < 3) {
                                  setCurrentQuestion(currentQuestion + 1);
                                }
                                setFieldValue("question9", e.target.value);
                              }}
                              id="question9"
                              value={values.question9}
                            >
                              <option value="">Please choose...</option>
                              <option value="yes">Yes</option>
                              <option value="no">No</option>
                            </Select>
                          </>
                        )}

                        <FormLabel mt={4}>
                          Please add anything else you would like to share.
                        </FormLabel>
                        <Input
                          mt={-2}
                          onChange={(e) => {
                            if (!values.question10 && currentQuestion < 3) {
                              setCurrentQuestion(currentQuestion + 1);
                            }
                            setFieldValue("question10", e.target.value);
                          }}
                          id="question10"
                          value={values.question10}
                        ></Input>
                      </>
                    )}

                    {/* SIGN UP FORM */}
                    {currentStep > 0 && (
                      <>
                        {/* email input */}
                        <FormControl
                          isInvalid={!!errors.email && touched.email}
                        >
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
                              validate={(value: string) =>
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
                            goToNext();
                            // const responses = Object.keys(values)
                            //   .filter((key) => key.startsWith("question")) // Only process keys that represent questions
                            //   .map((key) => {
                            //     const value = (values as Record<string, any>)[
                            //       key
                            //     ];
                            //     const answer = Array.isArray(value)
                            //       ? value.join(", ")
                            //       : value;
                            //     return {
                            //       question: key,
                            //       answer,
                            //     };
                            //   });
                            // const data = {
                            //   email: values.email,
                            //   username: values.username,
                            //   password: values.password,
                            //   confirmPassword: values.confirmPassword,
                            //   phone: values.phone,
                            //   responses,
                            // };
                            // const success = await handleGoogleAuth(data);
                            // if (success) {
                            //   onClose();
                            // }
                          }}
                        >
                          <Image src="/google.png" alt="Google logo" w={5} />
                          <Text mx={2} color="blue.500">
                            Sign up with Google
                          </Text>
                        </Flex>
                      </>
                    )}

                    <ModalFooter pl={0}>
                      {currentStep === 0 && (
                        <Button onClick={handleNext} colorScheme="pink">
                          {"Next Step"}
                        </Button>
                      )}

                      {currentStep > 0 && (
                        <>
                          <Button
                            onClick={handlePrevious}
                            mr={4}
                            colorScheme="pink"
                          >
                            {"Previus Step"}
                          </Button>
                          <Button
                            type="submit"
                            mr={4}
                            colorScheme="pink"
                            isLoading={isSigningUp}
                          >
                            {"Sign Up"}
                          </Button>
                        </>
                      )}
                    </ModalFooter>
                  </VStack>
                </form>
              )}
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>
      <EmailCodeVerification
        showEmailVerifyPage={showEmailVerifyPage}
        handleCodeSubmit={handleCodeSubmit}
        isConfirmingCode={isConfirmingCode}
      />
    </>
  );
};

export default QuestionnaireSignUp;
