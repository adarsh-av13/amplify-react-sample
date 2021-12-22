import React from "react";
import "./App.css";
import Amplify, { API, graphqlOperation, Auth, Hub } from "aws-amplify";
import { getAllUrls } from "./graphql/queries";
import { Link } from "react-router-dom";
import UrlList from "./components/urlList";
import {
  createShortUrl,
  deleteShortUrl,
  renewShortUrl,
} from "./graphql/mutations";
const myAppConfig = {
  // ...
  aws_appsync_graphqlEndpoint: process.env.REACT_APP_API_URL,
  aws_appsync_region: "us-east-1",
  aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS",
  // aws_appsync_authenticationKey: process.env.REACT_APP_API_KEY,
  // ...
};

// Amplify.configure(myAppConfig);

const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === "[::1]" ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

const redirectUrl =
  "http://localhost:3000/,https://master.d2nig2yymdsjds.amplifyapp.com/";

const [localRedirectSignIn, productionRedirectSignIn] = redirectUrl.split(",");

const [localRedirectSignOut, productionRedirectSignOut] =
  redirectUrl.split(",");

console.log(localRedirectSignIn, productionRedirectSignIn);

const awsConfig = {
  Auth: {
    // identityPoolId: 'XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab',
    region: process.env.REACT_APP_REGION,
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_USER_POOL_WEB_CLIENT_ID,
    graphql_headers: async () => {
      const currentSession = await Auth.currentSession();
      console.log(currentSession);
      return { Authorization: currentSession.getAccessToken().getJwtToken() };
    },

    // OPTIONAL - Hosted UI configuration
    oauth: {
      domain: process.env.REACT_APP_COGNITO_DOMAIN,

      redirectSignIn: isLocalhost
        ? localRedirectSignIn
        : productionRedirectSignIn,
      redirectSignOut: isLocalhost
        ? localRedirectSignOut
        : productionRedirectSignOut,
      responseType: "token", // or 'token', note that REFRESH token will only be generated when the responseType is code
    },
  },
};

Amplify.configure(awsConfig);

class App extends React.Component {
  state = { user: null, customState: null };
  constructor(props) {
    super(props);
    this.state = {
      applist: [],
      user: null,
      token: null,
      display: <p> Loading </p>,
    };
  }

  async componentDidMount() {
    Amplify.configure(myAppConfig);
    Hub.listen("auth", async ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
          this.setState({ user: data.signInUserSession.idToken.payload.email });
          break;
        case "signOut":
          this.setState({ user: null });
          break;
        case "customOAuthState":
          this.setState({ customState: data });
      }
    });

    Auth.currentAuthenticatedUser()
      .then(async (user) => {
        console.log(user.signInUserSession.idToken.payload.email);
        this.setState({ user: user.signInUserSession.idToken.payload.email });
        const currentSession = await Auth.currentSession();
        const g_header = { Authorization: currentSession.idToken.jwtToken };
        awsConfig.Auth = {
          ...awsConfig.Auth,
          graphql_headers: g_header,
        };
        console.log(Amplify);
        Amplify.configure(awsConfig);
        this.setState({
          token: g_header,
          display: <UrlList user={this.state.user} />,
        });
      })
      .catch((err) => console.log("Not signed in"));
  }

  render() {
    return (
      <>
        {this.state.user ? (
          <div className="App">
            <header className="App-header">
              <span>URL Shortener</span>
              <span>{this.state.user}</span>
              <button
                onClick={() => {
                  Auth.signOut();
                }}
              >
                Sign Out
              </button>
              <Link
                to="/create-url"
                state={{ data: { user: this.state.user } }}
              >
                <button>Create Short URL</button>
              </Link>
            </header>
            {this.state.display}
          </div>
        ) : (
          <button onClick={() => Auth.federatedSignIn()}>
            Sign in with google
          </button>
        )}
      </>
    );
  }
}

export default App;
