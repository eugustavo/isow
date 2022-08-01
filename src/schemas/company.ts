import * as yup from 'yup'

export const companyFormSchema = yup.object().shape({
  name: yup.string().required('Razão social é obrigatório'),
  email: yup
    .string()
    .email('Formato inválido')
    .required('E-mail é obrigatorio'),
  cnpj: yup.string().required('CNPJ é obrigatório'),
})
