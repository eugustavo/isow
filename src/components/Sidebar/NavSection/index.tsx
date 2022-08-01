import { ReactNode } from 'react'
import { Stack, Box, Text } from '@chakra-ui/react'

interface NavSectionProps {
  title: string
  children: ReactNode
}

export function NavSection({ title, children }: NavSectionProps) {
  return (
    <Box>
      <Text fontWeight="bold" color="gray.700" fontSize="small">
        {title}
      </Text>
      <Stack spacing="4" mt="6" align="stretch">
        {children}
      </Stack>
    </Box>
  )
}
