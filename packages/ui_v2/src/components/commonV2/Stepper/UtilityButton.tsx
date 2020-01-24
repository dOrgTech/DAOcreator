import React from "react";

interface Props {
  title: string;
  openModal: (i: boolean | string) => void;
  advanced?: any;
}
export function UtilityButton(props: Props) {
  const { title, openModal, advanced } = props;
  const handledCallback = () => {
    if (title === "Import CSV") {
      openModal(title);
    } else {
      const { advanceMode, _, form } = advanced;
      if (!advanceMode) {
        form.$ = [];
      }
      openModal(true);
    }
  };
  return (
    <button style={styles.button} onClick={handledCallback}>
      {title}
    </button>
  );
}

const styles = {
  button: {
    width: "174px",
    height: "42px",
    padding: "4px",
    marginRight: "36px",
    marginTop: "20px",
    border: "1px solid gray",
    boxShadow: "none",
    borderRadius: "4px",
    fontFamily: '"Roboto", sans-serif',
    fontWeight: 300,
    fontSize: "15px"
  }
};
