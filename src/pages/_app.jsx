import { ChakraProvider, ColorModeProvider, CSSReset } from "@chakra-ui/react";
import { UserProvider } from "../context/UsersContext";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <ColorModeProvider options={{ initialColorMode: "dark" }}>
        <CSSReset />
        <UserProvider>
          <Component {...pageProps} />
        </UserProvider>
      </ColorModeProvider>
    </ChakraProvider>
  );
}

export default MyApp;
