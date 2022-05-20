import {
  Card,
  Box,
  Avatar,
  Button,
  CardActions,
  CircularProgress,
  Grid,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Form } from "react-admin";
import { TextInput } from "react-admin";
import { useLogin } from "react-admin";
import { Login } from "react-admin";

const translate = (key: string) => key;

const AuthenticateFortnoxPage = (props: JSX.IntrinsicAttributes) => {
  const [loading, setLoading] = useState(false);
  const userLogin = useLogin();

  useEffect(() => {
    const { searchParams } = new URL(window.location.href);
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    // If code is present, we came back from the provider
    if (code && state) {
      setLoading(true);
      userLogin({ code, state });
    }
  }, [userLogin]);

  const handleLogin = () => {
    setLoading(true);

    userLogin({}); // Do not provide code, just trigger the redirection
  };
  return (
    <Login {...props}>
      <CardActions>
        <Grid container justifyContent="center">
          <Button
            type="submit"
            color="primary"
            variant="contained"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading && <CircularProgress size={18} thickness={2} />}
            Authenticate With Fortnox
          </Button>
        </Grid>
      </CardActions>
    </Login>
  );
};

export default AuthenticateFortnoxPage;
