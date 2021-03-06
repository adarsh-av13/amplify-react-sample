import React from "react";
import { useLocation, Link } from "react-router-dom";
import "./editUrl.css";
import { fixDateFormat } from "../utils";

function UrlDetails() {
    const details = useLocation().state.data;
    return (
        <div className="App_two">
            <div className="student-profile py-4">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="card shadow-sm">
                                <div className="card-header bg-transparent border-0">
                                    <h3 className="mb-0">
                                        <i className="far fa-clone pr-1"></i>URL
                                        Details
                                    </h3>
                                    <div className="button-row">
                                        <Link to="/">
                                            <button className="home-btn">
                                                home
                                            </button>
                                        </Link>
                                        <Link
                                            to="/edit-url-details"
                                            state={{ data: details }}
                                        >
                                            <button
                                                className="edit-btn"
                                                value="edit"
                                            >
                                                edit
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                                <div className="card-body pt-0">
                                    <table className="table table-bordered">
                                        <tr>
                                            <th width="30%">Short URL</th>
                                            <td>{details.ShortUrl}</td>
                                        </tr>
                                        <tr>
                                            <th width="30%">Long URL</th>
                                            <td>{details.LongUrl}</td>
                                        </tr>
                                        <tr>
                                            <th width="30%">Created At</th>
                                            <td>{fixDateFormat(details.CreatedAt)}</td>
                                        </tr>
                                        <tr>
                                            <th>Modified At</th>
                                            <td>{fixDateFormat(details.ModifiedAt)}</td>
                                        </tr>
                                        <tr>
                                            <th>Expires On</th>
                                            <td>{fixDateFormat(details.ExpiresAt).slice(0,-5)}</td>
                                        </tr>
                                        <tr>
                                            <th>Number of Clicks</th>
                                            <td>{details.NumberOfClicks}</td>
                                        </tr>
                                        <tr>
                                            <th>Description</th>
                                            <td>{details.Description}</td>
                                        </tr>
                                        <tr>
                                            <th>Tags</th>
                                            <td>
                                                <div className="ctag-wrapper">
                                                    {details.Tags.map((tag) => (
                                                        <span
                                                            className="ctags"
                                                            key={tag}
                                                        >
                                                            <span>{tag}</span>
                                                        </span>
                                                    ))}
                                                </div>
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

export default UrlDetails;
