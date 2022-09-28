import { createContext, ReactNode, useState } from 'react'
import { CreateCycleInput, Cycle, CycleContextProps } from '../@types/cycles'

export const CycleContext = createContext({} as CycleContextProps)

type CycleContextProviderProps = {
  children: ReactNode
}

export function CycleContextProvider({ children }: CycleContextProviderProps) {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [secondsPassed, setSecondsPassed] = useState(0)
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function markCurrentCycleAsFinished() {
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
  }

  function setAmountOfSecondsElapsed(seconds: number) {
    setSecondsPassed(seconds)
  }

  function createNewCycle(cycleInput: CreateCycleInput) {
    const id = String(new Date().getTime())
    const newCycle: Cycle = {
      id,
      startDate: new Date(),
      ...cycleInput,
    }
    setCycles((state) => [...state, newCycle])
    setActiveCycleId(id)
    setSecondsPassed(0)
  }

  function interruptCurrentCycle() {
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

  return (
    <CycleContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        secondsPassed,
        createNewCycle,
        interruptCurrentCycle,
        setAmountOfSecondsElapsed,
        markCurrentCycleAsFinished,
      }}
    >
      {children}
    </CycleContext.Provider>
  )
}
