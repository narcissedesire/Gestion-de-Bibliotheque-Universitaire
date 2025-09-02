import React from "react";
import "./style.css";

export default function Loading() {
  return (
    <div className="container_loading">
      <div className="center">
        <div className="text">LOADING</div>
        <div className="ring"></div>
      </div>
    </div>
  );
}
