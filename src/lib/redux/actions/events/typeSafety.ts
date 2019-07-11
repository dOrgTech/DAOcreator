import { Action as Event } from "redux"
export type Event<T> = Event<T>

export interface PayloadEvent<TType, TPayload> extends Event<TType> {
  payload: TPayload
}

// tslint:disable-next-line:max-line-length
export function createEvent<TEvent extends Event<TEvent["type"]>>(
  type: TEvent["type"]
): () => Event<TEvent["type"]> {
  return () => ({
    type,
  })
}

// tslint:disable-next-line:max-line-length
export function createPayloadEvent<
  TEvent extends PayloadEvent<TEvent["type"], TEvent["payload"]>
>(
  type: TEvent["type"]
): (
  payload: TEvent["payload"]
) => PayloadEvent<TEvent["type"], TEvent["payload"]> {
  return (payload: TEvent["payload"]) => ({
    type,
    payload,
  })
}
