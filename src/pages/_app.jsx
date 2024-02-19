import { ChakraProvider, ColorModeProvider, CSSReset } from "@chakra-ui/react";
import { UserProvider } from "../context/UsersContext";
import "../style.css";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <ColorModeProvider options={{ initialColorMode: "" }}>
        <CSSReset />
        <UserProvider>
          <Component {...pageProps} />
        </UserProvider>
      </ColorModeProvider>
    </ChakraProvider>
  );
}

export default MyApp;
