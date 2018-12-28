import { Action } from "redux"
export * from "redux"

export interface PayloadAction<TType, TPayload> extends Action<TType> {
  payload: TPayload
}

// tslint:disable-next-line:max-line-length
export function createAction<TAction extends Action<TAction["type"]>>(
  type: TAction["type"]
): () => Action<TAction["type"]> {
  return () => ({
    type,
  })
}

// tslint:disable-next-line:max-line-length
export function createPayloadAction<
  TAction extends PayloadAction<TAction["type"], TAction["payload"]>
>(
  type: TAction["type"]
): (
  payload: TAction["payload"]
) => PayloadAction<TAction["type"], TAction["payload"]> {
  return (payload: TAction["payload"]) => ({
    type,
    payload,
  })
}
