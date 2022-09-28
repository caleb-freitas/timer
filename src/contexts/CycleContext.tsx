import { createContext, ReactNode, useReducer, useState } from 'react'
import { CreateCycleInput, Cycle, CycleContextProps } from '../@types/cycles'

export const CycleContext = createContext({} as CycleContextProps)

type CycleContextProviderProps = {
  children: ReactNode
}

type CycleState = {
  cycles: Cycle[]
  activeCycleId: string | null
}

export function CycleContextProvider({ children }: CycleContextProviderProps) {
  const [secondsPassed, setSecondsPassed] = useState(0)
  const [cycleState, dispatch] = useReducer(
    (state: CycleState, action: any) => {
      if (action.type === 'createNewCycle') {
        return {
          ...state,
          cycles: [...state.cycles, action.payload.newCycle],
          activeCycleId: action.payload.newCycle.id,
        }
      }
      if (action.type === 'interruptCurrentCycle') {
        return {
          ...state,
          cycles: state.cycles.map((cycle) => {
            if (cycle.id === state.activeCycleId) {
              return {
                ...cycle,
                stopDate: new Date(),
              }
            }
            return cycle
          }),
          activeCycleId: null,
        }
      }
      if (action.type === 'markCurrentCycleAsFinished') {
        return {
          ...state,
          cycles: state.cycles.map((cycle) => {
            if (cycle.id === state.activeCycleId) {
              return {
                ...cycle,
                finishedDate: new Date(),
              }
            }
            return cycle
          }),
          activeCycleId: '',
        }
      }
      return state
    },
    {
      cycles: [],
      activeCycleId: '',
    },
  )

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
      type: 'createNewCycle',
      payload: {
        newCycle,
      },
    })
    setSecondsPassed(0)
  }

  function interruptCurrentCycle() {
    dispatch({
      type: 'interruptCurrentCycle',
      payload: {
        activeCycleId,
      },
    })
  }

  function markCurrentCycleAsFinished() {
    dispatch({
      type: 'markCurrentCycleAsFinished',
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
