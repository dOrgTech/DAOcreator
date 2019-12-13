import React, { useState, FormEvent } from "react";
import {
  DAOConfigForm,
  DAOConfig,
  StringField
} from "@dorgtech/daocreator-lib";
import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBInput } from "mdbreact";
import { observer } from "mobx-react";

interface Props {
  form: DAOConfigForm;
  editable: boolean;
}

function DAOConfigEditor(props: Props) {
  const { form } = props;
  const [daoName, setDAOName] = useState<StringField | string>("" as any);
  const [daoSymbol, setDAOSymbol] = useState<StringField | string>("" as any);
  const handleClick = (event: FormEvent) => {
    const daoConfigForm: DAOConfig | any = {
      daoName,
      tokenSymbol: daoSymbol,
      tokenName: daoSymbol
    };
    form.$.daoName = daoConfigForm.daoName as StringField;
    form.$.tokenSymbol = daoConfigForm.tokenSymbol as StringField;
    form.$.tokenName = daoConfigForm.tokenName as StringField;
  };

  const onChange = (value: string, property: string) => {
    switch (property) {
      case "daoName":
        setDAOName(value);
        break;
      case "daoSymbol":
        setDAOSymbol(value);
        break;
    }
  };

  return (
    <MDBContainer>
      <MDBRow>
        <MDBCol>
          <MDBInput
            id="daoName"
            label="Organisation Name"
            placeholder="DAO Name"
            onChange={(event: any) => onChange(event.target.value, "daoName")}
          />
        </MDBCol>
        <MDBCol>
          <MDBInput
            id="daoSymbol"
            label="Symbol"
            placeholder="DXDD"
            onChange={(event: any) => onChange(event.target.value, "daoSymbol")}
          />
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol>
          <MDBBtn
            color="blue darken-4"
            size="sm"
            name="decisonSpeed"
            value="slow"
            style={styles.setDescriptionButton}
            onClick={handleClick}
          >
            Set Description
          </MDBBtn>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default observer(DAOConfigEditor);

const styles = {
  setDescriptionButton: {
    borderRadius: "0.37rem",
    fontWeight: 700
  }
};
