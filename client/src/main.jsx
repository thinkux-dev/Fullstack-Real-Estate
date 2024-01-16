import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";
import { MantineProvider } from "@mantine/core";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MantineProvider>
      <Auth0Provider
        domain="dev-s0umzand4bhjx40u.us.auth0.com"
        clientId="luw2FM9gfO9GCAqbfDxWzYoeDoH7uSlq"
        authorizationParams={{
          redirect_uri: "https://fullstack-real-estate-kappa.vercel.app/"
        }}
        audience="http://localhost:9000"
        scope="openid profile email"
      >
        <App />
      </Auth0Provider>
    </MantineProvider>
  </React.StrictMode>
);
