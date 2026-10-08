import { fetchAuthSession } from "@aws-amplify/auth";
import { useResponsive } from "../../../../../../../../constants/reactResponsive";
import { useDeleteDocument } from "../../../../../../../../functions/supabase/streaming/useDeleteDocument";
import { useShowPopopStaffDelete } from "../../../../../../../../stores/homeStore";
import { Popup } from "../../../../../../../common/inputs/popup/Popup";
import { useApiToken } from "../../../../../../../../hooks/useApiToken";
import { DeleteButton } from "../../../../../../../common/buttons/warnings/DeleteButton";
import { DiscardButton } from "../../../../../../../common/buttons/warnings/DiscardButton";

export const PopUpStaffDeleteComponent = () => {
  const { isSm } = useResponsive();
  const { data, setisPopupVisible, isPopupVisible } = useShowPopopStaffDelete();
  const { deleteDoc, deleting } = useDeleteDocument("users");
  const { postApiTokenAuth } = useApiToken();
  const userId = data.username;
  const handleDelete = async () => {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();
    const payload = {
      username: userId,
    };
    await postApiTokenAuth({
      url: "delete-user",
      token: idToken || "",
      body: payload,
    });
    await deleteDoc(data.id);
    setisPopupVisible(false);
  };
  return (
    <Popup
      isOpen={isPopupVisible}
      onClose={() => setisPopupVisible(false)}
      width={isSm ? "95%" : "700px"}
      height={isSm ? "50dvh" : "30dvh"}
    >
      <div className="popup-delete-container">
        <div className="popup-title">
          <h3>¿Estás seguro de que deseas eliminar este usuario?</h3>
        </div>
        <div className="btn-container">
          <DiscardButton
            onClick={() => {
              setisPopupVisible(false);
            }}
            width={isSm ? "40%" : "50%"}
            height="60px"
          />
          <DeleteButton
            isLoading={deleting}
            onClick={handleDelete}
            disabled={deleting}
            width={isSm ? "40%" : "50%"}
            height="60px"
          />
        </div>
      </div>
    </Popup>
  );
};
