import styled from "styled-components"

export type ButtonColors = "primary" | "secondary" | "danger" | "success"

export type ButtonContainerProps = {
  variant: ButtonColors
}

export type ButtonVariants = {
  [B in ButtonColors]: string
}

const buttonVariants: ButtonVariants = {
  primary: "purple",
  secondary: "orange",
  danger: "red",
  success: "green"
}

export const ButtonContainer = styled.button<ButtonContainerProps>`
  width: 100px;
  height: 40px;

  ${props => {
    return `background-color: ${buttonVariants[props.variant]}`
  }}
`
