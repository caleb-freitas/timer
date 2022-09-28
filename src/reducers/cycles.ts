import { ActionType, CycleState } from '../@types/cycles'

export const cyclesReducer = (state: CycleState, action: any) => {
  if (action.type === ActionType.CreateNewCycle) {
    return {
      ...state,
      cycles: [...state.cycles, action.payload.newCycle],
      activeCycleId: action.payload.newCycle.id,
    }
  }
  if (action.type === ActionType.InterruptCurrentCycle) {
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
  if (action.type === ActionType.MarkCurrentCycleAsFinished) {
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
}
