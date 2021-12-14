import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {editDescription} from '../graphql/mutations';
import Amplify, { API, graphqlOperation } from "aws-amplify";
import "./editUrl.css";

const myAppConfig = {
    // ...
    aws_appsync_graphqlEndpoint: process.env.REACT_APP_API_URL,
    aws_appsync_region: "us-east-1",
    aws_appsync_authenticationType: "API_KEY",
    aws_appsync_apiKey: process.env.REACT_APP_API_KEY,
    // ...
  };
  
Amplify.configure(myAppConfig);


function EditUrlDetails() {
  const details = useLocation().state.data;
  const navigate = useNavigate()
  const [description, setDescription] = useState(details.Description);
  
  const editUrlDescription = async () => {
    console.log(details.LongUrl, description);
    const res = await API.graphql(
      graphqlOperation(editDescription, {
        longUrl: details.LongUrl,
        createdBy: details.CreatedBy,
        description: description,
      })
    );
    console.log(res);
    console.log(res.data);
    navigate("/", { replace: true });
  };

  return (
    <div className="App_two">
      <div className="student-profile py-4">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="card shadow-sm">
                <div className="card-header bg-transparent border-0">
                  <h3 className="mb-0">
                    <i className="far fa-clone pr-1"></i>URL Details
                  </h3>
                  <div className="button-row">
                    <Link to="/"><button className="cancel-btn">Cancel</button></Link>
                    <button className="save-btn" onClick={editUrlDescription}>Save</button>
                  </div>
                </div>
                <div className="card-body pt-0">
                  <table className="table table-bordered">
                    <tr>
                      <th width="30%">Short URL</th>
                      <td width="2%">:</td>
                      <td>{details.ShortUrl}</td>
                    </tr>
                    <tr>
                      <th width="30%">Long URL</th>
                      <td width="2%">:</td>
                      <td>{details.LongUrl}</td>
                    </tr>
                    <tr>
                      <th width="30%">Created At</th>
                      <td width="2%">:</td>
                      <td>{details.CreatedAt}</td>
                    </tr>
                    <tr>
                      <th>Modified At</th>
                      <td width="2%">:</td>
                      <td>{details.ModifiedAt}</td>
                    </tr>
                    <tr>
                      <th>Expires At</th>
                      <td width="2%">:</td>
                      <td>{details.ExpiresAt}</td>
                    </tr>
                    <tr>
                      <th>Number of Clicks</th>
                      <td width="2%">:</td>
                      <td>{details.NumberOfClicks}</td>
                    </tr>
                    <tr>
                      <th>Description</th>
                      <td width="2%">:</td>
                      <td>
                        <textarea
                          rows="4"
                          placeholder="Description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditUrlDetails;
