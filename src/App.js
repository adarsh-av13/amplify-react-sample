import React from "react";
import "./App.css";
import Amplify, { Auth, Hub } from "aws-amplify";
import { Link } from "react-router-dom";
import UrlList from "./components/urlList";

const myAppConfig = {
    aws_appsync_graphqlEndpoint: process.env.REACT_APP_API_URL,
    aws_appsync_region: "us-east-1",
    aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS",
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
    "http://localhost:3000," + process.env.REACT_APP_DOMAIN;

const [localRedirectSignIn, productionRedirectSignIn] = redirectUrl.split(",");

const [localRedirectSignOut, productionRedirectSignOut] =
    redirectUrl.split(",");

console.log(localRedirectSignOut, productionRedirectSignOut);
console.log(localRedirectSignIn, productionRedirectSignIn);

const awsConfig = {
    Auth: {
        region: process.env.REACT_APP_REGION,
        userPoolId: process.env.REACT_APP_USER_POOL_ID,
        userPoolWebClientId: process.env.REACT_APP_USER_POOL_WEB_CLIENT_ID,
        graphql_headers: async () => {
            const currentSession = await Auth.currentSession();
            console.log(currentSession);
            return {
                Authorization: currentSession.getAccessToken().getJwtToken(),
            };
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
                    this.setState({
                        user: {
                            email: data.signInUserSession.idToken.payload.email
                            // name:
                            //     data.signInUserSession.idToken.payload
                            //         .given_name +
                            //     " " +
                            //     data.signInUserSession.idToken.payload
                            //         .family_name,
                        },
                    });
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
                console.log(user);
                this.setState({
                    user: {
                        email: user.signInUserSession.idToken.payload.email
                        // name:
                        //     user.signInUserSession.idToken.payload.given_name +
                        //     " " +
                        //     user.signInUserSession.idToken.payload.family_name,
                    },
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
                            <span class="App-name">URL Shortener</span>
                            <div>
                            <Link
                                to="/create-url"
                                state={{
                                    data: { user: this.state.user.email },
                                }}
                            >
                                <button className="createurl">Create Short URL</button>
                            </Link>
                            <button className="signout"
                                onClick={() => {
                                    Auth.signOut();
                                }}
                            >
                                Sign Out
                            </button>
                            </div>
                        </header>
                        <UrlList user={this.state.user.email} />
                    </div>
                ) : (
                    <div className="login-container">
                        <div className="login-box">
                            <h1 className="App-name">URL Shortener</h1>
                            <button onClick={() => Auth.federatedSignIn()}>
                                Sign in with google
                            </button>
                        </div>
                    </div>
                )}
            </>
        );
    }
}

export default App;
