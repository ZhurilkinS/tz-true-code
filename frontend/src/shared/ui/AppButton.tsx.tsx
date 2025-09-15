import { Button, type ButtonProps as BootstrapButtonProps } from 'react-bootstrap'

interface AppButtonProps extends BootstrapButtonProps {
  children: React.ReactNode
}

export const AppButton = ({ children, ...props }: AppButtonProps) => {
  return <Button {...props}>{children}</Button>
}