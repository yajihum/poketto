import { useEffect, useState } from "react";
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

export const ImageWithLoading = ({
  src,
  alt,
  width,
  height,
  className,
}: Props) => {
  const [loaded, setLoaded] = useState(false);

  function HandleLoading(isLoad: boolean) {
    setLoaded(isLoad);
    setLoaded(false);
  }

  useEffect(() => {
    console.log(loaded);
  }, [loaded]);

  return (
    <>
      {loaded ? (
        <Skeleton variant="circular" width={120} height={120} />
      ) : (
        <Image
          width={width}
          height={height}
          alt={alt}
          src={src}
          className={classNames(className)} // 読み込み完了後はクラス名を変更
          onLoadingComplete={() => HandleLoading(true)}
        />
      )}
    </>
  );
};
