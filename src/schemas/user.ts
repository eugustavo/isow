import * as yup from 'yup'

export const userFormSchema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório'),
  email: yup
    .string()
    .email('Formato inválido')
    .required('E-mail é obrigatorio'),
  cpf: yup.string().required('CPF é obrigatório'),
  cnpj: yup.string().required('CNPJ é obrigatório'),
})
