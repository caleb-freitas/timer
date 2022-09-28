import { ReactNode } from 'react'
import { z } from 'zod'

export const createCycleInput = z.object({
  task: z.string().min(3),
  minutes: z.number().min(5).max(60),
})

export type CreateCycleInput = z.infer<typeof createCycleInput>

export type Cycle = CreateCycleInput & {
  id: string
  startDate: Date
  stopDate?: Date
  finishedDate?: Date
}

export type CycleContextProps = {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  secondsPassed: number
  interruptCurrentCycle: () => void
  markCurrentCycleAsFinished: () => void
  setAmountOfSecondsElapsed: (seconds: number) => void
  createNewCycle: (cycleInput: CreateCycleInput) => void
}

export type CycleContextProviderProps = {
  children: ReactNode
}

export type CycleState = {
  cycles: Cycle[]
  activeCycleId: string | null
}

export enum ActionType {
  CreateNewCycle = 'CreateNewCycle',
  InterruptCurrentCycle = 'InterruptCurrentCycle',
  MarkCurrentCycleAsFinished = 'MarkCurrentCycleAsFinished',
}
