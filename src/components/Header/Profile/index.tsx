import {
  Avatar,
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react'
import { useAuth } from '../../../context/auth'

interface ProfileProps {
  showProfileData?: boolean
}

export function Profile({ showProfileData = true }: ProfileProps) {
  const { user, signOut } = useAuth()

  return (
    <Flex align="center">
      {showProfileData && (
        <Box mr="4" textAlign="right">
          <Text>{user.name}</Text>
          <Text color="gray.500" fontSize="small">
            {user.email}
          </Text>
        </Box>
      )}

      <Menu>
        <MenuButton>
          <Avatar size="md" name={user.name} src={user.avatar_url || ''} />
        </MenuButton>
        <MenuList>
          <MenuGroup title="Conta">
            <MenuItem>Minha conta</MenuItem>
            <MenuItem>Pagamentos</MenuItem>
          </MenuGroup>
          <MenuDivider />
          <MenuGroup title="Ajuda">
            <MenuItem>Documentação</MenuItem>
            <MenuItem>FAQ</MenuItem>
          </MenuGroup>
          <MenuDivider />
          <MenuGroup>
            <MenuItem onClick={signOut}>Sair</MenuItem>
          </MenuGroup>
        </MenuList>
      </Menu>
    </Flex>
  )
}
