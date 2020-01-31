import * as React from "react";
import { MDBBtn, MDBRow, MDBCol, MDBTooltip, MDBIcon } from "mdbreact";

interface ToggleProps {
  id: string;
  text: string;
  tooltip: string;
  toggle: () => void;
  disabled: boolean;
  checked: boolean;
  style?: any;
}

export default function Toggle({
  id,
  text,
  tooltip,
  toggle,
  disabled,
  checked,
  style
}: ToggleProps) {
  return (
    <MDBRow style={style ? style : styles.paddingRow}>
      <MDBCol size="11" style={styles.noPadding}>
        <span style={styles.marginText} className="text-left">
          {text}
        </span>
        <MDBTooltip placement="bottom" clickable>
          <MDBBtn floating size="lg" color="transparent" style={styles.info}>
            {" "}
            <MDBIcon icon="info-circle" />
          </MDBBtn>
          <span>{tooltip}</span>
        </MDBTooltip>
      </MDBCol>
      <MDBCol style={styles.noPadding}>
        <div className="custom-control custom-switch">
          <input
            type="checkbox"
            className="custom-control-input"
            id={id}
            onChange={toggle}
            disabled={disabled}
            checked={checked}
          />
          <label className="custom-control-label" htmlFor={id}></label>
        </div>
      </MDBCol>
    </MDBRow>
  );
}

const styles = {
  paddingRow: {
    paddingLeft: "10px",
    paddingTop: "6px"
  },
  info: {
    backgroundColor: "transparent !important",
    color: "lightgray",
    boxShadow: "none",
    fontSize: "large",
    border: "none",
    outline: "none"
  },
  noPadding: {
    padding: 0
  },
  marginText: {
    marginTop: "6px",
    color: "black",
    fontSize: "16px"
  }
};
