import type { MessageType } from "../types/home/chatSectionTypes";
import type {
  UserDataType,
  UseMessagesProps,
  PoliciesType,
} from "../types/home/dashboardTypes";

export const useCounters = () => {
  const getMessages = ({ dataChats, dataMessages }: UseMessagesProps) => {
    const chats = dataChats || [];
    const messages = dataMessages || [];

    const latestMessagesRecord: Record<string, MessageType> = {};

    messages.forEach((msg) => {
      const existingMsg = latestMessagesRecord[msg.chat_id];

      if (!existingMsg) {
        latestMessagesRecord[msg.chat_id] = msg;
      } else {
        const existingDate = new Date(existingMsg.created_at).getTime();
        const newDate = new Date(msg.created_at).getTime();

        if (newDate > existingDate) {
          latestMessagesRecord[msg.chat_id] = msg;
        }
      }
    });

    const chatsWithLatestData = chats.map((chat) => {
      const latestMessage = latestMessagesRecord[chat.id];

      return {
        ...chat,
        lastMessageText: latestMessage ? latestMessage.text : "Sin mensajes",
        lastMessageTime: latestMessage ? latestMessage.created_at : null,
        latestMessageObject: latestMessage || null,
      };
    });

    const sortedAndFilteredChats = chatsWithLatestData.sort((a, b) => {
      const timeA = a.lastMessageTime
        ? new Date(a.lastMessageTime).getTime()
        : 0;
      const timeB = b.lastMessageTime
        ? new Date(b.lastMessageTime).getTime()
        : 0;
      return timeB - timeA;
    });

    return sortedAndFilteredChats;
  };

  const getCountersStaff = (data: UserDataType[] | []) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // Devuelve de 0 (Enero) a 11 (Diciembre)
    const currentYear = currentDate.getFullYear(); // Ej: 2026

    // 3. Filtramos el staff que ingresó en este mes y año
    const staffJoinedThisMonth = data.filter((staff) => {
      if (!staff.created_at) return false; // Por si algún registro no tiene fecha

      const joinDate = new Date(staff.created_at);

      return (
        joinDate.getMonth() === currentMonth &&
        joinDate.getFullYear() === currentYear
      );
    });

    // 4. Obtenemos el total (tu contador)
    const newStaffCountThisMonth = staffJoinedThisMonth.length;
    return newStaffCountThisMonth;
  };

  const getCountersPolicies = (data: PoliciesType[] | []) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // Devuelve de 0 (Enero) a 11 (Diciembre)
    const currentYear = currentDate.getFullYear(); // Ej: 2026

    // 3. Filtramos el staff que ingresó en este mes y año
    const policiesJoinedThisMonth = data.filter((policie) => {
      if (!policie.created_at) return false; // Por si algún registro no tiene fecha

      const joinDate = new Date(policie.created_at);

      return (
        joinDate.getMonth() === currentMonth &&
        joinDate.getFullYear() === currentYear
      );
    });

    // 4. Obtenemos el total (tu contador)
    const newStaffCountThisMonth = policiesJoinedThisMonth.length;
    return newStaffCountThisMonth;
  };

  return { getMessages, getCountersStaff, getCountersPolicies };
};
