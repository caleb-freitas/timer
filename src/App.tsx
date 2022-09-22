import { ButtonContainer, ButtonContainerProps } from "./Button.styles"

type Optional<T, K extends keyof T> = Pick<Partial<T>, K>

export type ButtonProps = Optional<ButtonContainerProps, "variant">

export function App({ variant = "primary" }: ButtonProps) {

  return (
    <>
      <ButtonContainer variant={variant}>Send</ButtonContainer>
      <ButtonContainer variant="danger">Send</ButtonContainer>
      <ButtonContainer variant="secondary">Send</ButtonContainer>
      <ButtonContainer variant="success">Send</ButtonContainer>
    </>
  )
}
