import { ElementType } from 'react'
import { Icon, Link, Text, LinkProps } from '@chakra-ui/react'
import { ActiveLink } from '../../ActiveLink'

interface NavLinkProps extends LinkProps {
  children: string
  NavIcon: ElementType
  href: string
}

export function NavLink({
  children,
  NavIcon,
  href = '',
  ...rest
}: NavLinkProps) {
  return (
    <ActiveLink href={href} passHref>
      <Link
        display="flex"
        align="center"
        color="gray.500"
        px="4"
        py="1"
        rounded="md"
        {...rest}
      >
        <Icon as={NavIcon} fontSize="20" />
        <Text ml="2" fontSize="medium">
          {children}
        </Text>
      </Link>
    </ActiveLink>
  )
}
