import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react'
import { ReactNode } from 'react'

interface ModalEditProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export function ModalEdit({
  isOpen = false,
  onClose,
  title,
  children,
}: ModalEditProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={['full', 'md']}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {children}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
