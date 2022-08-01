import { extendTheme } from '@chakra-ui/react'

export const theme = extendTheme({
  colors: {
    primary: '#5300FF',
    primaryHover: '#4702d6',
    primaryLow: '#7d3ffc',
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
