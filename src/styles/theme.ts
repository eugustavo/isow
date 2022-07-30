import { extendTheme } from '@chakra-ui/react'

export const theme = extendTheme({
  colors: {
    primary: '#5300FF',
    textLow: '#666666',
  },
  fonts: {
    body: 'DM Sans',
    heading: 'DM Sans',
  },
  styles: {
    global: {
      body: {
        bg: '#f5f5f5',
        color: '#363636',
      },
    },
  },
})
