import { Spinner } from "@chakra-ui/spinner";
import { Box } from "@chakra-ui/react";

function DefaultSpinner({ size = "xl" }) {
  return (
    <Box width="100%" textAlign="center" my="24">
      <Spinner size={size} />
    </Box>
  );
}

export default DefaultSpinner;
