// Stepper
export const STEP_NEXT = "STEP_NEXT"
export const STEP_BACK = "STEP_BACK"

// NamingStep
export const SET_DAO_NAME = "SET_DAO_NAME"
export const SET_TOKEN_NAME = "SET_TOKEN_NAME"
export const SET_TOKEN_SYMBOL = "SET_TOKEN_SYMBOL"

// FoundersStep
export const SET_FOUNDERS_ARRAY = "SET_FOUNDERS_ARRAY"
export const ADD_FOUNDER_ADDRESS = "ADD_FOUNDER_ADDRESS"
export const REMOVE_FOUNDER_ADDRESS = "REMOVE_FOUNDER_ADDRESS"

export const setFoundersArray = (founders: Agent[]) => ({
  type: SET_FOUNDERS_ARRAY,
  value: founders,
})

export const addFounderAddress = (founder: Agent) => ({
  type: ADD_FOUNDER_ADDRESS,
  value: founder,
})

export const removeFounderAddress = (founder: Agent) => ({
  type: REMOVE_FOUNDER_ADDRESS,
  value: founder,
})

export const setDaoName = (name: string) => ({
  type: SET_DAO_NAME,
  value: name,
})

export const setTokenName = (name: string) => ({
  type: SET_TOKEN_NAME,
  value: name,
})

export const setTokenSymbol = (symbol: string) => ({
  type: SET_TOKEN_SYMBOL,
  value: symbol,
})

export const stepNext = () => ({
  type: STEP_NEXT,
})

export const stepBack = () => ({
  type: STEP_BACK,
})
