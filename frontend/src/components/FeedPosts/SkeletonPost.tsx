import {
  Box,
  HStack,
  SkeletonCircle,
  SkeletonText,
  useMediaQuery,
} from "@chakra-ui/react";

const SkeletonPost = () => {
  const [isLargerThan500] = useMediaQuery("(min-width: 500px)");
  return (
    <Box
      margin={"auto"}
      w={"full"}
      maxW={isLargerThan500 ? "" : "300px"}
      height={"400px"}
      background={"var(--quaternary-color)"}
      p={3}
      borderRadius={5}
    >
      <HStack>
        <SkeletonCircle size="9" startColor="pink.300" endColor="pink.700" />

        <SkeletonText
          w={"50%"}
          noOfLines={1}
          ml={2}
          startColor="pink.300"
          endColor="pink.700"
          skeletonHeight="5"
        />
      </HStack>
      <SkeletonText
        mt="4"
        mb={"110"}
        noOfLines={6}
        startColor="pink.300"
        endColor="pink.700"
        spacing="4"
        skeletonHeight="2"
      />
      <SkeletonText
        noOfLines={1}
        startColor="pink.300"
        endColor="pink.700"
        spacing="4"
        skeletonHeight="20"
      />
    </Box>
  );
};

export default SkeletonPost;
