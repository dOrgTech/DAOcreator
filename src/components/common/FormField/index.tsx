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
  ExpansionPanelDetails
} from "@material-ui/core";
import InfoIcon from "@material-ui/icons/InfoTwoTone";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import { StringField } from "../../../lib/forms";

class FormField {
  public static Text = (props: { field: StringField; editable?: boolean }) => {
    const { field, editable } = props;
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
              transition
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
}

export default FormField;
