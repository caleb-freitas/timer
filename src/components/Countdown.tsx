import { useContext, useEffect } from 'react'
import styled from 'styled-components'
import { differenceInSeconds } from 'date-fns'
import { CycleContext } from '../pages/Home'

export function Countdown() {
  const {
    activeCycle,
    activeCycleId,
    markCurrentCycleAsFinished,
    secondsPassed,
    setSecondsPassedAmount,
  } = useContext(CycleContext)

  const seconds = activeCycle ? activeCycle.minutes * 60 : 0

  // format the past minutes and seconds
  const currentSeconds = activeCycle ? seconds - secondsPassed : 0
  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60
  const minutesFormatted = String(minutesAmount).padStart(2, '0')
  const secondsFormatted = String(secondsAmount).padStart(2, '0')

  // reduce the countdown by one second
  useEffect(() => {
    let interval: number
    if (activeCycle) {
      interval = setInterval(() => {
        // calculate the difference between the current time and the start time
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate,
        )
        // handle finished countdown
        if (secondsDifference >= seconds) {
          markCurrentCycleAsFinished()
          setSecondsPassedAmount(seconds)
          clearInterval(interval)
        } else {
          setSecondsPassedAmount(secondsDifference)
        }
      }, 1000)
    }
    return () => {
      clearInterval(interval)
    }
  }, [
    activeCycle,
    seconds,
    activeCycleId,
    markCurrentCycleAsFinished,
    setSecondsPassedAmount,
  ])

  return (
    <CountdownContainer>
      <span>{minutesFormatted[0]}</span>
      <span>{minutesFormatted[1]}</span>
      <Separator>:</Separator>
      <span>{secondsFormatted[0]}</span>
      <span>{secondsFormatted[1]}</span>
    </CountdownContainer>
  )
}

const CountdownContainer = styled.div`
  font-family: 'Roboto mono', monospace;
  font-size: 10rem;
  line-height: 8rem;
  color: ${(props) => props.theme['gray-100']};
  display: flex;
  gap: 1rem;

  span {
    background: ${(props) => props.theme['gray-700']};
    padding: 2rem 1rem;
    border-radius: 8px;
  }
`

const Separator = styled.div`
  padding: 2rem 0;
  color: ${(props) => props.theme['green-500']};
  width: 4rem;
  overflow: hidden;
  display: flex;
  justify-content: center;
`
