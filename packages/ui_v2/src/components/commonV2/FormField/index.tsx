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
import { MDBRow, MDBCol, MDBTooltip, MDBBtn, MDBIcon } from "mdbreact";
import EthAddressAvatar from "../EthAddressAvatar";

import "react-datepicker/dist/react-datepicker.css";

export interface Props {
  field: AnyField;
  editable?: boolean;
  colSize?: any;
}

function FormField(props: Props) {
  const { field, editable, colSize } = props;
  const size = colSize ? colSize : 6;
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
  return (
    <>
      <FieldView field={field as any} editable={editable} colSize={size} />
    </>
  );
}

interface FieldProps<T> {
  field: T;
  editable?: boolean;
  colSize?: any;
}

const FieldError = (field: any) => (
  <>{field.hasError ? <p style={{ color: "red" }}>{field.error}</p> : <></>}</>
);

const StringFieldView = observer(
  ({ field, editable }: FieldProps<StringField>) => (
    <>
      <MDBCol size="6" style={styles.largeMargin}>
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
        {FieldError(field)}
      </MDBCol>
    </>
  )
);

const TokenFieldView = observer(
  ({ field, editable }: FieldProps<TokenField>) => (
    <>
      <MDBCol size="6" style={styles.largeMargin}>
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
        {FieldError(field)}
      </MDBCol>
    </>
  )
);

const DurationFieldView = observer(
  ({ field, editable }: FieldProps<DurationField>) => {
    const onChange = (event: any) => {
      const { name, value } = event.target;
      const duration: any = {
        days: field.days,
        hours: field.hours
      };
      duration[name] = Number(value);
      field.onChange(`${duration.days}:${duration.hours}:00`);
    };

    const DurationPart = observer((props: { name: "days" | "hours" }) => (
      <>
        <input
          name={props.name}
          style={styles.inputDuration}
          placeholder={field[props.name].toString() + " " + props.name}
          value={Number(field[props.name]).toString()}
          disabled={editable === undefined ? false : !editable}
          onChange={onChange}
          onBlur={field.enableAutoValidationAndValidate}
        />
      </>
    ));

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

              {FieldError(field)}
            </MDBRow>
          </MDBCol>
        </MDBRow>
      </>
    );
  }
);

const DateTimeFieldView = observer(
  ({ field, editable }: FieldProps<DateTimeField>) => (
    <>
      <MDBCol size="6" style={styles.largeMargin}>
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
        {FieldError(field)}
      </MDBCol>
    </>
  )
);

const PercentageFieldView = observer(
  ({ field, editable }: FieldProps<PercentageField>) => {
    return (
      <>
        <MDBCol size="6" style={styles.largeMargin}>
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
          {FieldError(field)}
        </MDBCol>
      </>
    );
  }
);

const AddressFieldView = observer(
  ({ field, editable, colSize }: FieldProps<AddressField>) => (
    <>
      <MDBCol size={colSize ? colSize : "6"} style={styles.largeMargin}>
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
        {FieldError(field)}
      </MDBCol>
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
