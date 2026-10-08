import { fetchAuthSession } from "@aws-amplify/auth";
import { useResponsive } from "../../../../../../../../constants/reactResponsive";
import { useUpdateDocument } from "../../../../../../../../functions/supabase/streaming/useUpdateDocument";
import { useApiToken } from "../../../../../../../../hooks/useApiToken";
import { useShowPopopStaffEdit } from "../../../../../../../../stores/homeStore";
import { Popup } from "../../../../../../../common/inputs/popup/Popup";
import { UserFormComponent } from "../../../common/userForm/UserFormComponent";

export const PopUpStaffEditComponent = () => {
  const { isSm } = useResponsive();
  const { data, setisPopupVisible, isPopupVisible } = useShowPopopStaffEdit();
  const { updateDoc } = useUpdateDocument("users");
  const idUser = data.id;
  const userName = data.username;
  const { postApiTokenAuth } = useApiToken();

  return (
    <Popup
      isOpen={isPopupVisible}
      onClose={() => setisPopupVisible(false)}
      width={isSm ? "95%" : "800px"}
      height={isSm ? "80dvh" : "92.5dvh"}
    >
      <div className="home-titles">
        <img src="/img/icons/logo_shield.svg" alt="Icono del escudo del logo" />
        <div className="txt-container">
          <h4>Actualizar usuario</h4>
          <p>Modifica la información del usuario</p>
        </div>
      </div>
      <UserFormComponent
        initialValues={data}
        handleDiscard={() => {
          setisPopupVisible(false);
        }}
        onSubmitAction={async (data) => {
          const session = await fetchAuthSession();
          const idToken = session.tokens?.idToken?.toString();

          const payload = {
            username: userName,
            email: data.email,
            newRole: data.role,
            password: data.password,
          };
          await postApiTokenAuth({
            url: "update-user",
            token: idToken || "",
            body: payload,
          });
          await updateDoc(idUser, {
            email: data.email,
            name: data.name,
            role: data.role,
          });
          setisPopupVisible(false);
        }}
      />
    </Popup>
  );
};
