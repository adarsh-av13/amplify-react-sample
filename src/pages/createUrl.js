import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { createShortUrl } from "../graphql/mutations";
import Amplify, { API, graphqlOperation } from "aws-amplify";
import "./createUrl.css";

// const myAppConfig = {
//   // ...
//   aws_appsync_graphqlEndpoint: process.env.REACT_APP_API_URL,
//   aws_appsync_region: "us-east-1",
//   aws_appsync_authenticationType: "API_KEY",
//   aws_appsync_apiKey: process.env.REACT_APP_API_KEY,
//   // ...
// };

// Amplify.configure(myAppConfig);

function CreateUrl() {
  const details = useLocation().state.data;
  const navigate = useNavigate();
  const [longUrl, setLongUrl] = useState("");
  const [description, setDescription] = useState("");
  const [curTag, setCurTag] = useState("");
  const [tags, setTags] = useState([]);
  const user = details.user;

  const handleUrlChange = (event) => {
    setLongUrl(event.target.value);
  };

  const handleTagChange = (event) => {
    setCurTag(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const _handleKeyDown = (event) => {
    if (event.key === "Enter") {
      let curTags = tags;
      curTags.push(curTag);
      setTags(curTags);
      setCurTag("");
    }
  };

  const removeTag = (tag) => {
    let curTags = tags;
    curTags = curTags.filter(function (ele) {
      return ele !== tag;
    });
    setTags(curTags);
  };

  const createUrl = async () => {
    console.log(description, longUrl, tags);
    const res = await API.graphql(
      graphqlOperation(createShortUrl, {
        longUrl: longUrl,
        createdBy: user,
        description: description,
        tags: tags,
      })
    );
    console.log(res);
    console.log(res.data);
    console.log(res.data.createShortUrl);
    if (res.data.createShortUrl.StatusCode === "400") {
      alert("Error: Invalid URL. Enter only cloudwick or amorphic domain URLs");
      return;
    }
    if (res.data.createShortUrl.StatusCode === "200") {
      console.log("SET");
      navigate("/url-details", {
        state: {
          data: res.data.createShortUrl.Attributes
        },
        replace: true
      });
    }
  };
  return (
    <div class="form">
      <h1>Create URL</h1>
      <input
        className="cinput"
        type="url"
        placeholder="URL"
        value={longUrl}
        onChange={handleUrlChange}
        required
      />
      <textarea
        className="ctextarea"
        rows="4"
        placeholder="Description"
        value={description}
        onChange={handleDescriptionChange}
        required
      ></textarea>
      <input
        className="cinput"
        type="text"
        placeholder="Tags"
        value={curTag}
        onChange={handleTagChange}
        onKeyDown={_handleKeyDown}
      />
      <div className="ctag-wrapper">
        <span className="cspan">Tags: </span>
        {tags.map((tag) => (
          <span className="ctags" key={tag}>
            <span>{tag}</span>
            <div className="remove-x" onClick={() => removeTag(tag)}>
              x
            </div>
          </span>
        ))}
      </div>
      <button className="cbutton" value="Create" onClick={() => createUrl()}>
        Create
      </button>
    </div>
  );
}

export default CreateUrl;
