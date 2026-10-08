import { useResponsive } from "../../../../../../../../../../../../../constants/reactResponsive";
import { useShowPopupCreateChat } from "../../../../../../../../../../../../../stores/homeStore";
import { Popup } from "../../../../../../../../../../../../common/inputs/popup/Popup";
import { HeaderCreateChat } from "./components/HeaderCreateChat";
import { FooterCreateChat } from "./components/FooterCreateChat";
import { useForm } from "react-hook-form";
import {
  chatSchema,
  type ChatFormType,
} from "../../../../../../../../../../../../../types/form/formChat";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApiToken } from "../../../../../../../../../../../../../hooks/useApiToken";
import { config } from "../../../../../../../../../../../../../config/config";
import { useState } from "react";
import { FormCreateChat } from "./components/FormCreateChat";
import { ErrorCreateChat } from "./components/ErrorCreateChat";

export const PopupCreateChat = () => {
  //Store que determina si el popup es visible o no
  const { isPopupVisible, setisPopupVisible } = useShowPopupCreateChat();

  //State que guarda el error que proviene de la api

  const [error, setError] = useState<string>("");

  //Booleano que guarda el responsive del componente

  const { isSm } = useResponsive();

  //Hook que guarda la llamada a la api

  const { postApiToken } = useApiToken();

  //Hook del manejo de formulario

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChatFormType>({
    resolver: zodResolver(chatSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      countryCode: "",
    },
  });

  //Funcion para manejar el envio del formulario
  const onSubmit = async (data: ChatFormType) => {
    //Union del numero de telefono y la lada segun lo solicitado

    const phoneNumber = `${data.countryCode}${data.phoneNumber}`;

    //Se hace un reset del error
    setError("");

    //Se obtiene el token
    const token = config.BEARER_TOKEN;

    //Variable que guarda el payload
    const payload = {
      phoneNumber: phoneNumber,
      contactName: data.name,
    };

    //Llamada a la api para crear el chat en la base de datos
    const newChat = await postApiToken({
      url: "create-chat",
      token: token,
      responseKey: "response",
      body: payload,
    });
    if (!newChat.success) {
      //Se almacena el error
      setError(newChat.error);
    } else {
      //Almacenamiento del payload para enviar el mensaje automatico
      const welcomePayload = {
        petName: "Sammy",
        phone: phoneNumber,
      };
      //Llamada a la api con el payload
      await postApiToken({
        url: "send-whatsapp-template-welcome-system",
        token: token,
        body: welcomePayload,
      });
      //Resets
      setError("");
      reset();
      setisPopupVisible(false);
    }
  };
  return (
    <Popup
      isOpen={isPopupVisible}
      onClose={() => {
        setisPopupVisible(false);
      }}
      width={isSm ? "95%" : "800px"}
      height={isSm ? "80dvh" : "77.5dvh"}
    >
      <section>
        <div className="create-chat-form-container">
          <HeaderCreateChat />
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormCreateChat
            control={control}
            errors={errors}
            register={register}
          />
          <ErrorCreateChat error={error} />

          <FooterCreateChat isSubmitting={isSubmitting} />
        </form>
      </section>
    </Popup>
  );
};
