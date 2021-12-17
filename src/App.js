import React from "react";
import "./App.css";
import Amplify, { API, graphqlOperation, Auth, Hub } from "aws-amplify";
import { getAllUrls } from "./graphql/queries";
import { Link } from "react-router-dom";
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
  // ...
};

Amplify.configure(myAppConfig);

const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === "[::1]" ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

const redirectUrl = "http://localhost:3000/,https://master.d2nig2yymdsjds.amplifyapp.com/"

const [localRedirectSignIn, productionRedirectSignIn] =
  redirectUrl.split(",");

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
      return { Authorization: currentSession.getIdToken().getJwtToken() };
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

console.log(awsConfig)
Amplify.configure(awsConfig);

class App extends React.Component {
  state = { user: null, customState: null };
  constructor(props) {
    super(props);
    this.state = {
      applist: [],
      longUrl: "",
      description: "",
      user: null,
    };

    this.handleUrlChange = this.handleUrlChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
  }

  handleUrlChange = (event) => {
    this.setState({ longUrl: event.target.value });
  };

  handleDescriptionChange = (event) => {
    this.setState({ description: event.target.value });
  };

  getUrls = async () => {
    const res = await API.graphql(
      graphqlOperation(getAllUrls, { createdBy: this.state.user })
    );
    console.log(res.data);
    const data = JSON.parse(res.data.getAllUrlByUser);
    return data;
  };

  createUrl = async () => {
    console.log(this.state.longUrl, this.state.description);
    const res = await API.graphql(
      graphqlOperation(createShortUrl, {
        longUrl: this.state.longUrl,
        createdBy: this.state.user,
        description: this.state.description,
      })
    );
    console.log(res);
    console.log(res.data);
    console.log(res.data.createShortUrl);
    if (res.data.createShortUrl === "Invalid Url") {
      alert("Error: Invalid URL. Enter only cloudwick or amorphic domain URLs");
      return;
    }
    const jsondata = JSON.parse(res.data.createShortUrl);
    if (
      !this.state.applist.some(function (el) {
        return el.ShortUrl === jsondata.ShortUrl;
      })
    ) {
      const data = {
        CreatedBy: jsondata.CreatedBy,
        LongUrl: jsondata.LongUrl,
        ShortUrl: jsondata.ShortUrl,
      };
      console.log(data);
      this.setState({
        applist: this.state.applist.concat(data),
        longUrl: "",
        description: "",
      });
    }
  };

  deleteUrl = async (d) => {
    console.log(d.ShortUrl, d.CreatedBy);
    console.log(typeof d.ShortUrl, typeof d.CreatedBy);
    const res = await API.graphql(
      graphqlOperation(deleteShortUrl, {
        longUrl: d.LongUrl,
        createdBy: d.CreatedBy,
      })
    );
    console.log(res);
    this.setState({
      applist: this.state.applist.filter(function (appitem) {
        return appitem.ShortUrl !== d.ShortUrl;
      }),
    });
  };

  editUrl = () => {};
  renwewUrl = async (d) => {
    console.log(d.ShortUrl, d.CreatedBy);
    console.log(typeof d.ShortUrl, typeof d.CreatedBy);
    const res = await API.graphql(
      graphqlOperation(renewShortUrl, {
        longUrl: d.LongUrl,
        createdBy: d.CreatedBy,
      })
    );
    console.log(res);
  };

  async componentDidMount() {
    Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
          console.log(data);
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
        console.log("GI");
        const data = await this.getUrls();
        this.setState({ applist: data });
        console.log(window.location);
      })
      .catch((err) => console.log("Not signed in"));
  }

  render() {
    return (
      <>
        {this.state.user ? (
          <div className="App">
            <header className="App-header">
              <span>Create Short URL</span>
              <span>{this.state.user}</span>
              <button
                onClick={() => {
                  Auth.signOut();
                }}
              >
                Sign Out
              </button>
              <div className="columnar">
                <input
                  type="url"
                  placeholder="Long URL"
                  value={this.state.longUrl}
                  onChange={this.handleUrlChange}
                  required
                ></input>
                <textarea
                  rows="4"
                  placeholder="Description"
                  value={this.state.description}
                  onChange={this.handleDescriptionChange}
                ></textarea>
              </div>
              <button onClick={this.createUrl}>Create</button>
            </header>
            <table className="container">
              <thead>
                <tr>
                  <th>
                    <h1>ShortUrl</h1>
                  </th>
                  <th>
                    <h1>LongUrl</h1>
                  </th>
                  {/* <th>
                <h1>CreatedBy</h1>
              </th> */}
                  <th>
                    <h1>Actions</h1>
                  </th>
                </tr>
              </thead>
              <tbody>
                {this.state.applist.map((d) => (
                  <tr key={d.ShortUrl}>
                    <td>
                      <Link
                        className="pink-text"
                        to="/url-details"
                        state={{ data: d }}
                      >
                        {window.location.origin + "/" + d.ShortUrl}
                      </Link>
                    </td>
                    <td>
                      <Link to="/url-details" state={{ data: d }}>
                        {d.LongUrl}
                      </Link>
                    </td>
                    {/* <td>{d.CreatedBy}</td> */}
                    <td className="actions">
                      <Link to="/edit-url-details" state={{ data: d }}>
                        <button
                          className="edit-button"
                          value="edit"
                          onClick={() => this.editUrl(d)}
                        >
                          edit
                        </button>
                      </Link>
                      <button
                        className="renew-button"
                        value="renew"
                        onClick={() => this.renwewUrl(d)}
                      >
                        renew
                      </button>
                      <button
                        className="del-button"
                        value="delete"
                        onClick={() => this.deleteUrl(d)}
                      >
                        delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
