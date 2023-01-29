type Props = {
  src: string;
};

const Avatar = ({ src }: Props) => {
  if (src) {
    return <img src={src} className="block h-20 w-20 rounded-full" alt="" />;
  } else {
    return <div className="h-20 w-20 rounded-full bg-gray-400"></div>;
  }
};

export default Avatar;
