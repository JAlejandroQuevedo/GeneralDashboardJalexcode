import { Check, CheckCheck, Clock, AlertCircle } from "lucide-react";
import type { MessageStatusIconProps } from "../../../../../../../../../../../types";

// Función auxiliar para renderizar el ícono correcto
export const MessageStatusIcon = ({
  status,
  color = "#667781",
  colorCheckRead = "#00C0F0",
}: MessageStatusIconProps) => {
  switch (status) {
    case "pending":
      return <Clock size={14} color={color} />;
    case "sent":
      return <Check size={16} color={color} />;
    case "delivered":
      return <CheckCheck size={16} color={color} />;
    case "read":
      return <CheckCheck size={16} color={colorCheckRead} />;
    case "failed":
      return <AlertCircle size={14} color="#f15c6d" />;
    default:
      return null;
  }
};
