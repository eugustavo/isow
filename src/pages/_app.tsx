import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from '../styles/theme'
import { SidebarDrawerProvider } from '../context/SidebarDrawerContext'
import { AuthProvider } from '../context/auth'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <SidebarDrawerProvider>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </SidebarDrawerProvider>
    </ChakraProvider>
  )
}

export default MyApp
