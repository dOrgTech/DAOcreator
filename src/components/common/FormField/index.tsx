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
  InputAdornment
} from "@material-ui/core";
import InfoIcon from "@material-ui/icons/InfoTwoTone";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import {
  AnyField,
  FieldType,
  StringField,
  TokenField
} from "../../../lib/forms";

export interface Props {
  field: AnyField;
  editable?: boolean;
}

class FormField extends React.Component<Props> {
  render() {
    const { field, editable } = this.props;
    switch (field.type) {
      case FieldType.String:
        return renderStringField(field as StringField, editable);
      case FieldType.Token:
        return renderTokenField(field as TokenField, editable);
      case FieldType.DateTime:
        return renderStringField(field as StringField, editable);
      case FieldType.Duration:
        return renderStringField(field as StringField, editable);
      case FieldType.Address:
        return renderStringField(field as StringField, editable);
      case FieldType.Percentage:
        return renderStringField(field as StringField, editable);
      default:
        throw Error(`Field type "${FieldType[field.type]}" unimplemented.`);
    }
  }
}

// TODO: remove boilerplate for different field drawers
const renderStringField = (field: StringField, editable?: boolean) => {
  const ObserveTextField = observer(({ popupState }) => (
    <FormControl fullWidth>
      <TextField
        fullWidth
        label={field.displayName}
        variant={"filled"}
        error={field.hasError}
        value={field.value}
        disabled={editable === undefined ? false : !editable}
        onChange={e => field.onChange(e.target.value)}
        onBlur={field.enableAutoValidationAndValidate}
        InputProps={{
          startAdornment: (
            <IconButton
              tabIndex={-1}
              style={{
                padding: 0,
                marginTop: "15px",
                marginLeft: "-3px",
                marginRight: "5px"
              }}
              {...bindTrigger(popupState)}
            >
              <InfoIcon />
            </IconButton>
          )
        }}
      />
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
      {(popupState: any) => (
        <>
          <ObserveTextField popupState={popupState} />
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
      )}
    </PopupState>
  );
};

const renderTokenField = (field: TokenField, editable?: boolean) => {
  const ObserveTextField = observer(({ popupState }) => (
    <FormControl fullWidth>
      <TextField
        fullWidth
        label={field.displayName}
        variant={"filled"}
        error={field.hasError}
        value={field.value}
        disabled={editable === undefined ? false : !editable}
        onChange={e => field.onChange(e.target.value)}
        onBlur={field.enableAutoValidationAndValidate}
        InputProps={{
          startAdornment: (
            <IconButton
              tabIndex={-1}
              style={{
                padding: 0,
                marginTop: "15px",
                marginLeft: "-3px",
                marginRight: "5px"
              }}
              {...bindTrigger(popupState)}
            >
              <InfoIcon />
            </IconButton>
          ),
          endAdornment: (
            <InputAdornment position="end">{field.symbol}</InputAdornment>
          )
        }}
      />
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
      {(popupState: any) => (
        <>
          <ObserveTextField popupState={popupState} />
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
      )}
    </PopupState>
  );
};

export default FormField;
