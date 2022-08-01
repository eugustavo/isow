import {
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
} from '@chakra-ui/react'
import { Bell } from 'phosphor-react'

export function Notification() {
  return (
    <Flex align="center" ml="auto">
      <Flex
        mx="8"
        pr="8"
        py="1"
        color="gray.500"
        borderRightWidth={1}
        borderColor="gray.400"
        cursor="pointer"
      >
        <Menu>
          <MenuButton>
            <Icon as={Bell} fontSize="22" />
          </MenuButton>
          <MenuList color="gray.700">
            <MenuGroup title="Notificações">
              <MenuItem>Notificação 01</MenuItem>
              <MenuItem>Notificação 02</MenuItem>
              <MenuItem>Notificação 03</MenuItem>
              <MenuItem>Notificação 04</MenuItem>
              <MenuItem>Notificação 05</MenuItem>
              <MenuItem>Notificação 06</MenuItem>
            </MenuGroup>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  )
}
