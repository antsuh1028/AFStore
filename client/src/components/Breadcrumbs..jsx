import {
  Box,
  Stack,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { Minus } from "lucide-react";

const Breadcrumbs = ({ listOfBreadCrumbs }) => {
  return (
    <Box>
      <Stack spacing={4}>
      <Breadcrumb separator={<Minus size={16}/>}>
          {listOfBreadCrumbs.map((breadcrumb, index) => (
            <BreadcrumbItem key={index}>
              <BreadcrumbLink
                fontSize="xs"
                href={breadcrumb.url}
                fontWeight="normal"
                color="black"
                _hover={{ color: "blue.500", textDecoration: "none" }}
              >
                {breadcrumb.label}
              </BreadcrumbLink>
            </BreadcrumbItem>
          ))}
        </Breadcrumb>
      </Stack>
    </Box>
  );
};

export default Breadcrumbs;
