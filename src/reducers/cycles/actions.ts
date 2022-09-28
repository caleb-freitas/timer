import { ActionType, Cycle } from '../../@types/cycles'

export const createNewCycleAction = (newCycle: Cycle) => ({
  type: ActionType.CreateNewCycle,
  payload: { newCycle },
})

export const interruptCurrentCycleAction = () => ({
  type: ActionType.InterruptCurrentCycle,
})

export const markCurrentCycleAsFinishedAction = () => ({
  type: ActionType.MarkCurrentCycleAsFinished,
})
