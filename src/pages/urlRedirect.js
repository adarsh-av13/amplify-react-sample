import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Amplify, { API, graphqlOperation } from "aws-amplify";
import { getLongUrl } from "../graphql/queries";

const myAppConfig = {
  // ...
  aws_appsync_graphqlEndpoint: process.env.REACT_APP_API_URL,
  aws_appsync_region: "us-east-1",
  aws_appsync_authenticationType: "API_KEY",
  aws_appsync_apiKey: process.env.REACT_APP_API_KEY,
  // ...
};

Amplify.configure(myAppConfig);

function UrlRedirect() {
  const params = useParams();
  const [text, setText] = useState('Redirecting....')
  const shortUrl = params.shorturl;
  useEffect(() => {
    getLongUrlWrapper(shortUrl);
  });

  const getLongUrlWrapper = async (shortUrl) => {
    const res = await API.graphql(
      graphqlOperation(getLongUrl, { shortUrl: shortUrl })
    );
    console.log(res.data);
    const data = JSON.parse(res.data.getLongtUrl);
    if(data.length === 0) {
      setText('ERROR 404: Page Not Found')
    }
    else {
      let longUrl = data[0].LongUrl;
      if(!longUrl.startsWith("https://"))
        longUrl = "https://"+longUrl
      window.location.assign(longUrl);
    }
  };
  return <h1>{text}</h1>;
}

export default UrlRedirect;
