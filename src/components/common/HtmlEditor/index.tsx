import React, { useEffect, useRef } from "react";
import EditorJs from "react-editor-js";
import classNames from "classnames";
import useThrottle from "../../../hooks/useThrottle";

import { EDITOR_JS_TOOLS } from "./constants";
import "./index.css";

interface IHtmlEditor {
  className?: string;
  setData: any;
  data: any;
  minHeight?: number;
  placeholder?: string;
  holder?: string;
}

export default function HtmlEditor({
  className,
  setData,
  data,
  minHeight,
  placeholder = "",
  holder = "editor"
}: IHtmlEditor) {
  const instanceRef: any = useRef(null);
  const getSavedData = async () => {
    const savedData = await instanceRef.current.save();
    return savedData;
  };
  const throttleData = useThrottle(null, getSavedData);

  useEffect(() => {
    setData(throttleData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [throttleData]);

  return (
    <div className={`mt-1 rounded-md shadow-sm border border-solid border-slate-200 p-2 ${classNames(className)}`}>
      <EditorJs
        instanceRef={(instance: any) => (instanceRef.current = instance)}
        tools={EDITOR_JS_TOOLS}
        data={data}
        holder={holder}
        minHeight={minHeight}
        placeholder={placeholder}
      >
        <div id={holder} />
      </EditorJs>
    </div>
  )
}