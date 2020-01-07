import React from "react";

interface Props {
  title: string;
  callback: (i: boolean) => void;
}
export function UtilityButton(props: Props) {
  const { title, callback } = props;
  return (
    <button style={styles.button} onClick={() => callback(true)}>
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
