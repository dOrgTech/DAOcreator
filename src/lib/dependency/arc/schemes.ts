import * as R from "ramda";
import { DeploymentInfo, SchemeConfig, SchemeDefinition } from "./types";

export const schemeDefinitions: SchemeDefinition[] = [
  {
    typeName: "GenericScheme",
    displayName: "Generic Scheme",
    description: "",
    permissions: "0x00000010",
    params: [
      {
        typeName: "contractToCall",
        valueType: "Address",
        displayName: "",
        description: ""
      }
    ],
    getCallableParamsArray: (schemeConfig, deploymentInfo) => {
      const {
        votingMachineParametersKey,
        votingMachineAddress
      } = deploymentInfo;
      return [
        votingMachineParametersKey,
        votingMachineAddress,
        schemeConfig.params.contractToCall
      ];
    }
  },
  {
    typeName: "ContributionReward",
    displayName: "Contributor Rewards",
    description:
      "Contributors can propose rewards for themselves and others. These rewards can be tokens, reputation, or a combination.",
    permissions: "0x00000000" /* no permissions */,
    params: [],
    getCallableParamsArray: (schemeConfig, deploymentInfo) => {
      const {
        votingMachineParametersKey,
        votingMachineAddress
      } = deploymentInfo;
      return [votingMachineParametersKey, votingMachineAddress];
    }
  },
  {
    typeName: "SchemeRegistrar",
    displayName: "Feature Registrar",
    description:
      "Manages post-creation adding/modifying and removing of features. Features add functionality to the DAO.",
    permissions: "0x0000001F" /* all permissions */,
    params: [],
    getCallableParamsArray: (schemeConfig, deploymentInfo) => {
      const {
        votingMachineParametersKey,
        votingMachineAddress
      } = deploymentInfo;
      return [
        votingMachineParametersKey,
        votingMachineParametersKey,
        votingMachineAddress
      ];
    }
  }
];

export const getSchemeDefinition = (typeName: string) =>
  R.find(
    scheme => scheme.typeName === typeName,
    schemeDefinitions
  ) as SchemeDefinition;

export const getSchemeCallableParamsArray = (
  schemeConfig: SchemeConfig,
  deploymentInfo: DeploymentInfo
) =>
  getSchemeDefinition(schemeConfig.typeName).getCallableParamsArray(
    schemeConfig,
    deploymentInfo
  );

export const getSchemeDefaultParams = (typeName: string): any => {
  const scheme = getSchemeDefinition(typeName);

  return R.reduce(
    (acc, param) => R.assoc(param.typeName, param.defaultValue, acc),
    {},
    scheme.params
  );
};
