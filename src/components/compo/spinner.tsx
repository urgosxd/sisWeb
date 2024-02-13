import React, { CSSProperties } from "react"
import ClipLoader from 'react-spinners/ClipLoader';

export default function Loader(){
  const override: CSSProperties = {
  display: "block",
  // margin: "0 auto",
  // borderColor: "red",
};
  return (<div className="">
      <ClipLoader  cssOverride={override} loading={true} size={20}/>
    </div>)
}
