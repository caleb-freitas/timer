import { differenceInSeconds } from 'date-fns'
import { createContext, useEffect, useReducer, useState } from 'react'

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
  const [cycleState, dispatch] = useReducer(
    cyclesReducer,
    {
      cycles: [],
      activeCycleId: '',
    },
    () => {
      const storedCycleStateJSON = localStorage.getItem(
        '@timer:cycles-state-1.0.0',
      )
      if (storedCycleStateJSON) {
        return JSON.parse(storedCycleStateJSON)
      }
    },
  )

  useEffect(() => {
    const cycleStateJSON = JSON.stringify(cycleState)
    localStorage.setItem('@timer:cycles-state-1.0.0', cycleStateJSON)
  }, [cycleState])

  const { cycles, activeCycleId } = cycleState
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  const [secondsPassed, setSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
    }
    return 0
  })

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
