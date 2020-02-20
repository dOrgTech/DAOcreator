import { Field, FieldType, validPercentage, validQueuedVotePercentage } from "../../forms";

export class PercentageField extends Field<number, PercentageField> {
  constructor(init: number, name?: string) {
    super(init, FieldType.Percentage);
    const validation = name === 'queuedVote' ? validQueuedVotePercentage : validPercentage
    this.validators(validation);
  }
}
