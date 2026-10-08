import { fetchAuthSession } from "@aws-amplify/auth";
import { useUpdateDocument } from "../../../../../../../functions/supabase/streaming/useUpdateDocument";
import { useApiToken } from "../../../../../../../hooks/useApiToken";
import { useUserData } from "../../data/userData";
import { BeatLoader } from "react-spinners";
import { UserFormComponent } from "../../common/userForm/UserFormComponent";
import { useAuthStore } from "../../../../../../../stores/userStore";

export const SettingsHome = () => {
  const { updateDoc } = useUpdateDocument("users");
  const { postApiTokenAuth } = useApiToken();

  const { data, loading } = useUserData();
  const idUser = data?.id || "";
  const initialValues = {
    name: data?.name || "",
    email: data?.email || "",
    username: data?.username || "",
    role: data?.role || "staff",
  };
  const userName = data?.username;
  const { user } = useAuthStore();
  const role = user?.role;
  const showElements = () => {
    if (role === "super-admin") {
      return true;
    } else if (role === "staff") {
      return false;
    } else if (role === "admin") {
      return false;
    } else {
      return false;
    }
  };

  return (
    <>
      {loading ? (
        <div className="loader-card">
          <BeatLoader size={8} color="#85b6ff" />
        </div>
      ) : (
        <div>
          <div className="home-titles">
            <img
              src="/img/icons/logo_shield.svg"
              alt="Icono del escudo del logo"
            />
            <div className="txt-container">
              <h4>Configuración</h4>
              {data?.role !== "staff" &&
                data?.role !== "admin" &&
                data?.role !== "user" && (
                  <p>Modifica tus datos de ser necesario</p>
                )}
              {data?.role !== "super-admin" && data?.role !== "user" && (
                <p>Para cualquier cambio contacta a tu administrador</p>
              )}
            </div>
          </div>

          <UserFormComponent
            initialValues={initialValues}
            isDiscardVisible={false}
            isElementsVisible={showElements()}
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
            }}
            handleDiscard={() => {}}
          />
        </div>
      )}
    </>
  );
};
