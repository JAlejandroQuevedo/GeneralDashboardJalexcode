import type { LoaderPropsType } from "../../../types";

export const Loader = ({ width, height }: LoaderPropsType) => {
  return (
    <div className="loader-container">
      <div
        style={{
          ...(width ? { width } : {}),
          ...(height ? { height } : {}),
        }}
        className="loader"
      ></div>
    </div>
  );
};
