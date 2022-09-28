import { createContext, useReducer, useState } from 'react'

import {
  ActionType,
  CreateCycleInput,
  Cycle,
  CycleContextProps,
  CycleContextProviderProps,
} from '../@types/cycles'
import { cyclesReducer } from '../reducers/cycles'

export const CycleContext = createContext({} as CycleContextProps)

export function CycleContextProvider({ children }: CycleContextProviderProps) {
  const [secondsPassed, setSecondsPassed] = useState(0)
  const [cycleState, dispatch] = useReducer(cyclesReducer, {
    cycles: [],
    activeCycleId: '',
  })

  const { cycles, activeCycleId } = cycleState
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

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
    dispatch({
      type: ActionType.CreateNewCycle,
      payload: {
        newCycle,
      },
    })
    setSecondsPassed(0)
  }

  function interruptCurrentCycle() {
    dispatch({
      type: ActionType.InterruptCurrentCycle,
      payload: {
        activeCycleId,
      },
    })
  }

  function markCurrentCycleAsFinished() {
    dispatch({
      type: ActionType.MarkCurrentCycleAsFinished,
      payload: {
        activeCycleId,
      },
    })
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
