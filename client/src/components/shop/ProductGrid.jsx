import {
  Box,
  Text,
  SimpleGrid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { ProductCard } from "./ProductCard";

const renderProductGrid = (filteredProducts, emptyMessage) => (
  <Box minHeight="400px">
    {filteredProducts.filter((item) => item.show).length === 0 ? (
      <Box
        textAlign="center"
        py={8}
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="300px"
      >
        <Text color="gray.500">{emptyMessage}</Text>
      </Box>
    ) : (
      <SimpleGrid columns={2} spacing={2} pb={8}>
        {filteredProducts
          .filter((item) => item.show)
          .map((item) => (
            <ProductCard key={item.id} {...item} />
          ))}
      </SimpleGrid>
    )}
  </Box>
);

export const ProductTabs = ({ products, getProductsByType, productType }) => {
  return (
    <Tabs w="100%" variant="unstyled" isFitted={false}>
      <TabList justifyContent="center" gap={4} mb={6} overflowX="auto">
        {["all", "beef", "pork", "poultry"].map((label) => (
          <Tab
            key={label}
            _selected={{
              fontWeight: "bold",
              textDecoration: "underline",
              bg: "transparent",
            }}
            _focus={{ boxShadow: "none" }}
            p={0}
            transition="none"
          >
            <Box
              border="1px"
              borderColor="gray.300"
              borderRadius="full"
              px={4}
              py={1}
              bg="#fafafa"
              color="gray.600"
              fontSize="small"
              transition="none"
            >
              {label.charAt(0).toUpperCase() + label.slice(1)}
            </Box>
          </Tab>
        ))}
      </TabList>

      <TabPanels minHeight="500px">
        <TabPanel p={2}>
          {renderProductGrid(products, `No ${productType} products found`)}
        </TabPanel>

        <TabPanel p={2}>
          {renderProductGrid(
            getProductsByType("beef"),
            `No ${productType} beef products found`
          )}
        </TabPanel>

        <TabPanel p={2}>
          {renderProductGrid(
            getProductsByType("pork"),
            `No ${productType} pork products found`
          )}
        </TabPanel>

        <TabPanel p={2}>
          {renderProductGrid(
            getProductsByType("chicken"),
            `No ${productType} poultry products found`
          )}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};