import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import Link from 'next/link'
import { CaretDown, UserPlus } from 'phosphor-react'
import { useEffect, useState } from 'react'
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore'

import { Header } from '../../components/Header'
import { Pagination } from '../../components/Pagination'
import { Sidebar } from '../../components/Sidebar'
import { db } from '../../services/firebase'
import { ModalAction } from '../../components/ModalAction'

interface UserFromFirebase {
  id: string
  name: {
    stringValue: string
  }
  email: {
    stringValue: string
  }
  cpf: {
    stringValue: string
  }
  cnpj: {
    stringValue: string
  }
}

export default function UserList() {
  const [users, setUsers] = useState<UserFromFirebase[]>([])
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(false)

  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const isWideVersion = useBreakpointValue({
    base: false,
    md: true,
  })

  useEffect(() => {
    async function loadUsers() {
      setLoading(true)
      const query = await getDocs(collection(db, 'users'))
      const usersFromFirebase: UserFromFirebase[] = []

      query.docs.forEach((doc: any) => {
        usersFromFirebase.push({
          id: doc.id,
          ...doc._document.data.value.mapValue.fields,
        })
      })

      setUsers(usersFromFirebase)
      setTimeout(() => {
        setLoading(false)
      }, 500)
    }

    loadUsers()
  }, [])

  function handleOpenModal(id: string) {
    setUserId(id)
    onOpen()
  }

  async function handleDeleteUser() {
    try {
      await deleteDoc(doc(db, 'users', userId))
      setUsers(users.filter((user) => user.id !== userId))
      onClose()

      toast({
        title: 'Usuário removido',
        description: 'Usuário deletado com sucesso',
        status: 'success',
        position: 'top',
        duration: 5000,
        isClosable: true,
      })
    } catch (err) {
      toast({
        title: 'Erro ao remover',
        description: 'Não foi possível remover o usuário, tente novamente',
        status: 'error',
        position: 'top',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  return (
    <>
      <Box>
        <Header />

        <Flex w="100%" my="6" mx="auto" px="6" maxWidth={1480}>
          <Sidebar />

          <Box flex="1" borderRadius={8} p="8">
            <Flex mb="8" justify="space-between" align="center">
              <Heading size="lg">Usuários</Heading>

              <Link href="users/create" passHref>
                <Button
                  as="a"
                  size="sm"
                  fontSize="sm"
                  bg="primary"
                  color="white"
                  leftIcon={<Icon as={UserPlus} fontSize="20" />}
                  cursor="pointer"
                  _hover={{ bg: 'primaryHover' }}
                >
                  Criar novo
                </Button>
              </Link>
            </Flex>

            {loading ? (
              <Stack>
                <Skeleton height="40px" />
                <Skeleton height="20px" />
                <Skeleton height="20px" />
                <Skeleton height="20px" />
                <Skeleton height="20px" />
              </Stack>
            ) : users.length > 0 ? (
              <Table colorScheme="blue">
                <Thead>
                  <Tr>
                    <Th>Usuário</Th>
                    {isWideVersion && <Th>CPF</Th>}
                    {isWideVersion && <Th>Empresa</Th>}
                    <Th />
                  </Tr>
                </Thead>
                <Tbody>
                  {users.map((user) => (
                    <Tr key={user.id}>
                      <Td>
                        <Box>
                          <Text fontWeight="bold">{user.name.stringValue}</Text>
                          <Text fontSize="small" color="gray.500">
                            {user.email.stringValue}
                          </Text>
                        </Box>
                      </Td>
                      {isWideVersion && <Td>{user.cpf.stringValue}</Td>}
                      {isWideVersion && <Td>{user.cnpj.stringValue}</Td>}
                      <Td>
                        <Menu>
                          <MenuButton
                            as={Button}
                            rightIcon={<Icon as={CaretDown} />}
                            bg="primary"
                            color="white"
                            cursor="pointer"
                            _hover={{ bg: 'primaryHover' }}
                          >
                            Ações
                          </MenuButton>
                          <MenuList>
                            <MenuItem>Editar</MenuItem>
                            <MenuItem onClick={() => handleOpenModal(user.id)}>
                              Deletar
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Box w="100%" alignItems="center" py="12">
                <Text fontSize="xl" fontWeight="bold" color="gray.400">
                  Nenhum usuário encontrado
                </Text>
              </Box>
            )}

            <Pagination />
          </Box>
        </Flex>
      </Box>

      <ModalAction
        isOpen={isOpen}
        onClose={onClose}
        title="Remover usuário"
        message="Deseja remover esse usuário? Essa ação não poderá ser revertida"
        actionText="Remover usuário"
        onAction={handleDeleteUser}
      />
    </>
  )
}
