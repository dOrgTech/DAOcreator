import { Form } from "lib/forms/Form";
import {
  TokenField,
  AddressField,
  requiredText,
  validAddress,
  validNumber,
  requireElement,
  noDuplicates,
  nonZeroAddress,
  greaterThan
} from "lib/forms";
import { Member } from "lib/state";
import csvParse from "csv-parse";
import csvStringify from "csv-stringify";

export class MemberForm extends Form<
  Member,
  {
    address: AddressField;
    reputation: TokenField;
    tokens: TokenField;
  }
> {
  private _getDAOTokenSymbol: () => string;

  get getDAOTokenSymbol() {
    return this._getDAOTokenSymbol;
  }

  constructor(getDAOTokenSymbol: () => string, form?: MemberForm) {
    super({
      address: new AddressField(form ? form.$.address.value : "")
        .validators(requiredText, validAddress, nonZeroAddress)
        .setDisplayName("Address")
        .setDescription("The member's public address."),

      reputation: new TokenField("REP", form ? form.$.reputation.value : "")
        .validators(requiredText, validNumber, greaterThan(0))
        .setDisplayName("Reputation")
        .setDescription(
          "The member's reputation (voting power) within the DAO."
        ),

      tokens: new TokenField(getDAOTokenSymbol, form ? form.$.tokens.value : "")
        .validators(requiredText, validNumber, greaterThan(0))
        .setDisplayName("Tokens")
        .setDescription("The number of DAO tokens this member owns.")
    });
    this._getDAOTokenSymbol = getDAOTokenSymbol;
  }

  public toState(): Member {
    return {
      address: this.$.address.value,
      tokens: Number(this.$.tokens.value),
      reputation: Number(this.$.reputation.value)
    };
  }

  public fromState(state: Member) {
    this.$.address.value = state.address;
    this.$.reputation.value = state.reputation.toString();
    this.$.tokens.value = state.tokens ? state.tokens.toString() : "0";
  }
}

export class MembersForm extends Form<Member[], MemberForm[]> {
  private _getDAOTokenSymbol: () => string;

  public get getDAOTokenSymbol(): () => string {
    return this._getDAOTokenSymbol;
  }

  constructor(getDAOTokenSymbol: () => string, form?: MembersForm) {
    super(form ? form.$ : ([] as MemberForm[]));
    this._getDAOTokenSymbol = getDAOTokenSymbol;
    this.validators(
      requireElement("Member"),
      noDuplicates(
        (a: MemberForm, b: MemberForm) =>
          a.$.address.value.toLowerCase() === b.$.address.value.toLowerCase(),
        (value: MemberForm) => value.$.address.value
      )
    );
  }

  public toState(): Member[] {
    return this.$.map((member: MemberForm): Member => member.toState());
  }

  public fromState(state: Member[]) {
    this.$ = state.map(member => {
      const memberForm = new MemberForm(this._getDAOTokenSymbol);
      memberForm.fromState(member);
      return memberForm;
    });
  }

  public async fromCSV(file: File): Promise<void> {
    const fileReader = new FileReader();
    fileReader.readAsText(file);

    await new Promise(
      (resolve, reject) => (fileReader.onloadend = () => resolve())
    );

    const csv = fileReader.result;

    if (csv === null) {
      throw Error("Unable to read file.");
    }

    const parseCSV = (resolve: () => void, reject: (error: Error) => void) => (
      error: Error | undefined,
      rows: any
    ) => {
      if (error !== undefined) {
        throw error;
      }

      if (!rows || rows.length === 0) {
        reject(new Error("Empty CSV"));
        return;
      }

      const colNames = Object.keys(rows[0]);

      // Verify all necessary columns are present
      ["address", "reputation", "tokens"].forEach(name => {
        if (colNames.findIndex(column => column === name) === -1) {
          reject(new Error(`Missing '${name}' column.`));
          return;
        }
      });

      rows.forEach(async (row: any, index: number) => {
        // Create the member
        const member = new MemberForm(this._getDAOTokenSymbol);
        member.$.address.value = row.address;
        member.$.reputation.value = row.reputation;
        member.$.tokens.value = row.tokens;

        // Validate the member
        const memberValidate = await member.validate();
        if (memberValidate.hasError) {
          reject(
            new Error(`Invalid member on row ${index}. Error: ${member.error}`)
          );
          return;
        }

        // Add the member to ourselves
        this.$.push(member);

        // Validate the collection
        await this.validate();
        if (this.hasError) {
          reject(
            new Error(
              `Member on row ${index} is invalid within the collection. Error: ${this.error}`
            )
          );
          return;
        }

        if (index === rows.length - 1) {
          resolve();
        }
      });
    };

    await new Promise((resolve, reject) => {
      csvParse(
        csv as string | Buffer,
        { columns: true },
        parseCSV(resolve, reject)
      );
    });
  }

  public toCSV(): Promise<string> {
    const csvData = [
      ["address", "reputation", "tokens"],
      ...this.$.map(member => [
        member.$.address.value,
        member.$.reputation.value,
        member.$.tokens.value
      ])
    ];

    return new Promise((resolve, reject) => {
      csvStringify(csvData, (err, output) => {
        if (output === undefined) {
          reject(new Error("CSV Stringify result should always be defined."));
        } else {
          resolve(output);
        }
      });
    });
  }
}
