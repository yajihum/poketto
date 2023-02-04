import { useEffect, useState } from "react";
import { z } from "zod";

const schema = z.object({
  message: z.string(),
  addMsg: z.string().optional(),
});

type Props = z.infer<typeof schema>;

const ErrorMessage = ({ message, addMsg }: Props) => {
  const [data, setData] = useState<Props>();

  useEffect(() => {
    try {
      const zObj = schema.parse({ message: message, addMsg: addMsg });
      setData(zObj);
    } catch (err) {
      if (err instanceof z.ZodError) {
        console.log(err.issues[0].message);
      }
    }
  }, []);

  return (
    <>
      {data && (
        <p className="text-center text-lg font-semibold text-sky-600">
          {data.addMsg ? data.addMsg + data.message : data.message}
        </p>
      )}
    </>
  );
};

export default ErrorMessage;
