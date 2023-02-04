import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Skeleton } from "@mui/material";
import { classNames } from "../../lib/class-names";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
};

const ImageWithLoading = ({ src, alt, width, height, className }: Props) => {
  const [loaded, setLoaded] = useState(false);

  // 修正
  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <>
      <Skeleton
        variant="circular"
        width={120}
        height={120}
        className={loaded ? "hidden" : "block"}
      />
      <Image
        width={width}
        height={height}
        alt={alt}
        src={src}
        className={classNames(loaded ? "block" : "hidden", className)}
        onLoadingComplete={() => setLoaded(true)}
      />
    </>
  );
};

export default ImageWithLoading;
