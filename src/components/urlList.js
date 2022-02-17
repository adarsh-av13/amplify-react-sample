import React from "react";
import "../App.css";
import { API, graphqlOperation } from "aws-amplify";
import { getAllUrls } from "../graphql/queries";
import { Link } from "react-router-dom";
import { deleteShortUrl, renewShortUrl } from "../graphql/mutations";

class UrlList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      applist: [],
      displaylist: [],
      user: this.props.user,
      tags: ["filter tag"],
      activeTags: [],
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
  updateDisplayList = () => {
    console.log(this.state.activeTags)
    if(this.state.activeTags.length === 0) {
      this.setState({displaylist: this.state.applist})
      return
    }
    let displaylist = this.state.applist.filter((item) => {
      return this.state.activeTags.every(tag => item.Tags.includes(tag))
    });
    this.setState({displaylist: displaylist});
  }  
  handleTagChange = (event) => {
    console.log(event.target.value);
    let tags = this.state.tags;
    let activeTags = this.state.activeTags;
    tags = tags.filter((tag) => {
      return tag !== event.target.value;
    });
    activeTags.push(event.target.value);
    this.setState({ tags: tags, activeTags: activeTags }, this.updateDisplayList);
  };

  removeTag = (rtag) => {
    let tags = this.state.tags;
    let activeTags = this.state.activeTags;
    activeTags = activeTags.filter((tag) => {
      return tag !== rtag;
    });
    tags.push(rtag)
    this.setState({ tags: tags, activeTags: activeTags }, this.updateDisplayList);
  }

  getUrls = async () => {
    const res = await API.graphql(
      graphqlOperation(getAllUrls, { createdBy: this.state.user })
    );
    console.log(res.data);
    console.log(res.data.getAllUrlByUser.AttributeList);
    return res.data.getAllUrlByUser.AttributeList;
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
      displaylist: this.state.displaylist.filter(function (appitem) {
        return appitem.ShortUrl !== d.ShortUrl;
      }),
    });
  };

  renwewUrl = async (d) => {
    console.log(d.ShortUrl, d.CreatedBy);
    console.log(typeof d.ShortUrl, typeof d.CreatedBy);
    const res = await API.graphql(
      graphqlOperation(renewShortUrl, {
        longUrl: d.LongUrl,
        createdBy: d.CreatedBy,
      })
    );
    if(res.data.renewUrl.StatusCode === '400')
      alert("ERROR: Cannot renew URL having more than 30 days validity")
    else
      alert("Renewal Successful")
    console.log(res);
  };

  async componentDidMount() {
    const data = await this.getUrls();
    this.setState({ applist: data });
    let tags = this.state.tags;
    this.state.applist.map((item) =>
      item.Tags.map((tag) => {
        if (!tags.includes(tag)) tags.push(tag);
        return null;
      })
    );
    this.setState({ tags: tags, displaylist: this.state.applist });
    console.log(tags);
  }

  render() {
    return (
      <div>
        <div>
          <span className="filter">
            Add Filter:{" "}
            <select value="Add Tag" onChange={this.handleTagChange}>
            {this.state.tags.map((tag) => (
              <option key={tag}>{tag}</option>
            ))}
          </select>
            {this.state.activeTags.map((tag) => (
              <span className="ctags" key={tag}>
                <span>{tag}</span>
                <div className="remove-x" onClick={() => this.removeTag(tag)}>
                  x
                </div>
              </span>
            ))}
          </span>
          
        </div>
        <table className="container">
          <thead>
            <tr>
              <th class="tshorturl">
                <h1>ShortUrl</h1>
              </th>
              <th class="tlongurl">
                <h1>LongUrl</h1>
              </th>
              {/* <th>
                  <h1>CreatedBy</h1>
                </th> */}
              <th class="tactions">
                <h1>Actions</h1>
              </th>
            </tr>
          </thead>
          <tbody>
            {this.state.displaylist.map((d) => (
              <tr key={d.ShortUrl}>
                <td class="tshorturl">
                  <a
                    href={d.ShortUrl}
                    state={{ data: d }}
                  >
                    {d.ShortUrl}
                  </a>
                </td>
                <td class="tlongurl">
                  <a href={d.LongUrl} state={{ data: d }}>
                    {d.LongUrl}
                  </a>
                </td>
                {/* <td>{d.CreatedBy}</td> */}
                <td className="actions tactions">
                <Link to="/url-details" state={{ data: d }}>
                    <button className="dts-button" value="details">
                      details
                    </button>
                  </Link>
                  <Link to="/edit-url-details" state={{ data: d }}>
                    <button className="edit-button" value="edit">
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

export default UrlList;
