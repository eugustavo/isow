import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { addDoc, collection } from 'firebase/firestore'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { SubmitHandler, useForm } from 'react-hook-form'
import InputMask from 'react-input-mask'
import { Input } from '../../components/Form/Input'

import { Header } from '../../components/Header'
import { Sidebar } from '../../components/Sidebar'
import { companyFormSchema } from '../../schemas/company'
import { db } from '../../services/firebase'

interface CompanyFormData {
  name: string
  email: string
  cnpj: string
}

export default function CreateCompany() {
  const { register, handleSubmit, formState } = useForm<CompanyFormData>({
    resolver: yupResolver(companyFormSchema),
  })
  const { errors } = formState
  const router = useRouter()
  const toast = useToast()

  const handleAddCompany: SubmitHandler<CompanyFormData> = async (data) => {
    try {
      await addDoc(collection(db, 'companies'), {
        name: data.name,
        email: data.email,
        cnpj: data.cnpj,
      })

      toast({
        title: 'Empresa cadastrada',
        description: 'Empresa cadastrada com sucesso',
        status: 'success',
        position: 'top',
        duration: 5000,
        isClosable: true,
      })

      router.push('/companies')
    } catch (error) {
      console.log(error)
      toast({
        title: 'Erro ao cadastrar',
        description: 'Não foi possível cadastrar a empresa, tente novamente',
        status: 'error',
        position: 'top',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  return (
    <Box>
      <Header />

      <Flex w="100%" my="6" mx="auto" px="6" maxWidth={1480}>
        <Sidebar />

        <Box
          as="form"
          onSubmit={handleSubmit(handleAddCompany)}
          flex="1"
          borderRadius={8}
          p={['6', '8']}
        >
          <Heading size="lg">Cadastrar empresa</Heading>

          <Divider borderColor="gray.400" my="6" />

          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
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

            <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
              <Input
                as={InputMask}
                mask="**.***.***/****-**"
                maskChar={null}
                label="CNPJ"
                placeholder="000.000.000/0000-00"
                error={errors.cnpj}
                {...register('cnpj')}
              />
            </SimpleGrid>
          </VStack>

          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link href="/companies" passHref>
                <Button as="a" colorScheme="red">
                  Cancelar
                </Button>
              </Link>
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
      </Flex>
    </Box>
  )
}
