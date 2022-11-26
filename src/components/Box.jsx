import React from "react";

export default function Box({ title, children, w, h, p }) {
  return (
    <article style={{ width: w }}>
      <h3>{title}</h3>
      <hr />
      <div
        style={
          ({ padding: p ? "10px" : "0" }, { height: h ? h : "fit-content" })
        }
      >
        {children}
      </div>
    </article>
  );
}
