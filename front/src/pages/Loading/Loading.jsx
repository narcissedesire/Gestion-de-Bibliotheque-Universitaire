import React from "react";
import "./style.css";

export default function Loading() {
  return (
    <span className="container_loading">
      <span className="center">
        <div className="text">LOADING</div>
        <div className="ring"></div>
      </span>
    </span>
  );
}
