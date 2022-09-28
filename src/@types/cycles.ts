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
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  secondsPassed: number
  markCurrentCycleAsFinished: () => void
  setSecondsPassedAmount: (seconds: number) => void
}
