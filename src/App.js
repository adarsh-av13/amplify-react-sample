import React from "react";
import "./App.css";
import Amplify, { API } from "aws-amplify";

Amplify.configure({
  API: {
    endpoints: [
      {
        name: "demo",
        endpoint: "https://u2wgrmfdg6.execute-api.us-east-1.amazonaws.com/default",
      },
    ],
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      applist: [],
    };
  }

  loadRest = async () => {
    const res = await API.get("demo",'/movies')
    const mylist = res.body
    this.setState({applist: mylist})
  }

  loadGraph = () => {
    this.setState({applist: []})
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <span>Sample List</span>
          <div>
          <button onClick={this.loadRest}>REST</button>
          <button onClick={this.loadGraph}>GraphQL</button>
          </div>
        </header>
        <div>
          <ul className="App-list">
            {this.state.applist.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
