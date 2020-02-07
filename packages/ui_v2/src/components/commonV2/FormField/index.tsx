import * as React from "react";
import { observer } from "mobx-react";
import { MDBRow, MDBCol, MDBTooltip, MDBBtn, MDBIcon } from "mdbreact";
import {
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import grey from "@material-ui/core/colors/grey";
import blue from "@material-ui/core/colors/blue";
import DateFnsUtils from "@date-io/date-fns";
// import EthAddressAvatar from "../EthAddressAvatar";
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

export interface Props {
  field: AnyField;
  editable?: boolean;
  colSize?: any;
  tabIndex?: number | null;
  checkError?: (error: boolean) => void;
  namingError?: any;
}

function FormField(props: Props) {
  const { field, editable, colSize, tabIndex, checkError, namingError } = props;
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
      <FieldView
        field={field as any}
        editable={editable}
        colSize={size}
        tabIndex={tabIndex ? tabIndex : undefined}
        checkError={checkError ? checkError : undefined}
        namingError={namingError ? namingError : undefined}
      />
    </>
  );
}

interface FieldProps<T> {
  field: T;
  editable?: boolean;
  colSize?: any;
  tabIndex?: number | undefined;
  namingError?: any | undefined;
  checkError?: (error: any) => void | undefined;
}

const FieldError = (field: any) => (
  <>{field.hasError ? <p style={{ color: "red" }}>{field.error}</p> : <></>}</>
);

const StringFieldView = observer(
  ({
    field,
    editable,
    tabIndex,
    checkError,
    namingError
  }: FieldProps<StringField>) => {
    const onChange = async (event: any) => {
      field.onChange(event.target.value);
      setTimeout(() => {
        if (field.displayName === "Token Symbol") {
          checkError!({ ...namingError, daoSymbol: field.hasError });
        }
        if (field.displayName === "DAO Name") {
          checkError!({ ...namingError, daoName: field.hasError });
        }
      }, 250);
    };
    return (
      <>
        <MDBCol size="6" style={styles.largeMargin}>
          <label style={styles.labelStyle}>
            {field.displayName === "Token Symbol"
              ? "DAO Symbol"
              : field.displayName}
          </label>
          <MDBTooltip placement="bottom" clickable>
            <MDBBtn floating size="lg" color="transparent" style={styles.info}>
              {" "}
              <MDBIcon icon="info-circle" />
            </MDBBtn>
            <span>{field.description}</span>
          </MDBTooltip>
          <input
            type="text"
            style={styles.inputStyle}
            value={field.value}
            disabled={editable === undefined ? false : !editable}
            onChange={onChange}
            onBlur={field.enableAutoValidationAndValidate}
            tabIndex={tabIndex}
          />
          {FieldError(field)}
        </MDBCol>
      </>
    );
  }
);

const TokenFieldView = observer(
  ({ field, editable, colSize }: FieldProps<TokenField>) => (
    <>
      <MDBCol
        size={colSize ? colSize : "6"}
        style={colSize ? {} : styles.largeMargin}
      >
        {colSize ? (
          <></>
        ) : (
          <>
            <label style={styles.labelStyle}>{field.displayName}</label>
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
              <span>{field.description}</span>
            </MDBTooltip>
          </>
        )}
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
        hours: field.hours,
        minutes: field.minutes
      };

      if (name === "days") {
        duration["days"] = +value;
      } else {
        let [hours, minutes] = value.split(":");
        duration.hours = isNaN(hours) ? 0 : +hours;
        duration.minutes = isNaN(minutes) ? 0 : +minutes;
      }
      field.onChange(
        `${duration.days}:${duration.hours}:${duration.minutes}:00`
      );
    };

    const DurationPart = observer(
      (props: { name: "days" | "hoursAndMinutes" }) => (
        <>
          <input
            name={props.name}
            style={
              props.name === "days" && +field[props.name] < 10
                ? styles.oneNumberDay
                : props.name === "days" && +field[props.name] > 9
                ? styles.twoNumbersDay
                : {
                    paddingTop: "3px",
                    paddingBottom: "5px",
                    height: "2em",
                    width: "5.5em",
                    textAlign: "center"
                  }
            }
            value={field[props.name]}
            disabled={editable === undefined ? false : !editable}
            onChange={onChange}
            type={props.name === "days" ? "number" : "time"}
            min={0}
            max={100}
            onBlur={field.enableAutoValidationAndValidate}
          />
          <div
            style={
              props.name === "days"
                ? { paddingTop: "3px", marginRight: "-3px" }
                : { paddingTop: "3px" }
            }
          >
            <span
              style={
                props.name === "days"
                  ? { marginLeft: "-50px" }
                  : { marginLeft: "-38px" }
              }
            >
              {" "}
              {props.name === "days" ? "days" : "h"}
            </span>
          </div>
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
              <span>{field.description}</span>
            </MDBTooltip>
          </MDBCol>
          <MDBCol>
            <MDBRow>
              <DurationPart name={"days"} />
              <DurationPart name={"hoursAndMinutes"} />

              {FieldError(field)}
            </MDBRow>
          </MDBCol>
        </MDBRow>
      </>
    );
  }
);

const datePickerTheme = createMuiTheme({
  palette: {
    primary: grey,
    secondary: blue
  }
});

const DateTimeFieldView = observer(
  ({ field, editable }: FieldProps<DateTimeField>) => {
    const [open, onOpen] = React.useState(false);
    const disabled = editable === undefined ? false : !editable;

    return (
      <MDBCol size="6" style={styles.largeMargin}>
        <label style={styles.labelStyle}>{field.displayName}</label>
        <MDBTooltip placement="bottom" clickable>
          <MDBBtn floating size="lg" color="transparent" style={styles.info}>
            {" "}
            <MDBIcon icon="info-circle" />
          </MDBBtn>
          <span>{field.description}</span>
        </MDBTooltip>
        <ThemeProvider theme={datePickerTheme}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDateTimePicker
              value={field.value === undefined ? null : field.value}
              disabled={disabled}
              onChange={(date: Date | null) =>
                date === null ? field.onChange(undefined) : field.onChange(date)
              }
              open={open}
              onClose={() => onOpen(false)}
              disablePast
              format={"MM/dd/yyyy HH:mm"}
              ampm={false}
              variant={"dialog"}
              DialogProps={{
                disablePortal: true
              }}
              inputVariant={"outlined"}
              error={field.hasError}
              size={"small"}
              TextFieldComponent={() => (
                <>
                  <input
                    style={styles.inputStyle}
                    placeholder="Pick a date and time..."
                    readOnly={true}
                    value={field.value ? field.value.toLocaleString() : ""}
                    disabled={disabled}
                  />
                  <MDBBtn
                    floating
                    size="lg"
                    color="transparent"
                    style={styles.dateTimeEdit}
                    onClick={() => onOpen(!open)}
                    disabled={disabled}
                  >
                    <MDBIcon icon="calendar-alt" />
                  </MDBBtn>
                  {field.value ? (
                    <MDBBtn
                      floating
                      size="lg"
                      color="transparent"
                      style={styles.dateTimeClear}
                      onClick={() => field.onChange(undefined)}
                      disabled={disabled}
                    >
                      <MDBIcon icon="times" />
                    </MDBBtn>
                  ) : (
                    <></>
                  )}
                </>
              )}
            />
          </MuiPickersUtilsProvider>
        </ThemeProvider>
        {FieldError(field)}
      </MDBCol>
    );
  }
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
            <span>{field.description}</span>
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
        {field.description === "The member's public address." ? (
          <></>
        ) : (
          <>
            <label style={styles.labelStyle}>{field.displayName}</label>
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
              <span>{field.description}</span>
            </MDBTooltip>
          </>
        )}
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
    borderColor: "lightgray",
    borderRadius: "4px",
    width: "100%",
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
  twoNumbersDay: {
    paddingTop: "3px",
    paddingBottom: "5px",
    height: "2em",
    width: "5.5em",
    paddingLeft: "15px"
  },
  oneNumberDay: {
    paddingTop: "3px",
    paddingBottom: "5px",
    height: "2em",
    width: "5.5em",
    paddingLeft: "25px"
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
  },
  dateTimeClear: {
    backgroundColor: "transparent !important",
    color: "#4285f4",
    boxShadow: "none",
    fontSize: "large",
    border: "none",
    outline: "none",
    marginLeft: "-50px"
  },
  dateTimeEdit: {
    backgroundColor: "transparent !important",
    color: "#4285f4",
    boxShadow: "none",
    fontSize: "large",
    border: "none",
    outline: "none",
    marginLeft: "-25px"
  }
};
