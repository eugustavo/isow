import {
  Box,
  Button,
  Divider,
  Flex,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { LogoLarge } from '../components/Logo'
import { Input } from '../components/Form/Input'
import { GoogleLogo } from 'phosphor-react'
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { auth } from '../services/firebase'
import { useRouter } from 'next/router'
import { useAuth } from '../context/auth'
import { signInFormSchema } from '../schemas/signIn'

type SignInFormData = {
  email: string
  password: string
}

export default function Home() {
  const { register, handleSubmit, formState } = useForm<SignInFormData>({
    resolver: yupResolver(signInFormSchema),
  })
  const { errors } = formState

  const { signIn } = useAuth()
  const toast = useToast()
  const router = useRouter()

  async function handleGoogleLogin() {
    const provider = new GoogleAuthProvider()

    try {
      const { user } = await signInWithPopup(auth, provider)

      if (user) {
        console.log(user)
        signIn({
          name: user.displayName || '',
          email: user.email || '',
          avatar_url: user.photoURL || '',
        })

        toast({
          title: 'Login feito com sucesso',
          description: 'Aproveite nossa plataforma!',
          status: 'success',
          position: 'top',
          duration: 9000,
          isClosable: true,
        })
      }

      router.push('/dashboard')
    } catch (err) {
      toast({
        title: 'Erro ao realizar login',
        description: 'Verifique seus dados e tente novamente',
        status: 'error',
        position: 'top',
        duration: 9000,
        isClosable: true,
      })
    }
  }

  const handleLogin: SubmitHandler<SignInFormData> = async (credentials) => {
    try {
      const { user } = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password,
      )

      console.log(user)

      if (user) {
        signIn({
          name: user?.email?.split('@')[0] || '',
          email: user.email || '',
        })

        toast({
          title: 'Login feito com sucesso',
          description: 'Aproveite nossa plataforma!',
          status: 'success',
          position: 'top',
          duration: 9000,
          isClosable: true,
        })
      }

      router.push('/dashboard')
    } catch (err) {
      console.log(err)
      toast({
        title: 'Erro ao realizar login',
        description: 'Verifique seus dados e tente novamente',
        status: 'error',
        position: 'top',
        duration: 9000,
        isClosable: true,
      })
    }
  }

  return (
    <Flex w="100vw" h="100vh" align="center" justify="center" bg="primary">
      <Flex
        as="form"
        rounded="md"
        bg="white"
        width="100%"
        maxWidth={360}
        p="8"
        flexDir="column"
        onSubmit={handleSubmit(handleLogin)}
      >
        <Box mb="8">
          <LogoLarge />
        </Box>

        <Stack spacing="4">
          <Input
            type="email"
            label="E-mail"
            error={errors.email}
            focusBorderColor="primary"
            bg="#fafafa"
            placeholder="example@isow.com"
            {...register('email')}
          />

          <Input
            type="password"
            label="Senha"
            error={errors.password}
            focusBorderColor="primary"
            bg="#fafafa"
            placeholder="*******"
            {...register('password')}
          />
        </Stack>

        <Button
          type="submit"
          mt="6"
          bg="primary"
          color="white"
          _hover={{
            bg: 'primaryHover',
          }}
          isLoading={formState.isSubmitting}
        >
          Entrar
        </Button>

        <Divider my="6" borderColor="#aaaaaa" />

        <Button
          bg="white"
          borderWidth={1}
          borderColor="primary"
          _hover={{
            bg: 'primary',
            color: 'white',
          }}
          onClick={handleGoogleLogin}
        >
          <GoogleLogo size={24} />
          <Text ml="2">Login com Google</Text>
        </Button>
      </Flex>
    </Flex>
  )
}
