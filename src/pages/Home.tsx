import { Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import styled from 'styled-components'
import { useState } from 'react'

const createCycleInput = z.object({
  task: z.string().min(3),
  minutes: z.number().min(5).max(60),
})

type CreateCycleInput = z.infer<typeof createCycleInput>

type Cycle = CreateCycleInput & { id: string }

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const { register, reset, handleSubmit, watch } = useForm<CreateCycleInput>({
    resolver: zodResolver(createCycleInput),
    defaultValues: {
      task: '',
      minutes: 0,
    },
  })
  function handleCreateNewCycle(cycleInput: CreateCycleInput) {
    const id = String(new Date().getTime())
    const newCycle: Cycle = {
      id,
      ...cycleInput,
    }
    setCycles((state) => [...state, newCycle])
    setActiveCycleId(id)
    reset()
  }
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)
  const task = watch('task')
  const formWasNotFilled = !task
  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <InputContainer>
          <label htmlFor="">I&apos;m going to work on...</label>
          <TaskInput
            id="task"
            list="task-suggestions"
            placeholder="add your task name"
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
            placeholder="00"
            step={5}
            min={5}
            max={60}
            {...register('minutes', { valueAsNumber: true })}
          />
          <span>minutes</span>
        </InputContainer>
        <CountdownContainer>
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountdownContainer>
        <StartCountDownButton disabled={formWasNotFilled} type="submit">
          <Play size={24} />
          Start
        </StartCountDownButton>
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

const StartCountDownButton = styled.button`
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
  background: ${(props) => props.theme['green-500']};
  color: ${(props) => props.theme['gray-100']};

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    background: ${(props) => props.theme['green-700']};
  }
`
