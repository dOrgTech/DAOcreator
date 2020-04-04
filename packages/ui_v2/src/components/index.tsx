import * as React from "react";
import { ProviderOrGetter } from "@dorgtech/daocreator-lib";

import DAOcreatorV2 from "./DAOcreatorV2/index";

interface Props {
  setWeb3Provider?: ProviderOrGetter;
  noDAOstackLogo?: Boolean;
}

const Index: React.FC<Props> = ({ setWeb3Provider, noDAOstackLogo }) => {
  return (
    <DAOcreatorV2 setWeb3Provider={setWeb3Provider} noDAOstackLogo={noDAOstackLogo} />
  );
};

export default Index;
