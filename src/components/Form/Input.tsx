import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input as ChakraInput,
  InputProps as ChakraInputProps,
} from '@chakra-ui/react'
import { forwardRef, ForwardRefRenderFunction } from 'react'
import { FieldError } from 'react-hook-form'
import { BeforeMaskedStateChangeStates } from 'react-input-mask'


interface InputProps extends ChakraInputProps {
  name: string
  label?: string
  error?: FieldError
  mask?: string
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { name, label, error = null, ...rest },
  ref,
) => {
  return (
    <FormControl isInvalid={!!error}>
      {label && (
        <FormLabel htmlFor={name} fontWeight="700">
          {label}
        </FormLabel>
      )}

      <ChakraInput ref={ref} id={name} name={name} {...rest} />
      {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  )
}

export const Input = forwardRef(InputBase)
