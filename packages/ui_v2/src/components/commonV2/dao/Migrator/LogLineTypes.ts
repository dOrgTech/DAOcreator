import { DAOMigrationResult } from '@dorgtech/daocreator-lib-experimental'

export enum LogType {
  Info,
  Error,
  TransactionResult,
  UserApproval,
  MigrationComplete,
  MigrationAborted
}

export interface LogLine {
  type: LogType;
  toString: () => string;
}

export class LogInfo implements LogLine {
  public type = LogType.Info;
  constructor(public info: string) {}

  public toString() {
    return this.info;
  }
}

export class LogError implements LogLine {
  public type = LogType.Error;
  constructor(public error: string) {}

  public toString() {
    return `${this.error}`;
  }
}

export class LogTransactionResult implements LogLine {
  public type = LogType.TransactionResult;
  constructor(
    public msg: string,
    public txHash: string,
    public txCost: number
  ) {}

  public toString() {
    return `${this.msg} ${this.txHash} ${this.txCost} ETH`;
  }
}

export class LogUserApproval implements LogLine {
  public type = LogType.UserApproval;
  public response?: boolean;
  constructor(
    public question: string,
    public onResponse: (resp: boolean) => void
  ) {}

  public toString() {
    return `${this.question} response: ${this.response}`;
  }
}

export class LogMigrationComplete implements LogLine {
  public type = LogType.MigrationComplete;
  constructor(public result: DAOMigrationResult) {}

  public toString() {
    return JSON.stringify(this.result);
  }
}

export class LogMigrationAborted implements LogLine {
  public type = LogType.MigrationAborted;
  constructor(public error: Error) {}

  public toString() {
    return `${this.error}`;
  }
}

export type AnyLogLine =
  | LogInfo
  | LogError
  | LogTransactionResult
  | LogUserApproval
  | LogMigrationComplete
  | LogMigrationAborted;
