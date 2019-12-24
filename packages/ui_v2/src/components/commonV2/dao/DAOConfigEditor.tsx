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
      <br />
      <MDBRow>
        <MDBCol style={styles.marginZero}>
          <label htmlFor="daoName" style={styles.labelStyle}>
            ORGANIZATION NAME
          </label>
          <input
            type="text"
            style={styles.inputStyle}
            id="daoName"
            placeholder="DAO Name"
            onChange={(event: any) => onChange(event.target.value, "daoName")}
          />
        </MDBCol>
        <MDBCol>
          <label htmlFor="daoSymbol" style={styles.labelStyle}>
            SYMBOL
          </label>
          <input
            type="text"
            style={styles.inputStyle}
            id="daoSymbol"
            placeholder="DXDD"
            onChange={(event: any) => onChange(event.target.value, "daoSymbol")}
          />
        </MDBCol>
      </MDBRow>
      <br />
      <MDBRow style={styles.paddingBottom}>
        <MDBCol>
          <MDBBtn
            color="blue darken-4"
            size="sm"
            name="decisonSpeed"
            value="slow"
            style={styles.buttonStyle}
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
  inputStyle: {
    border: "1px solid",
    color: "black",
    backgroundColor: "inherit",
    borderColor: "lightgray",
    borderRadius: "4px",
    width: "100%",
    padding: "2%",
    fontFamily: "inherit",
    fontWeight: 300
  },
  marginZero: {
    margin: 0
  },
  labelStyle: {
    color: "gray",
    fontSize: "smaller",
    fontWeight: 400
  },
  paddingBottom: {
    paddingBottom: "2%"
  },
  buttonStyle: {
    border: "inherit",
    borderRadius: "4px",
    height: "38px",
    fontFamily: "inherit"
  }
};
