import { useState } from "react";

const useFetch = <T>(cb: (...args: any[]) => Promise<T>, defaultValue: T) => {
  const [data, setData] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fn = async (...args: any[]) => {
    setLoading(true);
    setError(null);

    try {
      const response = await cb(...args);
      setData(response);
      setError(null);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        setError(error?.message);
      } else {
        setError("something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn, setData };
};
//{
//   data: T | undefined,
//   loading: boolean,
//   error: Error | null,
//   fn: (...args: any[]) => Promise<void>,
//   setData: React.Dispatch<React.SetStateAction<T | undefined>>
// }

export default useFetch;
