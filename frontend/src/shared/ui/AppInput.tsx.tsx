import { Form } from 'react-bootstrap'
import { type UseFormRegisterReturn } from 'react-hook-form'

interface AppInputProps {
  label?: string
  type?: string
  placeholder?: string
  register?: UseFormRegisterReturn
  error?: string
  className?: string
}

export const AppInput = ({
  label,
  type = 'text',
  placeholder,
  register,
  error,
  className,
  ...props
}: AppInputProps) => {
  return (
    <Form.Group className={className}>
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Control
        type={type}
        placeholder={placeholder}
        isInvalid={!!error}
        {...register}
        {...props}
      />
      {error && (
        <Form.Control.Feedback type="invalid">
          {error}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  )
}