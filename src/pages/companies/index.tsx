import {
  Box,
  Button,
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
import { yupResolver } from '@hookform/resolvers/yup'
import { collection, deleteDoc, doc, DocumentData, getDocs, QueryDocumentSnapshot, updateDoc } from 'firebase/firestore'
import Link from 'next/link'
import { CaretDown, Plus } from 'phosphor-react'
import { useEffect, useMemo, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import InputMask from 'react-input-mask'
import { Input } from '../../components/Form/Input'

import { Header } from '../../components/Header'
import { ModalAction } from '../../components/ModalAction'
import { ModalEdit } from '../../components/ModalToEdit'
import { Pagination } from '../../components/Pagination'
import { Sidebar } from '../../components/Sidebar'
import { companyFormSchema } from '../../schemas/company'
import { db } from '../../services/firebase'
import { CompanyFormData } from './create'

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

interface FirebaseReturnData extends QueryDocumentSnapshot<DocumentData> {
  _document: {
    data: Object
  }
}

export default function CompaniesList() {
  const [companies, setCompanies] = useState<CompanyFromFirebase[]>([])
  const [company, setCompany] = useState<CompanyFromFirebase>()
  const [companyId, setCompanyId] = useState('')
  const [loading, setLoading] = useState(false)
  const [openToEdit, setOpenToEdit] = useState(false);

  const { register, reset, handleSubmit, formState } = useForm<CompanyFormData>({
    resolver: yupResolver(companyFormSchema),
    defaultValues: useMemo(() => {
      return {
        name: company?.name?.stringValue,
        email: company?.email?.stringValue,
        cnpj: company?.cnpj?.stringValue,
      }
    }, [company])
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
      name: company?.name?.stringValue,
      email: company?.email?.stringValue,
      cnpj: company?.cnpj?.stringValue,
    })
  }, [company])

  useEffect(() => {
    async function loadCompanies() {
      setLoading(true)
      const query = await getDocs(collection(db, 'companies'))
      const companiesFromFirebase: CompanyFromFirebase[] = []

      query.docs.forEach((doc: any) => {
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
  }, [companyId])

  function handleOpenModal(id: string) {
    setCompanyId(id)
    onOpen()
  }

  function handleOpenModalEdit(company: CompanyFromFirebase) {
    setCompany(company)
    setCompanyId(company.id)
    setOpenToEdit(true)
  }

  function handleCloseModalEdit() {
    setCompany({} as CompanyFromFirebase)
    setCompanyId('')
    setOpenToEdit(false)
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

  const handleUpdateCompany: SubmitHandler<CompanyFormData> = async (data) => {
    try {
      if (company) {
        const companyRef = doc(db, "companies", company.id)
        const updatedCompany = {
          name: data.name,
          email: data.email,
          cnpj: data.cnpj,
        }

        await updateDoc(companyRef, updatedCompany); 
      }
      
      toast({
        title: 'Empresa editada',
        description: 'Empresa editada com sucesso',
        status: 'success',
        position: 'top',
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Erro ao editar',
        description: 'Não foi possível editar a empresa, tente novamente',
        status: 'error',
        position: 'top',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setOpenToEdit(false)
      setCompany({} as CompanyFromFirebase)
      setCompanyId('')
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
                    {isWideVersion && <Th>CPF</Th>}
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
                      {isWideVersion && <Td>{company.cnpj.stringValue}</Td>}
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
                            <MenuItem onClick={() => handleOpenModalEdit(company)}>Editar</MenuItem>
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
              <Box w="100%" alignItems="center" py="12">
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

      <ModalEdit
        isOpen={openToEdit}
        onClose={handleCloseModalEdit}
        title="Editar empresa"
      >
        <Box
          as="form"
          onSubmit={handleSubmit(handleUpdateCompany)}
          flex="1"
          borderRadius={8}
          p="4"
        >
          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing="4" w="100%">
              <Input
                label="Razão Social"
                placeholder="Isow LTDA"
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
