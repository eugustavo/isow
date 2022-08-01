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
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore'
import Link from 'next/link'
import { CaretDown, Plus } from 'phosphor-react'
import { useEffect, useState } from 'react'

import { Header } from '../../components/Header'
import { ModalAction } from '../../components/ModalAction'
import { Pagination } from '../../components/Pagination'
import { Sidebar } from '../../components/Sidebar'
import { db } from '../../services/firebase'

interface CompanyFromFirebase {
  id: string
  name: {
    stringValue: string
  }
  email: {
    stringValue: string
  }
  cnpj: {
    stringValue: string
  }
}

export default function CompaniesList() {
  const [companies, setCompanies] = useState<CompanyFromFirebase[]>([])
  const [companyId, setCompanyId] = useState('')
  const [loading, setLoading] = useState(false)

  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    async function loadCompanies() {
      setLoading(true)
      const query = await getDocs(collection(db, 'companies'))
      const companiesFromFirebase: CompanyFromFirebase[] = []

      query.docs.forEach((doc) => {
        companiesFromFirebase.push({
          id: doc.id,
          ...doc._document.data.value.mapValue.fields,
        })
      })

      setCompanies(companiesFromFirebase)
      setTimeout(() => {
        setLoading(false)
      }, 500)
    }

    loadCompanies()
  }, [])

  function handleOpenModal(id: string) {
    setCompanyId(id)
    onOpen()
  }

  async function handleDeleteCompany() {
    try {
      await deleteDoc(doc(db, 'companies', companyId))
      setCompanies(companies.filter((company) => company.id !== companyId))
      onClose()

      toast({
        title: 'Empresa removida',
        description: 'Empresa deletada com sucesso',
        status: 'success',
        position: 'top',
        duration: 5000,
        isClosable: true,
      })
    } catch (err) {
      toast({
        title: 'Erro ao remover',
        description: 'Não foi possível remover a empresa, tente novamente',
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
              <Heading size="lg">Empresas</Heading>

              <Link href="companies/create" passHref>
                <Button
                  as="a"
                  size="sm"
                  fontSize="sm"
                  bg="primary"
                  color="white"
                  leftIcon={<Icon as={Plus} fontSize="16" />}
                  cursor="pointer"
                  _hover={{ bg: 'primaryHover' }}
                >
                  Cadastrar
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
            ) : companies.length > 0 ? (
              <Table colorScheme="blue">
                <Thead>
                  <Tr>
                    <Th>Empresa</Th>
                    <Th>CNPJ</Th>
                    <Th />
                  </Tr>
                </Thead>
                <Tbody>
                  {companies.map((company) => (
                    <Tr key={company.id}>
                      <Td>
                        <Box>
                          <Text fontWeight="bold">
                            {company.name.stringValue}
                          </Text>
                          <Text fontSize="small" color="gray.500">
                            {company.email.stringValue}
                          </Text>
                        </Box>
                      </Td>
                      <Td>{company.cnpj.stringValue}</Td>
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
                            <MenuItem
                              onClick={() => handleOpenModal(company.id)}
                            >
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
              <Box w="100%" align="center" py="12">
                <Text fontSize="xl" fontWeight="bold" color="gray.400">
                  Nenhuma empresa encontrada
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
        title="Remover empresa"
        message="Deseja remover essa empresa? Essa ação não poderá ser revertida"
        actionText="Remover empresa"
        onAction={handleDeleteCompany}
      />
    </>
  )
}
