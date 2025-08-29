import { Box, Text } from "@chakra-ui/react";

const MyRewards = ({ rewards = [] }) => {
  return rewards.length === 0 ? (
    <Text>No rewards earned in the last month.</Text>
  ) : (
    rewards.map((reward) => (
      <Box key={reward.id} borderWidth="1px" borderRadius="lg" p={4} mb={4}>
        <Text>Amount: {reward.amount}</Text>
        <Text>
          Date Earned: {new Date(reward.created_on).toLocaleDateString()}
        </Text>
      </Box>
    ))
  );
};

export default MyRewards;
