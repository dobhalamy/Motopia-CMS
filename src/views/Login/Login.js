import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import TextField from "@material-ui/core/TextField";
// import Snackbar from '@material-ui/core/Snackbar';
// import MuiAlert from '@material-ui/lab/Alert';
import { useToasts } from 'react-toast-notifications'
import { AuthRoutes } from "client";
import setAuthToken from "redux/setAuthToken";
import { setUserProfile } from "redux/actions/auth";
import NewPasswordDialog from "components/LoginPage/NewPasswordDialog";

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  },
  loginCard: {
    maxWidth: 320
  },
  input: {
    margin: 10
  }
};

const useStyles = makeStyles(styles);

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// function Alert(props) {
//   return <MuiAlert elevation={6} variant="filled" {...props} />;
// }

function Login(props) {
  let history = useHistory();
  let token = useQuery().get("token");
  const classes = useStyles();
  const { addToast } = useToasts();
  const [state, setState] = React.useState({
    email: "",
    password: "",
    newPassword: "",
    confirmPassword: "",
    newPasswordDialogOpen: false,
    showSnackBar: false,
    error: false,
    snackBarText: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await AuthRoutes.login({
        email: state.email,
        password: state.password
      });
      localStorage.setItem("token", response.token);
      addToast("Successfull login");
      setAuthToken(response.token);
      props.setUserProfile({
        email: response.email,
        role: response.role,
        id: response._id,
        status: response.status
      });
      history.push("/admin");
    } catch {
      addToast("Incorrect Login or Password", { severity: 'error' });
    }
  };

  const handleSetNewPass = async password => {
    try {
      await AuthRoutes.setNewPass({
        password: password
      });
      setState({ ...state, newPasswordDialogOpen: false });
    } catch (err) {
      alert(err);
    }
  };

  React.useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      props.setUserProfile(null);
      setAuthToken(token);
      setState({ ...state, newPasswordDialogOpen: true });
    }
    // eslint-disable-next-line
  }, [token]);

  return (
    <GridContainer
      style={{ height: "100vh", width: "100vw", margin: "0px !important" }}
      container
      alignItems="center"
      justify="center"
    >
      <Card className={classes.loginCard}>
        <form onSubmit={handleLogin}>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Please Login</h4>
            <p className={classes.cardCategoryWhite}>
              Input your email and password for Login
            </p>
          </CardHeader>
          <CardBody>
            <GridContainer>
              <GridItem xs={12}>
                <TextField
                  className={classes.input}
                  variant="outlined"
                  onChange={event =>
                    setState({ ...state, email: event.target.value })
                  }
                  value={state.email}
                  type="email"
                  label="UserName"
                  formControlProps={{
                    fullWidth: true
                  }}
                />
              </GridItem>
              <GridItem xs={12}>
                <TextField
                  className={classes.input}
                  variant="outlined"
                  onChange={event =>
                    setState({ ...state, password: event.target.value })
                  }
                  value={state.password}
                  type="password"
                  label="Password"
                  formControlProps={{
                    fullWidth: true
                  }}
                />
              </GridItem>
            </GridContainer>
          </CardBody>
          <CardFooter>
            <Button type="submit" onClick={handleLogin} color="primary">
              Login
            </Button>
          </CardFooter>
        </form>
      </Card>
      <NewPasswordDialog
        handleSetNewPass={handleSetNewPass}
        newPasswordDialogOpen={state.newPasswordDialogOpen}
      />
    </GridContainer>
  );
}

Login.propTypes = {
  setUserProfile: PropTypes.func.isRequired
};

const mapDispatchToProps = {
  setUserProfile
};

export default connect(
  null,
  mapDispatchToProps
)(Login);
