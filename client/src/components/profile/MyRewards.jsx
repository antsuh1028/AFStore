import { Box, Text } from "@chakra-ui/react";

const MyRewards = ({ rewards = [] }) => {
  // Handle all edge cases: null, undefined, not an array
  if (!rewards || !Array.isArray(rewards)) {
    return <Text>No rewards earned in the last month.</Text>;
  }

  if (rewards.length === 0) {
    return <Text>No rewards earned in the last month.</Text>;
  }

  return rewards.map((reward) => (
    <Box key={reward.id} borderWidth="1px" borderRadius="lg" p={4} mb={4}>
      <Text>Amount: {reward.amount}</Text>
      <Text>
        Date Earned: {new Date(reward.created_on).toLocaleDateString()}
      </Text>
    </Box>
  ));
};

export default MyRewards;