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

interface ModalActionProps {
  isOpen: boolean
  onClose: () => void
  onAction: () => void
  title: string
  message: string
  actionText: string
}

export function ModalAction({
  isOpen = false,
  onClose,
  onAction,
  title,
  message,
  actionText,
}: ModalActionProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>{message}</Text>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="outline" colorScheme="red" onClick={onAction}>
            {actionText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
