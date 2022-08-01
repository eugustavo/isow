import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
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
  VStack,
} from '@chakra-ui/react'
import Link from 'next/link'
import { CaretDown, UserPlus } from 'phosphor-react'
import { useEffect, useMemo, useState } from 'react'
import { collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'

import { Header } from '../../components/Header'
import { Pagination } from '../../components/Pagination'
import { Sidebar } from '../../components/Sidebar'
import { db } from '../../services/firebase'
import { ModalAction } from '../../components/ModalAction'
import { ModalEdit } from '../../components/ModalToEdit'
import { Input } from '../../components/Form/Input'
import { SubmitHandler, useForm } from 'react-hook-form'
import { UseFormData } from './create'
import { userFormSchema } from '../../schemas/user'
import { yupResolver } from '@hookform/resolvers/yup'
import InputMask from 'react-input-mask'

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
  const [user, setUser] = useState<UserFromFirebase>()
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false)
  const [openToEdit, setOpenToEdit] = useState(false);

  const { register, reset, handleSubmit, formState } = useForm<UseFormData>({
    resolver: yupResolver(userFormSchema),
    defaultValues: useMemo(() => {
      return {
        name: user?.name?.stringValue,
        email: user?.email?.stringValue,
        cpf: user?.cpf?.stringValue,
        cnpj: user?.cnpj?.stringValue,
      }
    }, [user])
  })
  const { errors } = formState

  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const isWideVersion = useBreakpointValue({
    base: false,
    md: true,
  })

  useEffect(() => {
    reset({
      name: user?.name?.stringValue,
      email: user?.email?.stringValue,
      cpf: user?.cpf?.stringValue,
      cnpj: user?.cnpj?.stringValue,
    })
  }, [user])

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
  }, [userId])

  function handleOpenModal(id: string) {
    setUserId(id)
    onOpen()
  }

  function handleOpenModalEdit(user: UserFromFirebase) {
    setUser(user)
    setUserId(user.id)
    setOpenToEdit(true)
  }

  function handleCloseModalEdit() {
    setUser({} as UserFromFirebase)
    setUserId('')
    setOpenToEdit(false)
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

  const handleUpdateUser: SubmitHandler<UseFormData> = async (data) => {
    try {
      if (user) {
        const userRef = doc(db, "users", user.id)
        const updatedUser = {
          name: data.name,
          email: data.email,
          cpf: data.cpf,
          cnpj: data.cnpj,
        }

        await updateDoc(userRef, updatedUser); 
      }
      
      toast({
        title: 'Usuário editado',
        description: 'Usuário editado com sucesso',
        status: 'success',
        position: 'top',
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Erro ao editar',
        description: 'Não foi possível editar o usuário, tente novamente',
        status: 'error',
        position: 'top',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setOpenToEdit(false)
      setUser({} as UserFromFirebase)
      setUserId('')
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
                            <MenuItem onClick={() => handleOpenModalEdit(user)}>Editar</MenuItem>
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

      <ModalEdit
        isOpen={openToEdit}
        onClose={handleCloseModalEdit}
        title="Editar usuário"
      >
        <Box
          as="form"
          onSubmit={handleSubmit(handleUpdateUser)}
          flex="1"
          borderRadius={8}
          p="4"
        >
          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing="4" w="100%">
              <Input
                label="Nome completo"
                placeholder="Example Isow"
                error={errors.name}
                {...register('name')}
              />

              <Input
                label="E-mail"
                placeholder="example@isow.com"
                error={errors.email}
                {...register('email')}
              />
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing="4" w="100%">
              <Input
                as={InputMask}
                mask="***.***.***-**"
                label="CPF"
                placeholder="000.000.000-00"
                error={errors.cpf}
                {...register('cpf')}
              />

              <Input
                as={InputMask}
                mask="**.***.***/****-**"
                label="Empresa"
                placeholder="000.000.000/0000-00"
                error={errors.cnpj}
                {...register('cnpj')}
              />
            </SimpleGrid>
          </VStack>

          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Button as="a" colorScheme="red" onClick={handleCloseModalEdit}>
                Cancelar
              </Button>
              <Button
                bg="primary"
                color="white"
                _hover={{ bg: 'primaryHover' }}
                type="submit"
              >
                Salvar
              </Button>
            </HStack>
          </Flex>
        </Box>
      </ModalEdit>
    </>
  )
}
