import FeatureStep from "./FeatureStep"
import * as React from "react"
const SchemeStep = () => {
  return (
    <div>
      <FeatureStep schemeTypeName="ContributionReward" />
      <FeatureStep schemeTypeName="SchemeRegistrar" />
      <FeatureStep schemeTypeName="UpgradeScheme" />
      <FeatureStep schemeTypeName="GlobalConstraintRegistrar" />
      <FeatureStep schemeTypeName="GenericScheme" />
    </div>
  )
}

export default SchemeStep
