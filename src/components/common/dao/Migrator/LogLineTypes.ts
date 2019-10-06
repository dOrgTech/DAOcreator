export enum LogType {
  Info,
  Error,
  TransactionResult,
  UserApproval,
  MigrationAborted
}

export interface LogLine {
  type: LogType;
}

export class LogInfo implements LogLine {
  public type = LogType.Info;
  constructor(public info: string) {}
}

export class LogError implements LogLine {
  public type = LogType.Error;
  constructor(public error: string) {}
}

export class LogTransactionResult implements LogLine {
  public type = LogType.TransactionResult;
  constructor(
    public msg: string,
    public txHash: string,
    public txCost: number
  ) {}
}

export class LogUserApproval implements LogLine {
  public type = LogType.UserApproval;
  public response?: boolean;
  constructor(
    public question: string,
    public onResponse: (resp: boolean) => void
  ) {}
}

export class LogMigrationAborted implements LogLine {
  public type = LogType.MigrationAborted;
  constructor(public error: Error) {}
}

export type AnyLogLine =
  | LogInfo
  | LogError
  | LogTransactionResult
  | LogUserApproval
  | LogMigrationAborted;
