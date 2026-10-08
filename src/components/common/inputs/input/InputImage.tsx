import { CiSearch } from "react-icons/ci";
import type { InputImageProps } from "../../../../types/form/inputsType";

export const InputImage = <T extends Record<string, any>>({
  id,
  placeholder,
  register,
  type,
  content,
  width,
  height,
}: InputImageProps<T>) => {
  return (
    <div className="inpuImageContainer">
      <div
        style={{
          ...(width ? { width } : {}),
          ...(height ? { height } : {}),
        }}
        className="inputImage"
      >
        <div className={"inputIconSearch"}>
          <CiSearch />
          <input
            id={id}
            type={type}
            placeholder={placeholder}
            {...register(id)}
          />
        </div>
      </div>
      <div className="inputImageContent">
        {content.map((item, index) => {
          return (
            <div key={index} className="generalSearch">
              <div className="contentSearch" key={index}>
                <img
                  src={item.icon}
                  className="icon"
                  alt="Imagen mostrada de la busqueda"
                />
                <p className="text">{item.text}</p>
              </div>
              <div className="lineSearch"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
