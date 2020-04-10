import { ValidatableMapOrArray } from "formstate";
import { Form } from "../../forms/Form";
import {
  AnyField,
  requireElement,
  GenericSchemeForm,
  ContributionRewardForm,
  SchemeFactoryForm,
  GenesisProtocolForm
} from "../../forms";
import {
  GenericScheme,
  ContributionReward,
  SchemeFactory,
  SchemeType,
  Scheme
} from "../../state";

export type AnySchemeForm =
  | GenericSchemeForm
  | ContributionRewardForm
  | SchemeFactoryForm;

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
        case SchemeType.SchemeFactory:
          schemeForm = new SchemeFactoryForm();
          schemeForm.fromState(scheme as SchemeFactory);
          break;
        case SchemeType.GenericScheme:
          schemeForm = new GenericSchemeForm();
          schemeForm.fromState(scheme as GenericScheme);
          break;
        default:
          throw Error(`Unimplemented SchemeType ${SchemeType[scheme.type]}`);
      }

      return schemeForm;
    });
  }
}
