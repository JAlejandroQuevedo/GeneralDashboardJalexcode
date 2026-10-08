import { fetchAuthSession } from "@aws-amplify/auth";
import { useResponsive } from "../../../../../../../../constants/reactResponsive";
import { useApiToken } from "../../../../../../../../hooks/useApiToken";
import type { PopUpHomePropsType } from "../../../../../../../../types/home/dashboardTypes";
import { Popup } from "../../../../../../../common/inputs/popup/Popup";
import { useShowPopopStaffCreate } from "../../../../../../../../stores/homeStore";
import { UserFormComponent } from "../../../common/userForm/UserFormComponent";
import { useState } from "react";

export const PopUpStaffCreateComponent = ({
  btnVoid,
  isOpen,
}: PopUpHomePropsType) => {
  const { isSm } = useResponsive();
  const { postApiTokenAuth } = useApiToken();
  const { setisPopupVisible } = useShowPopopStaffCreate();
  const [error, setError] = useState<string>("");
  return (
    <Popup
      isOpen={isOpen}
      onClose={btnVoid}
      width={isSm ? "95%" : "800px"}
      height={isSm ? "80dvh" : "90dvh"}
    >
      <div className="home-titles">
        <img src="/img/icons/logo_shield.svg" alt="Icono del escudo del logo" />
        <div className="txt-container">
          <h4>Crear usuario</h4>
          <p>Una vez creado, el username no se puede modificar</p>
        </div>
      </div>

      <UserFormComponent
        handleDiscard={() => {
          setisPopupVisible(false);
        }}
        error={error}
        onSubmitAction={async (data) => {
          setError("");
          const payload = {
            username: data.username,
            name: data.name,
            email: data.email,
            role: data.role,
            password: data.password,
          };

          const session = await fetchAuthSession();
          const idToken = session.tokens?.idToken?.toString();

          const createUser = await postApiTokenAuth({
            url: "create-user",
            token: idToken || "",
            responseKey: "response",
            body: payload,
          });
          if (!createUser.success) {
            setError(createUser.error);
          } else {
            setisPopupVisible(false);
          }
        }}
      />
    </Popup>
  );
};
