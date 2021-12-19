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
  const [text, setText] = useState('Redirecting....')
  let shortUrl = window.location.href;
  console.log(shortUrl)
  if(!shortUrl.startsWith("https://master.d2nig2yymdsjds.amplifyapp.com/")) {
    shortUrl = 'https://master.d2nig2yymdsjds.amplifyapp.com/' + shortUrl.substring(shortUrl.length-7)
  }
  useEffect(() => {
    getLongUrlWrapper(shortUrl);
  });

  const getLongUrlWrapper = async (shortUrl) => {
    const res = await API.graphql(
      graphqlOperation(getLongUrl, { shortUrl: shortUrl })
    );
    console.log(res.data);
    const data = res.data.getLongtUrl
    if(data.StatusCode === "404") {
      setText('ERROR 404: Page Not Found')
    }
    else if(data.StatusCode === "200") {
      let longUrl = data.LongUrl;
      if(!longUrl.startsWith("https://"))
        longUrl = "https://"+longUrl
      window.location.assign(longUrl);
    }
  };
  return <h1>{text}</h1>;
}

export default UrlRedirect;
