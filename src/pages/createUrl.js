import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { createShortUrl } from "../graphql/mutations";
import { API, graphqlOperation } from "aws-amplify";
import "./createUrl.css";

function CreateUrl() {
    const details = useLocation().state.data;
    const navigate = useNavigate();
    const [longUrl, setLongUrl] = useState("");
    const [customUrl, setCustomUrl] = useState("");
    const [description, setDescription] = useState("");
    const [curTag, setCurTag] = useState("");
    const [tags, setTags] = useState([]);
    const [enableCheckbox, setEnableCheckbox] = useState(false);
    const user = details.user;

    const handleUrlChange = (event) => {
        setLongUrl(event.target.value);
    };

    const handleCustomUrlChange = (event) => {
      setCustomUrl(event.target.value);
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
            let currentTag = curTag.trim()
            if(currentTag !== "" && !curTags.includes(currentTag))
              curTags.push(currentTag);
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
                longUrl: longUrl.trim(),
                createdBy: user,
                description: description.trim(),
                tags: tags,
                customUrlFlag: enableCheckbox,
                customUrl: enableCheckbox ? customUrl : null
            })
        );
        console.log(res);
        console.log(res.data);
        console.log(res.data.createShortUrl);
        if (res.data.createShortUrl.StatusCode === "400") {
            if (res.data.createShortUrl.Message === "Invalid Url")
                alert(
                    "Error: Invalid URL. Enter only cloudwick or amorphic domain URLs"
                );
            else alert("Error: Description cannot be empty");
            return;
        }
        if (res.data.createShortUrl.StatusCode === "200") {
            console.log("SET");
            navigate("/url-details", {
                state: {
                    data: res.data.createShortUrl.Attributes,
                },
                replace: true,
            });
        }
    };
    return (
        <div class="form">
            <div class="header-row">
                <h1>Create URL</h1>
                <Link to="/">
                    <button className="home-btn">home</button>
                </Link>
            </div>
            <input
                className="cinput"
                type="url"
                placeholder="URL"
                value={longUrl}
                onChange={handleUrlChange}
                required
            />
            <div className="cerow">
                <input
                    className="cinput"
                    type="text"
                    placeholder="custom endpoint"
                    value={customUrl}
                    onChange={handleCustomUrlChange}
                    disabled={!enableCheckbox}
                />
                <div>
                    <input
                        type="checkbox"
                        name="custom-endpoint"
                        defaultChecked={false}
                        value={enableCheckbox}
                        onChange={(e) => {
                            console.log(e.target);
                            setEnableCheckbox(e.target.checked);
                        }}
                    />
                    <label for="custom-endpoint">
                        {" "}
                        use custom URL endpoint
                    </label>
                </div>
            </div>
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
                placeholder="Tag (Press Enter after adding each tag)"
                value={curTag}
                onChange={handleTagChange}
                onKeyDown={_handleKeyDown}
            />
            <div className="ctag-wrapper">
                <span className="cspan">Tags: </span>
                {tags.map((tag) => (
                    <span className="ctags" key={tag}>
                        <span>{tag}</span>
                        <div
                            className="remove-x"
                            onClick={() => removeTag(tag)}
                        >
                            x
                        </div>
                    </span>
                ))}
            </div>
            <button
                className="cbutton"
                value="Create"
                onClick={() => createUrl()}
            >
                Create
            </button>
        </div>
    );
}

export default CreateUrl;
