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
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Link from 'next/link'
import InputMask from 'react-input-mask'
import { Input } from '../../components/Form/Input'

import { Header } from '../../components/Header'
import { Sidebar } from '../../components/Sidebar'
import { userFormSchema } from '../../schemas/user'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '../../services/firebase'
import { useRouter } from 'next/router'

interface UseFormData {
  name: string
  email: string
  cpf: string
  cnpj: string
}

export default function CreateUser() {
  const { register, handleSubmit, formState } = useForm<UseFormData>({
    resolver: yupResolver(userFormSchema),
  })
  const { errors } = formState
  const router = useRouter()
  const toast = useToast()

  const handleCreateUser: SubmitHandler<UseFormData> = async (data) => {
    try {
      await addDoc(collection(db, 'users'), {
        name: data.name,
        email: data.email,
        cpf: data.cpf,
        cnpj: data.cnpj,
      })

      toast({
        title: 'Usuário criado',
        description: 'Usuário criado com sucesso',
        status: 'success',
        position: 'top',
        duration: 5000,
        isClosable: true,
      })

      router.push('/users')
    } catch (error) {
      console.log(error)
      toast({
        title: 'Erro ao criar',
        description: 'Não foi possível criar o usuário, tente novamente',
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
          onSubmit={handleSubmit(handleCreateUser)}
          flex="1"
          borderRadius={8}
          p={['6', '8']}
        >
          <Heading size="lg">Criar usúario</Heading>

          <Divider borderColor="gray.400" my="6" />

          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
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

            <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
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
              <Link href="/users" passHref>
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
