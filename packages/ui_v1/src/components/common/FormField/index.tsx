import * as React from "react";
import { observer } from "mobx-react";
import {
  FormControl,
  FormHelperText,
  TextField,
  Typography,
  IconButton,
  Popover,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  InputAdornment,
  Grid,
  Slider,
  Input
} from "@material-ui/core";
import InfoIcon from "@material-ui/icons/InfoTwoTone";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import { KeyboardDateTimePicker } from "@material-ui/pickers";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
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
import EthAddressAvatar from "components/common/EthAddressAvatar";

export interface Props {
  field: AnyField;
  editable?: boolean;
}

class FormField extends React.Component<Props> {
  render() {
    const { field, editable } = this.props;

    return (
      <PopupState variant="popover" popupId="popup-popover">
        {(popupState: any) => {
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
              throw Error(
                `Field type "${FieldType[field.type]}" unimplemented.`
              );
          }

          return (
            <>
              <FormControl fullWidth>
                <FieldView
                  field={field as any}
                  popupState={popupState}
                  editable={editable}
                />
              </FormControl>
              <Popover
                {...bindPopover(popupState)}
                anchorReference="anchorPosition"
                anchorPosition={{ top: 100, left: 20 }}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left"
                }}
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "left"
                }}
              >
                {field.story === "" ? (
                  <Typography style={{ maxWidth: 400, margin: 20 }}>
                    <b>{field.displayName}:</b> {field.description}
                  </Typography>
                ) : (
                  <ExpansionPanel style={{ maxWidth: 400 }}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>
                        <b>{field.displayName}:</b> {field.description}
                      </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <Typography>{field.story}</Typography>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                )}
              </Popover>
            </>
          );
        }}
      </PopupState>
    );
  }
}

const FieldInformation = (popupState: any, style?: any) => (
  <IconButton
    tabIndex={-1}
    style={
      style
        ? style
        : {
            padding: 0,
            marginTop: "15px",
            marginLeft: "0px",
            marginRight: "5px"
          }
    }
    {...bindTrigger(popupState)}
  >
    <InfoIcon />
  </IconButton>
);

interface FieldProps<T> {
  field: T;
  popupState: any;
  editable?: boolean;
}

const FieldError = ({ field }: any) => (
  <>
    {field.hasError ? (
      <FormHelperText
        error={field.hasError}
        style={{ marginBottom: 5, marginTop: 5 }}
      >
        {field.error}
      </FormHelperText>
    ) : (
      <></>
    )}
  </>
);

const StringFieldView = observer(
  ({ field, popupState, editable }: FieldProps<StringField>) => (
    <>
      <TextField
        fullWidth
        variant={"filled"}
        margin={"dense"}
        label={field.displayName}
        error={field.hasError}
        value={field.value}
        disabled={editable === undefined ? false : !editable}
        onChange={e => field.onChange(e.target.value)}
        onBlur={field.enableAutoValidationAndValidate}
        InputProps={{
          startAdornment: FieldInformation(popupState)
        }}
      />
      <FieldError field={field} />
    </>
  )
);

const TokenFieldView = observer(
  ({ field, popupState, editable }: FieldProps<TokenField>) => (
    <>
      <TextField
        fullWidth
        variant={"filled"}
        margin={"dense"}
        label={field.displayName}
        error={field.hasError}
        value={field.value}
        disabled={editable === undefined ? false : !editable}
        onChange={e => field.onChange(e.target.value)}
        onBlur={field.enableAutoValidationAndValidate}
        InputProps={{
          startAdornment: FieldInformation(popupState),
          endAdornment: (
            <InputAdornment position="end">{field.symbol}</InputAdornment>
          )
        }}
      />
      <FieldError field={field} />
    </>
  )
);

const DurationFieldView = observer(
  ({ field, popupState, editable }: FieldProps<DurationField>) => {
    const onChange = (event: any) => {
      const { name, value } = event.target;
      const duration: any = {
        days: field.days,
        hours: field.hours,
        minutes: field.minutes
      };
      duration[name] = Number(value);
      field.onChange(
        `${duration.days}:${duration.hours}:${duration.minutes}:00`
      );
    };

    const DurationPart = observer(
      (props: { name: "days" | "hours" | "minutes" }) => (
        <TextField
          name={props.name}
          label={props.name}
          value={Number(field[props.name]).toString()}
          disabled={editable === undefined ? false : !editable}
          onChange={onChange}
          variant={"outlined"}
          type={"number"}
          margin={"dense"}
          error={field.hasError}
          inputProps={{
            style: {
              paddingTop: "5px",
              paddingBottom: "5px"
            }
          }}
          onBlur={field.enableAutoValidationAndValidate}
        />
      )
    );

    return (
      <>
        <TextField
          disabled
          label={field.displayName}
          error={field.hasError}
          variant={"filled"}
          value={" "}
          style={{
            height: "60px",
            marginTop: "8px"
          }}
          InputProps={{
            startAdornment: FieldInformation(popupState, {
              padding: 0,
              marginTop: "25px",
              marginLeft: "0px"
            })
          }}
          // eslint-disable-next-line
          inputProps={{
            style: {
              height: "25px"
            }
          }}
        />
        <Grid
          container
          justify={"space-between"}
          style={{
            marginTop: "-39px",
            marginBottom: "4px"
          }}
        >
          <Grid item>
            <div style={{ width: "25px" }} />
          </Grid>
          <Grid item xs={3}>
            <DurationPart name={"days"} />
          </Grid>
          <Grid item xs={3}>
            <DurationPart name={"hours"} />
          </Grid>
          <Grid item xs={3}>
            <DurationPart name={"minutes"} />
          </Grid>
          <Grid item>
            <div style={{ width: "10px" }} />
          </Grid>
        </Grid>
        <FieldError field={field} />
      </>
    );
  }
);

const DateTimeFieldView = observer(
  ({ field, popupState, editable }: FieldProps<DateTimeField>) => (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDateTimePicker
        label={field.displayName}
        value={field.value === undefined ? null : field.value}
        disabled={editable === undefined ? false : !editable}
        onChange={date =>
          date === null ? field.onChange(undefined) : field.onChange(date)
        }
        disablePast
        clearable
        format="MM/dd/yyyy HH:mm"
        variant={"dialog"}
        inputVariant={"filled"}
        ampm={false}
        error={field.hasError}
        style={{
          marginTop: "5px",
          marginBottom: "4px"
        }}
        InputProps={{
          startAdornment: FieldInformation(popupState)
        }}
      />
      <FieldError field={field} />
    </MuiPickersUtilsProvider>
  )
);

const PercentageFieldView = observer(
  ({ field, popupState, editable }: FieldProps<PercentageField>) => {
    const onSliderChange = (event: any, newValue: number | number[]) => {
      if (typeof newValue === "number") {
        field.onChange(newValue);
      } else {
        field.onChange(newValue[0]);
      }
    };

    const onInputChange = (event: any) => {
      const value = event.target.value;
      field.onChange(value === "" ? 0 : Number(value));
    };

    return (
      <>
        <TextField
          disabled
          label={field.displayName}
          error={field.hasError}
          variant={"filled"}
          value={" "}
          style={{
            height: "60px",
            marginTop: "8px"
          }}
        />
        <Grid
          container
          spacing={2}
          alignItems={"center"}
          style={{
            marginTop: "-50px",
            paddingRight: "12px",
            paddingLeft: "12px"
          }}
        >
          <Grid item>
            {FieldInformation(popupState, {
              padding: 0
            })}
          </Grid>
          <Grid item xs>
            <Slider
              value={field.value}
              onChange={onSliderChange}
              onBlur={field.enableAutoValidationAndValidate}
              disabled={editable === undefined ? false : !editable}
              step={0.1}
              style={{
                marginTop: "10px"
              }}
            />
          </Grid>
          <Grid item>
            <Input
              value={field.value}
              margin={"dense"}
              onChange={onInputChange}
              onBlur={field.enableAutoValidationAndValidate}
              inputProps={{
                step: 0.1,
                min: 0,
                max: 100,
                type: "number"
              }}
              disabled={editable === undefined ? false : !editable}
            />
          </Grid>
        </Grid>
      </>
    );
  }
);

const AddressFieldView = observer(
  ({ field, popupState, editable }: FieldProps<AddressField>) => (
    <>
      <TextField
        fullWidth
        variant={"filled"}
        margin={"dense"}
        label={field.displayName}
        error={field.hasError}
        value={field.value}
        disabled={editable === undefined ? false : !editable}
        onChange={e => field.onChange(e.target.value)}
        onBlur={field.enableAutoValidationAndValidate}
        InputProps={{
          startAdornment: FieldInformation(popupState),
          endAdornment: <EthAddressAvatar address={field.value} />
        }}
      />
      <FieldError field={field} />
    </>
  )
);

export default FormField;
