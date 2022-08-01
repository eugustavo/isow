import * as yup from 'yup'

export const signInFormSchema = yup.object().shape({
  email: yup
    .string()
    .email('Formato inválido')
    .required('E-mail é obrigatorio'),
  password: yup.string().required('Senha é obrigatório'),
})
