import { Box, Flex, Circle, useColorModeValue,  } from "@chakra-ui/react";

const ThreeStepLine = ({ currentStep = 1, setCurrentStep }) => {
  const activeColor = useColorModeValue("black", "blue.300");
  const completedColor = useColorModeValue("black", "green.300");
  const inactiveColor = useColorModeValue("gray.700", "gray.600");

  const getStepColor = (stepIndex) => {
    if (stepIndex <= currentStep) return completedColor;
    return "white";
  };

  const getStepBorderColor = (stepIndex) => {
    if (stepIndex < currentStep) return completedColor;
    if (stepIndex === currentStep) return activeColor;
    return inactiveColor;
  };

  const getStepTextColor = (stepIndex) => {
    if (stepIndex < currentStep) return "white";
    if (stepIndex === currentStep) return activeColor;
    return inactiveColor;
  };

  const getLineColor = (stepIndex) => {
    return stepIndex < currentStep ? completedColor : inactiveColor;
  };

  const handleStepClick = (stepIndex) => {
    if (stepIndex <= currentStep) {
      setCurrentStep(stepIndex);
    }
  };

  return (
    <>
    <Flex align="center" w="full" px={16} py={8}>
      {/* Step 1 */}
      <Circle
        size="20px"
        bg="white"
        color={getStepTextColor(0)}
        fontWeight="bold"
        fontSize="xs"
        transition="all 0.2s"
        border="2px solid"
        borderColor={getStepBorderColor(0)}
        onClick={() => handleStepClick(0)}
        cursor={0 <= currentStep ? "pointer" : "not-allowed"}
      >
        <Circle size="12px" bg={getStepColor(0)} p={1} />
      </Circle>
      <Box h="2px" bg={getLineColor(0)} flex="1"  transition="all 0.2s" />
      <Circle
        size="20px"
        bg="white"
        color={getStepTextColor(1)}
        fontWeight="bold"
        fontSize="xs"
        transition="all 0.2s"
        border="2px solid"
        borderColor={getStepBorderColor(1)}
        onClick={() => handleStepClick(1)}
        cursor={1 <= currentStep ? "pointer" : "not-allowed"}
      >
        <Circle size="12px" bg={getStepColor(1)} p={1} />
      </Circle>
      <Box h="2px" bg={getLineColor(1)} flex="1"  transition="all 0.2s" />
      <Circle
        size="20px"
        bg="white"
        color={getStepTextColor(2)}
        fontWeight="bold"
        fontSize="xs"
        transition="all 0.2s"
        border="2px solid"
        borderColor={getStepBorderColor(2)}
        onClick={() => handleStepClick(2)}
        cursor={2 <= currentStep ? "pointer" : "not-allowed"}
      >
        <Circle size="12px" bg={getStepColor(2)} p={1} />
      </Circle>
      
    </Flex>
      </>
  );
};

export default ThreeStepLine;