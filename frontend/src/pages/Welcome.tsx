import {
  Box,
  Button,
  Text,
  Flex,
  useMediaQuery,
  useDisclosure,
} from "@chakra-ui/react";

import "../assets/App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeartCircleCheck,
  faSeedling,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { useState } from "react";
import LogoSvg from "../components/Menus/LogoSvg";
import LoginForm from "../components/Forms/LoginForm";
import QuestionnaireSignUp from "../components/Forms/QuestionnaireSignUp";
// import EmailCodeVerification from "../components/Forms/EmailCodeVerification";
// import useSignupEmailPassword from "../hooks/useSignupEmailPassword";

const MotionButton = motion(Button);

const Welcome = () => {
  const [buttonSignUpText, setButtonSignUpText] = useState(
    "Click Here To Begin!",
  );
  const [buttonLoginText, setButtonLoginText] = useState(
    "Click Here To Sign In!",
  );
  const [isLargerThan460] = useMediaQuery("(min-width: 460px)");
  const [isLargerThan945] = useMediaQuery("(min-width: 945px)");

  const {
    isOpen: isSignUpOpen,
    onOpen: onSignUpOpen,
    onClose: onSignUpClose,
  } = useDisclosure();
  const {
    isOpen: isLoginOpen,
    onOpen: onLoginOpen,
    onClose: onLoginClose,
  } = useDisclosure();

  return (
    <div className="page">
      {/* <Header image="/purpleSea.jpg">
          <h1>Welcome to FemWell!</h1>
        </Header> */}
      <Flex
        direction={"column"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <LogoSvg
          fillColor="var(--secondary-color)"
          width={isLargerThan460 ? "170px" : "100px"}
          mt={isLargerThan460 ? "-30px" : "-15px"}
        />

        <Text
          mt={isLargerThan460 ? -10 : -6}
          fontSize={isLargerThan460 ? "2xl" : "xl"}
          fontFamily={"kalam"}
          color="var(--secondary-color)"
          pb={4}
          fontWeight={"600"}
        >
          Welcome To Femwell
        </Text>
      </Flex>
      <Flex
        direction={isLargerThan945 ? "row" : "column"}
        justifyContent={"center"}
        alignContent={"center"}
        alignItems={"center"}
        gap={isLargerThan945 ? 10 : 4}
        pb={4}
      >
        <Box
          borderRadius={"20px"}
          width={isLargerThan460 ? "md" : "xs"}
          h={isLargerThan460 ? "sm" : "xs"}
          className="welcome-container"
          bgImage={"url(/freeWoman.png)"}
          bgSize={"cover"}
          bgPos={"left"}
          color="white"
        >
          <Box
            w={"full"}
            h={"full"}
            borderRadius={"20px"}
            bgColor={"var(--quaternary-color-dim)"}
            pt={4}
          >
            <Flex justifyContent={"center"} alignItems={"center"}>
              <Text fontSize={"3xl"} fontWeight={50} mr={3}>
                New Here?
              </Text>
              <Text
                fontSize={"3xl"}
                fontWeight={500}
                color={"var(--text-color-a)"}
              >
                Join Us!
              </Text>
            </Flex>
            <Text
              fontSize={isLargerThan460 ? "2xl" : "xl"}
              fontWeight={isLargerThan460 ? 300 : 350}
              m={4}
            >
              And fill in our specialized{" "}
              <Text as="span" color="var(--text-color-a)">
                questionnaire
              </Text>{" "}
              <Text pr={1} as="span">
                {" "}
                for tailored guidance and Information
              </Text>
              <FontAwesomeIcon
                color="var(--text-color-a)"
                icon={faHeartCircleCheck}
                className="my-icon"
              />
            </Text>

            <MotionButton
              m={isLargerThan460 ? 10 : 3}
              w="200px"
              style={{
                background: "linear-gradient(90deg, pink 50%, transparent 50%)",
                backgroundSize: "200% 100%",
                border: "1px solid pink",
                backgroundPosition: "0% 0%",
                color: "#000",
              }}
              whileHover={{
                backgroundPositionX: "100%",
                color: "#fff",
                transition: { duration: 0.25 },
              }}
              whileTap={{ y: "10px", transition: { duration: 0.05 } }}
              onClick={onSignUpOpen}
              onHoverStart={() => setButtonSignUpText("Lets Get Started!")}
              onHoverEnd={() => setButtonSignUpText("Click Here To Begin!")}
              transition={{ duration: 0.3 }}
              colorScheme={"pink"}
            >
              {buttonSignUpText}
            </MotionButton>
          </Box>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -5 1440 320"
            className="svg"
          >
            <path
              fill="pink"
              d="M0,192L48,170.7C96,149,192,107,288,122.7C384,139,480,213,576,208C672,203,768,117,864,90.7C960,64,1056,96,1152,101.3C1248,107,1344,85,1392,74.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </Box>

        <Box
          borderRadius={"20px"}
          width={isLargerThan460 ? "md" : "xs"}
          h={isLargerThan460 ? "sm" : "xs"}
          className="welcome-container"
          bgImage={"url(/CheerfulWomen.png)"}
          bgSize={"cover"}
          bgPos={"left"}
          color="white"
        >
          <Box
            w={"full"}
            h={"full"}
            borderRadius={"20px"}
            bgColor={"var(--quaternary-color-dim)"}
            pt={4}
          >
            <Flex justifyContent={"center"} alignItems={"center"}>
              <Text
                fontSize={"3xl"}
                fontWeight={50}
                mr={isLargerThan460 ? 3 : 2}
              >
                Returning User?
              </Text>

              <Text
                fontSize={"3xl"}
                fontWeight={500}
                color={"var(--text-color-a)"}
              >
                Log In!
              </Text>
            </Flex>

            <Text
              fontSize={isLargerThan460 ? "2xl" : "xl"}
              fontWeight={isLargerThan460 ? 300 : 350}
              m={4}
            >
              Sign in to access your{" "}
              <Text as="span" color="var(--text-color-a)">
                account
              </Text>{" "}
              and pick up where you left off
              <Text as="span" color="var(--text-color-a)"></Text>{" "}
              <Text pr={1} as="span"></Text>
              <FontAwesomeIcon
                color="var(--text-color-a)"
                icon={faSeedling}
                className="my-icon"
              />
            </Text>
            <MotionButton
              m={isLargerThan460 ? 10 : 3}
              w="200px"
              style={{
                background: "linear-gradient(90deg, pink 50%, transparent 50%)",
                backgroundSize: "200% 100%",
                border: "1px solid pink",
                backgroundPosition: "0% 0%",
                color: "#000",
              }}
              whileHover={{
                backgroundPositionX: "100%",

                color: "#fff",
                transition: { duration: 0.25 },
              }}
              whileTap={{ y: "10px", transition: { duration: 0.05 } }}
              onClick={onLoginOpen}
              onHoverStart={() => setButtonLoginText("Welcome Back!")}
              onHoverEnd={() => setButtonLoginText("Click Here To Sign In!")}
              colorScheme={"pink"}
            >
              {buttonLoginText}
            </MotionButton>
          </Box>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -5 1440 320"
            className="svg"
          >
            <path
              fill="pink"
              d="M0,96L24,101.3C48,107,96,117,144,106.7C192,96,240,64,288,80C336,96,384,160,432,154.7C480,149,528,75,576,64C624,53,672,107,720,149.3C768,192,816,224,864,224C912,224,960,192,1008,165.3C1056,139,1104,117,1152,96C1200,75,1248,53,1296,53.3C1344,53,1392,75,1416,85.3L1440,96L1440,320L1416,320C1392,320,1344,320,1296,320C1248,320,1200,320,1152,320C1104,320,1056,320,1008,320C960,320,912,320,864,320C816,320,768,320,720,320C672,320,624,320,576,320C528,320,480,320,432,320C384,320,336,320,288,320C240,320,192,320,144,320C96,320,48,320,24,320L0,320Z"
            ></path>
          </svg>
        </Box>
      </Flex>

      <svg
        style={{ zIndex: 1 }}
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        className="svg"
      >
        <path d="M0,160L60,170.7C120,181,240,203,360,176C480,149,600,75,720,69.3C840,64,960,128,1080,154.7C1200,181,1320,171,1380,165.3L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
      </svg>

      <LoginForm
        isOpen={isLoginOpen}
        onOpen={onLoginOpen}
        onClose={onLoginClose}
      />
      <QuestionnaireSignUp
        isOpen={isSignUpOpen}
        onOpen={onSignUpOpen}
        onClose={onSignUpClose}
      />
    </div>
  );
};

export default Welcome;
