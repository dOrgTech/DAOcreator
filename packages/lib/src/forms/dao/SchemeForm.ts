import { ValidatableMapOrArray } from "formstate";
import { Form } from "../../forms/Form";
import {
  AnyField,
  requireElement,
  ContributionRewardForm,
  SchemeRegistrarForm,
  GenesisProtocolForm
} from "../../forms";
import {
  ContributionReward,
  SchemeRegistrar,
  SchemeType
} from "../../state";
import { Scheme } from "../../dependency/arc";

export type AnySchemeForm =
  | ContributionRewardForm
  | SchemeRegistrarForm;

export abstract class SchemeForm<
  StateType extends Scheme,
  T extends ValidatableMapOrArray & { votingMachine: GenesisProtocolForm }
> extends Form<StateType, T> {
  public abstract getParams(): AnyField[];

  private _type: SchemeType;

  get type() {
    return this._type;
  }

  constructor(type: SchemeType, $: T) {
    super($);
    this._type = type;
  }
}

export class SchemesForm extends Form<Scheme[], AnySchemeForm[]> {
  constructor(form?: SchemesForm) {
    super(form ? form.$ : ([] as AnySchemeForm[]));

    this.validators(requireElement("Scheme"));
  }

  public toState(): Scheme[] {
    return this.$.map(
      (schemeForm: AnySchemeForm): Scheme => schemeForm.toState()
    );
  }

  public fromState(state: Scheme[]) {
    this.$ = state.map(scheme => {
      let schemeForm: AnySchemeForm;

      switch (scheme.type) {
        case SchemeType.ContributionReward:
          schemeForm = new ContributionRewardForm();
          schemeForm.fromState(scheme as ContributionReward);
          break;
        case SchemeType.SchemeRegistrar:
          schemeForm = new SchemeRegistrarForm();
          schemeForm.fromState(scheme as SchemeRegistrar);
          break;
        default:
          throw Error(`Unimplemented SchemeType ${SchemeType[scheme.type]}`);
      }

      return schemeForm;
    });
  }
}
