import React from "react";
import s from "./SpinnerbLoader.module.css";
import cn from "clsx";

interface SpinnerbLoaderProps {
  className?: string;
}

const SpinnerbLoader = ({ className }: SpinnerbLoaderProps) => {
  return <span className={cn(s.Loader, {}, className && className)}></span>;
};

export default SpinnerbLoader;
