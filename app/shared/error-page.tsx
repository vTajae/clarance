import * as React from "react";
import { Error } from "../props/error";
import Warning from "../images/Error.png";
import "../styles/default/error.css";
import Header from "../components/header";

export default function ErrorPage(props: Error) {
  let key = 0;

  return (
    <div>
      <div className="body">
        <div className="error-outer">
          <div className="error-heading">
            <img alt="logo" src={Warning} className="error-logo" />
            <h2>Application error detected</h2>
          </div>
          <h3>{props.message}</h3>
          {props.stack
            .split("\n")
            .filter((segment) => segment !== "    at div")
            .map((segment) => (
              <div key={key++}>{segment}</div>
            ))}
          ;
        </div>
      </div>
    </div>
  );
}
