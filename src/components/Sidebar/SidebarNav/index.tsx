import { Stack } from '@chakra-ui/react'
import { Buildings, House, User } from 'phosphor-react'
import { NavLink } from '../NavLink'
import { NavSection } from '../NavSection'

export function SidebarNav() {
  return (
    <Stack spacing="12" align="flex-start">
      <NavSection title="Geral">
        <NavLink href="/dashboard" NavIcon={House}>
          Dashboard
        </NavLink>
        <NavLink href="/companies" NavIcon={Buildings}>
          Empresas
        </NavLink>
        <NavLink href="/users" NavIcon={User}>
          Usuários
        </NavLink>
      </NavSection>
    </Stack>
  )
}
