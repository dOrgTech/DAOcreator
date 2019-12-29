import * as React from "react";
import { observer } from "mobx-react";
import {
  AnyField,
  FieldType,
  StringField,
  TokenField,
  DurationField,
  DateTimeField,
  PercentageField,
  AddressField
} from "@dorgtech/daocreator-lib";
import {
  MDBInput,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBTooltip,
  MDBBtn,
  MDBIcon
} from "mdbreact";
import EthAddressAvatar from "../EthAddressAvatar";

import "react-datepicker/dist/react-datepicker.css";

export interface Props {
  field: AnyField;
  editable?: boolean;
  fullWidth?: boolean;
}

function FormField(props: Props) {
  const { field, editable, fullWidth } = props;
  let FieldView;

  switch (field.type) {
    case FieldType.String:
      FieldView = StringFieldView;
      break;
    case FieldType.Token:
      FieldView = TokenFieldView;
      break;
    case FieldType.DateTime:
      FieldView = DateTimeFieldView;
      break;
    case FieldType.Duration:
      FieldView = DurationFieldView;
      break;
    case FieldType.Address:
      FieldView = AddressFieldView;
      break;
    case FieldType.Percentage:
      FieldView = PercentageFieldView;
      break;
    default:
      throw Error(`Field type "${FieldType[field.type]}" unimplemented.`);
  }
  const colSize = fullWidth ? "12" : "6";
  return (
    <>
      <FieldView field={field as any} editable={editable} colSize={colSize} />
    </>
  );
}

interface FieldProps<T> {
  field: T;
  editable?: boolean;
  colSize: any;
}

const FieldError = ({ field }: any) =>
  field.hasError ? (
    <div className="invalid-feedback">You must agree before submitting.</div>
  ) : (
    <></>
  );

const StringFieldView = observer(
  ({ field, editable, colSize }: FieldProps<StringField>) => (
    <>
      <MDBCol size={colSize} style={styles.largeMargin}>
        <label style={styles.labelStyle}>{field.displayName}</label>
        <MDBTooltip placement="bottom" clickable>
          <MDBBtn floating size="lg" color="transparent" style={styles.info}>
            {" "}
            <MDBIcon icon="info-circle" />
          </MDBBtn>
          <span>Some example</span>
        </MDBTooltip>
        <input
          type="text"
          style={styles.inputStyle}
          value={field.value}
          disabled={editable === undefined ? false : !editable}
          onChange={(event: any) => field.onChange(event.target.value)}
          onBlur={field.enableAutoValidationAndValidate}
        />
        <FieldError field={field} />
      </MDBCol>

      <FieldError field={field} />
    </>
  )
);

const TokenFieldView = observer(
  ({ field, editable, colSize }: FieldProps<TokenField>) => (
    <>
      <MDBCol size={colSize} style={styles.largeMargin}>
        <label style={styles.labelStyle}>{field.displayName}</label>
        <MDBTooltip placement="bottom" clickable>
          <MDBBtn floating size="lg" color="transparent" style={styles.info}>
            {" "}
            <MDBIcon icon="info-circle" />
          </MDBBtn>
          <span>Some example</span>
        </MDBTooltip>
        <input
          type="text"
          style={styles.inputStyle}
          value={field.value}
          disabled={editable === undefined ? false : !editable}
          onChange={(event: any) => field.onChange(event.target.value)}
          onBlur={field.enableAutoValidationAndValidate}
        />
      </MDBCol>
      <FieldError field={field} />
    </>
  )
);

const DurationFieldView = observer(
  ({ field, editable }: FieldProps<DurationField>) => {
    const DurationPart = observer(
      (props: { name: "days" | "hours" | "minutes" }) => (
        <>
          <input
            type="text"
            style={styles.inputDuration}
            placeholder={field[props.name].toString() + " " + props.name}
            value={Number(field[props.name]).toString()}
            disabled={editable === undefined ? false : !editable}
            onChange={(event: any) => field.onChange(event.target.value)}
            onBlur={field.enableAutoValidationAndValidate}
          />
        </>
      )
    );

    return (
      <>
        <MDBRow style={styles.optionRow}>
          <MDBCol
            size="9"
            className="justify-content-center"
            style={styles.margin}
          >
            <label htmlFor={field.displayName}>{field.displayName}</label>
            <MDBTooltip placement="bottom" clickable>
              <MDBBtn
                floating
                size="lg"
                color="transparent"
                style={styles.info}
              >
                {" "}
                <MDBIcon icon="info-circle" />
              </MDBBtn>
              <span>Some example</span>
            </MDBTooltip>
          </MDBCol>
          <MDBCol>
            <MDBRow>
              <DurationPart name={"days"} />
              <DurationPart name={"hours"} />

              <FieldError field={field} />
            </MDBRow>
          </MDBCol>
        </MDBRow>
      </>
    );
  }
);

const DateTimeFieldView = observer(
  ({ field, editable, colSize }: FieldProps<DateTimeField>) => (
    <>
      <MDBCol size={colSize} style={styles.largeMargin}>
        <label style={styles.labelStyle}>{field.displayName}</label>
        <MDBTooltip placement="bottom" clickable>
          <MDBBtn floating size="lg" color="transparent" style={styles.info}>
            {" "}
            <MDBIcon icon="info-circle" />
          </MDBBtn>
          <span>Some example</span>
        </MDBTooltip>

        <input
          type="date"
          style={styles.dateStyle}
          placeholder={String(field.value)}
          disabled={editable === undefined ? false : !editable}
          onChange={(event: any) => field.onChange(event.target.value)}
          onBlur={field.enableAutoValidationAndValidate}
        />
        <input
          type="time"
          style={styles.dateStyle}
          placeholder={String(field.value)}
          disabled={editable === undefined ? false : !editable}
          onChange={(event: any) => field.onChange(event.target.value)}
          onBlur={field.enableAutoValidationAndValidate}
        />
      </MDBCol>
      <FieldError field={field} />
    </>
  )
);

const PercentageFieldView = observer(
  ({ field, editable, colSize }: FieldProps<PercentageField>) => {
    return (
      <>
        <MDBCol size={colSize} style={styles.largeMargin}>
          <label style={styles.labelStyle}>{field.displayName}</label>
          <MDBTooltip placement="bottom" clickable>
            <MDBBtn floating size="lg" color="transparent" style={styles.info}>
              {" "}
              <MDBIcon icon="info-circle" />
            </MDBBtn>
            <span>Some example</span>
          </MDBTooltip>
          <input
            type="number"
            max="100"
            style={styles.inputStyle}
            value={field.value}
            disabled={editable === undefined ? false : !editable}
            onChange={(event: any) => field.onChange(event.target.value)}
            onBlur={field.enableAutoValidationAndValidate}
          />
        </MDBCol>
      </>
    );
  }
);

const AddressFieldView = observer(
  ({ field, editable }: FieldProps<AddressField>) => (
    <>
      <MDBRow style={styles.largeMargin}>
        <MDBCol size="12" style={styles.largeMargin}>
          <label style={styles.labelStyle}>{field.displayName}</label>
          <MDBTooltip placement="bottom" clickable>
            <MDBBtn floating size="lg" color="transparent" style={styles.info}>
              {" "}
              <MDBIcon icon="info-circle" />
            </MDBBtn>
            <span>Some example</span>
          </MDBTooltip>
          <input
            style={styles.inputStyle}
            placeholder="0x..."
            value={field.value}
            disabled={editable === undefined ? false : !editable}
            onChange={e => field.onChange(e.target.value)}
            onBlur={field.enableAutoValidationAndValidate}
          />
          <FieldError field={field} />
        </MDBCol>
      </MDBRow>
    </>
  )
);

export default FormField;

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
  dateStyle: {
    border: "1px solid",
    color: "black",
    backgroundColor: "inherit",
    borderColor: "lightgray",
    borderRadius: "4px",
    width: "50%",
    padding: "2%",
    fontFamily: "inherit",
    fontWeight: 300
  },
  noPadding: {
    padding: 0
  },
  info: {
    backgroundColor: "transparent !important",
    color: "lightgray",
    boxShadow: "none",
    fontSize: "large",
    border: "none",
    outline: "none"
  },
  optionRow: {
    paddingTop: "14px",
    paddingBottom: "10px"
  },
  inputDuration: {
    paddingTop: "5px",
    paddingBottom: "5px",
    height: "2em",
    width: "5.9em"
  },
  margin: {
    marginTop: "6px"
  },
  largeMargin: {
    marginTop: "25px"
  },
  labelStyle: {
    color: "gray",
    fontSize: "smaller",
    fontWeight: 400
  },
  reactDatepickerWrapper: {
    paddingTop: "5px",
    paddingBottom: "5px",
    height: "2em",
    width: "5.9em",
    display: "flex !important"
  },
  marginInherit: {
    margin: "inherit"
  },
  color: {
    backgroundColor: "white !important"
  }
};
