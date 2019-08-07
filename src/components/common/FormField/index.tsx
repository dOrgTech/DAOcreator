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
  InputLabel,
  FilledInput,
  OutlinedInput
} from "@material-ui/core";
import InfoIcon from "@material-ui/icons/InfoTwoTone";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import {
  AnyField,
  FieldType,
  StringField,
  TokenField,
  DurationField
} from "../../../lib/forms";

export interface Props {
  field: AnyField;
  editable?: boolean;
}

class FormField extends React.Component<Props> {
  render() {
    const { field, editable } = this.props;

    const ObserveField = observer(({ FieldView }) => (
      <FormControl fullWidth>
        {FieldView}
        <FormHelperText
          error={field.hasError}
          style={{ marginBottom: 5, marginTop: 5 }}
        >
          {field.error}
        </FormHelperText>
      </FormControl>
    ));

    return (
      <PopupState variant="popover" popupId="popup-popover">
        {(popupState: any) => {
          let FieldView;

          switch (field.type) {
            case FieldType.String:
              FieldView = StringFieldView(
                field as StringField,
                popupState,
                editable
              );
              break;
            case FieldType.Token:
              FieldView = TokenFieldView(
                field as TokenField,
                popupState,
                editable
              );
              break;
            case FieldType.DateTime:
              FieldView = StringFieldView(
                field as StringField,
                popupState,
                editable
              );
              break;
            case FieldType.Duration:
              FieldView = DurationFieldView(
                field as StringField,
                popupState,
                editable
              );
              break;
            case FieldType.Address:
              FieldView = StringFieldView(
                field as StringField,
                popupState,
                editable
              );
              break;
            case FieldType.Percentage:
              FieldView = StringFieldView(
                field as StringField,
                popupState,
                editable
              );
              break;
            default:
              throw Error(
                `Field type "${FieldType[field.type]}" unimplemented.`
              );
          }

          return (
            <>
              <ObserveField FieldView={FieldView} />
              <Popover
                {...bindPopover(popupState)}
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

const StringFieldView = (
  field: StringField,
  popupState: any,
  editable?: boolean
) => (
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
);

const TokenFieldView = (
  field: TokenField,
  popupState: any,
  editable?: boolean
) => (
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
);

const DurationFieldView = (
  field: DurationField,
  popupState: any,
  editable?: boolean
) => {
  const DayHourMinute = ({}) => {
    const [values, setValues] = React.useState({
      days: 0,
      hours: 0,
      minutes: 0
    });

    const onChange = (event: any) => {
      const { name, value } = event.target;

      if (value < 0) {
        return;
      }

      setValues({ ...values, [name]: value });
      // TODO: update form
    };

    return (
      <>
        <TextField
          disabled
          label={field.displayName}
          variant={"filled"}
          value={" "}
          style={{
            height: "60px"
          }}
        />
        <Grid
          container
          spacing={1}
          style={{
            marginTop: "-45px"
          }}
        >
          <Grid item xs={1}>
            {FieldInformation(popupState, {
              padding: 0,
              marginTop: "10px",
              marginLeft: "10px",
              marginRight: "5px"
            })}
          </Grid>
          <Grid item xs={3} style={{ marginLeft: "10px" }}>
            <TextField
              label={"Days"}
              name={"days"}
              value={values.days}
              onChange={onChange}
              variant={"outlined"}
              type={"number"}
              margin={"dense"}
              inputProps={{
                style: {
                  paddingTop: "5px",
                  paddingBottom: "5px"
                }
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label={"Hours"}
              name={"hours"}
              value={values.hours}
              onChange={onChange}
              variant={"outlined"}
              type={"number"}
              margin={"dense"}
              inputProps={{
                style: {
                  paddingTop: "5px",
                  paddingBottom: "5px"
                }
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label={"Minutes"}
              name={"minutes"}
              value={values.minutes}
              onChange={onChange}
              variant={"outlined"}
              type={"number"}
              margin={"dense"}
              inputProps={{
                style: {
                  paddingTop: "5px",
                  paddingBottom: "5px"
                }
              }}
            />
          </Grid>
        </Grid>
      </>
    );
  };

  return <DayHourMinute />;
};

export default FormField;
