import { createContext, useReducer, useState } from 'react'

import {
  ActionType,
  CreateCycleInput,
  Cycle,
  CycleContextProps,
  CycleContextProviderProps,
} from '../@types/cycles'
import {
  createNewCycleAction,
  interruptCurrentCycleAction,
  markCurrentCycleAsFinishedAction,
} from '../reducers/cycles/actions'
import { cyclesReducer } from '../reducers/cycles/reducer'

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
    dispatch(createNewCycleAction(newCycle))
    setSecondsPassed(0)
  }

  function interruptCurrentCycle() {
    dispatch(interruptCurrentCycleAction())
  }

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction())
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
