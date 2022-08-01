import { Button } from '@chakra-ui/react'

interface PaginationItemProps {
  number: number
  isCurrent?: boolean
}

export function PaginationItem({
  isCurrent = false,
  number,
}: PaginationItemProps) {
  if (isCurrent) {
    return (
      <Button
        size="md"
        fontSize="xs"
        width="4"
        color="white"
        bg="primary"
        disabled
        _hover={{
          bg: 'primaryHover',
        }}
        _disabled={{
          cursor: 'default',
        }}
      >
        {number}
      </Button>
    )
  }

  return (
    <Button
      size="md"
      fontSize="xs"
      width="4"
      color="black"
      bg="white"
      borderWidth={1}
      borderColor="primary"
      _hover={{
        bg: 'primary',
        color: 'white',
      }}
    >
      {number}
    </Button>
  )
}
