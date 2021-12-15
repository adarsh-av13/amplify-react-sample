import React from "react";
import "./App.css";
import Amplify, { API, graphqlOperation } from "aws-amplify";
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
  aws_appsync_authenticationType: "API_KEY",
  aws_appsync_apiKey: process.env.REACT_APP_API_KEY,
  // ...
};

Amplify.configure(myAppConfig);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      applist: [],
      longUrl: "",
      description: "",
      user: "av",
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
    const res = await API.graphql(graphqlOperation(getAllUrls));
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
    if(res.data.createShortUrl === 'Invalid Url') {
      alert('Error: Invalid URL. Enter only cloudwick or amorphic domain URLs')
      return
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
    const data = await this.getUrls();
    this.setState({ applist: data });
    console.log(window.location)
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <span>Create Short URL</span>
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
                  
                <td><Link  className="pink-text" to="/url-details" state={{ data: d }}>{window.location.origin+'/'+d.ShortUrl}</Link></td>
                <td><Link to="/url-details" state={{ data: d }}>{d.LongUrl}</Link></td>
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
    );
  }
}

export default App;
