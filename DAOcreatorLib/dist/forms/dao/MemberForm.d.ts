import { Form } from "../../forms/Form";
import { TokenField, AddressField } from "../../forms";
import { Member } from "../../dependency/arc";
export declare class MemberForm extends Form<
  Member,
  {
    address: AddressField;
    reputation: TokenField;
    tokens: TokenField;
  }
> {
  private _getDAOTokenSymbol;
  readonly getDAOTokenSymbol: () => string;
  constructor(getDAOTokenSymbol: () => string, form?: MemberForm);
  toState(): Member;
  fromState(state: Member): void;
}
export declare class MembersForm extends Form<Member[], MemberForm[]> {
  private _getDAOTokenSymbol;
  readonly getDAOTokenSymbol: () => string;
  constructor(getDAOTokenSymbol: () => string, form?: MembersForm);
  toState(): Member[];
  fromState(state: Member[]): void;
  fromCSV(file: File): Promise<void>;
  toCSV(): Promise<string>;
}
