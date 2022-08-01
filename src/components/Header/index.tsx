import { Flex, Icon, IconButton, useBreakpointValue } from '@chakra-ui/react'
import { List } from 'phosphor-react'
import { useSidebarDrawer } from '../../context/SidebarDrawerContext'
import { Logo } from '../Logo'
import { Notification } from './Notification'
import { Profile } from './Profile'

export function Header() {
  const { onOpen } = useSidebarDrawer()

  const isWideVersion = useBreakpointValue({
    base: false,
    md: true,
  })

  return (
    <Flex
      as="header"
      w="100%"
      maxWidth={1480}
      h="20"
      mx="auto"
      mt="4"
      align="center"
      px="6"
    >
      {!isWideVersion && (
        <IconButton
          aria-label="Abrir menu"
          icon={<Icon as={List} />}
          fontSize="24"
          variant="unstyled"
          onClick={onOpen}
          mr="2"
        ></IconButton>
      )}

      <Flex w="64">
        <Logo />
      </Flex>

      <Notification />

      <Profile showProfileData={isWideVersion} />
    </Flex>
  )
}
