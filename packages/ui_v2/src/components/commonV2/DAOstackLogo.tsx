import React from "react";
// This is giving an error in production mode, will look into this.
// import logo from "../../assets/logos/dao-logo-gray.svg";
const logo = "https://alchemy.daostack.io/assets/images/Icon/dao-logo-gray.svg";
const DAOstackLogo = () => {
  return (
    <div className="text-center">
      <img style={styles.logo} src={logo} alt="dao-logo.svg" />
      {/*<img style={styles.logo} src={logo} alt="dao-logo.svg" />*/}
      <b style={styles.text}>Powered by DAOstack</b>
    </div>
  );
};

const styles = {
  logo: {
    marginRight: 20,
    width: 30
  },
  text: {
    color: "#2e88ee",
    fontSize: 25
  }
};

export default DAOstackLogo;
