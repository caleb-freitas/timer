import { HandPalm, Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { differenceInSeconds } from 'date-fns'

const createCycleInput = z.object({
  task: z.string().min(3),
  minutes: z.number().min(5).max(60),
})

type CreateCycleInput = z.infer<typeof createCycleInput>

type Cycle = CreateCycleInput & {
  id: string
  startDate: Date
  stopDate?: Date
  finishedDate?: Date
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [secondsPassed, setSecondsPassed] = useState(0)
  const { register, reset, handleSubmit, watch } = useForm<CreateCycleInput>({
    resolver: zodResolver(createCycleInput),
    defaultValues: {
      task: '',
      minutes: 25,
    },
  })
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)
  const seconds = activeCycle ? activeCycle.minutes * 60 : 0
  useEffect(() => {
    let interval: number
    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate,
        )
        if (secondsDifference >= seconds) {
          setCycles((state) =>
            state.map((cycle) => {
              if (cycle.id === activeCycleId) {
                return {
                  ...cycle,
                  finishedDate: new Date(),
                }
              }
              return cycle
            }),
          )
          setSecondsPassed(seconds)
          clearInterval(interval)
        } else {
          setSecondsPassed(secondsDifference)
        }
      }, 1000)
    }
    return () => {
      clearInterval(interval)
    }
  }, [activeCycle, seconds, activeCycleId])
  function handleStartCycle(cycleInput: CreateCycleInput) {
    const id = String(new Date().getTime())
    const newCycle: Cycle = {
      id,
      startDate: new Date(),
      ...cycleInput,
    }
    setCycles((state) => [...state, newCycle])
    setActiveCycleId(id)
    setSecondsPassed(0)
    reset()
  }
  function handleStopCycle() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return {
            ...cycle,
            stopDate: new Date(),
          }
        }
        return cycle
      }),
    )
    setActiveCycleId(null)
  }
  const currentSeconds = activeCycle ? seconds - secondsPassed : 0
  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60
  const minutesFormatted = String(minutesAmount).padStart(2, '0')
  const secondsFormatted = String(secondsAmount).padStart(2, '0')
  const task = watch('task')
  const formWasNotFilled = !task
  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleStartCycle)} action="">
        <InputContainer>
          <label htmlFor="">I&apos;m going to work on...</label>
          <TaskInput
            id="task"
            list="task-suggestions"
            placeholder="add your task name"
            disabled={!!activeCycle}
            {...register('task')}
          />
          <datalist id="task-suggestions">
            <option value="Project 1"></option>
            <option value="Project 2"></option>
          </datalist>
          <label htmlFor="">during</label>
          <MinutesInput
            id="minutes"
            type="number"
            min={5}
            max={60}
            disabled={!!activeCycle}
            {...register('minutes', { valueAsNumber: true })}
          />
          <span>minutes</span>
        </InputContainer>
        <CountdownContainer>
          <span>{minutesFormatted[0]}</span>
          <span>{minutesFormatted[1]}</span>
          <Separator>:</Separator>
          <span>{secondsFormatted[0]}</span>
          <span>{secondsFormatted[1]}</span>
        </CountdownContainer>
        {activeCycle ? (
          <StopCountDownButton onClick={handleStopCycle} type="button">
            <HandPalm size={24} />
            Stop
          </StopCountDownButton>
        ) : (
          <StartCountdownButton disabled={formWasNotFilled} type="submit">
            <Play size={24} />
            Start
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}

const HomeContainer = styled.main`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3.5rem;
  }
`

const InputContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: ${(props) => props.theme['gray-100']};
  font-size: 1.125rem;
  font-weight: bold;
  flex-wrap: wrap;
`

const BaseInput = styled.input`
  background: transparent;
  height: 2rem;
  border: 0;
  border-bottom: 2px solid ${(props) => props.theme['gray-500']};
  font-weight: bold;
  font-size: 1.125rem;
  padding: 0 0.5rem;
  color: ${(props) => props.theme['gray-100']};

  &:focus {
    box-shadow: none;
    border-color: ${(props) => props.theme['green-500']};
  }

  &::placeholder {
    color: ${(props) => props.theme['gray-500']};
  }
`

const TaskInput = styled(BaseInput)`
  flex: 1;

  &::-webkit-calendar-picker-indicator {
    display: none !important;
  }
`

const MinutesInput = styled(BaseInput)`
  width: 4rem;
`

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

const BaseCountDownButton = styled.button`
  width: 100%;
  border: 0;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: bold;
  cursor: pointer;
  color: ${(props) => props.theme['gray-100']};

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`

const StartCountdownButton = styled(BaseCountDownButton)`
  background: ${(props) => props.theme['green-500']};

  &:not(:disabled):hover {
    background: ${(props) => props.theme['green-700']};
  }
`

const StopCountDownButton = styled(BaseCountDownButton)`
  background: ${(props) => props.theme['red-500']};

  &:not(:disabled):hover {
    background: ${(props) => props.theme['red-700']};
  }
`
