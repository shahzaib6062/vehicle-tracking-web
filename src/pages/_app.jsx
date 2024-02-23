import { ChakraProvider, ColorModeProvider, CSSReset } from "@chakra-ui/react";
import { AuthProvider } from "../context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <ColorModeProvider options={{ initialColorMode: "" }}>
        <QueryClientProvider client={queryClient}>
          <CSSReset />
          <AuthProvider>
            <Component {...pageProps} />
          </AuthProvider>
        </QueryClientProvider>
      </ColorModeProvider>
    </ChakraProvider>
  );
}

export default MyApp;
