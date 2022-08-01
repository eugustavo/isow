import { useRouter } from 'next/router'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

interface User {
  name: string
  email: string
  avatar_url?: string
}

interface AuthContextProps {
  children: ReactNode
}

interface AuthContextData {
  user: User
  signIn: (credentials: User) => void
  signOut: () => void
}

const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: AuthContextProps) {
  const [user, setUser] = useState<User>({} as User)
  const router = useRouter()

  useEffect(() => {
    function loadUser() {
      const user = localStorage.getItem('@ISOW:user')

      if (user) {
        setUser(JSON.parse(user))
      }
    }

    loadUser()
  }, [])

  function handleSignIn(credentials: User) {
    const user = {
      name: credentials.name,
      email: credentials.email,
      avatar_url: credentials.avatar_url,
    }

    localStorage.setItem('@ISOW:user', JSON.stringify(user))
    setUser(user)
  }

  function handleSignOut() {
    router.push('/')

    localStorage.removeItem('@ISOW:user')
    setUser({} as User)
  }

  const value = useMemo(
    () => ({
      user,
      signIn: handleSignIn,
      signOut: handleSignOut,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
