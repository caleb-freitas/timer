import { ThemeProvider } from 'styled-components'
import { Optional } from './@types/utils'
import { ButtonContainer, ButtonContainerProps } from './Button.styles'
import { GlobalStyle } from './styles/global'
import { defaultTheme } from './styles/themes/default'

export type ButtonProps = Optional<ButtonContainerProps, 'variant'>

export function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <ButtonContainer variant="danger">Send</ButtonContainer>
      <ButtonContainer variant="primary">Send</ButtonContainer>
      <ButtonContainer variant="success">Send</ButtonContainer>
      <ButtonContainer variant="secondary">Send</ButtonContainer>
      <ButtonContainer>Send</ButtonContainer>

      <GlobalStyle />
    </ThemeProvider>
  )
}
