import type { TemplateType } from "../../../../../../../../types/home/templateSectionTypes";

export const STATIC_TEMPLATES: TemplateType[] = [
  {
    id: "general_reminder_pet",
    name: "Recordatorio General de Mascota",
    endpoint: "/reminder-pet",
    category: "Utilidad",
    requiresFile: false,
    language: "ES",
    components: [
      {
        type: "HEADER",
        format: "TEXT",
        text: "Recordatorio",
      },
      {
        type: "BODY",
        text: "¡Hola!\n\nEsto es un recordatorio para informarte que te estamos esperando para que recojas a tu mascota.\n\nHaciendo énfasis, en que nuestro horario es de {{time}} y que nuestro servicio de guardería tiene un costo de {{cost}} pesos por {{range}}.\n\nSi tuviste algún inconveniente o necesitas el servicio de guardería, por favor, no olvides hacérnoslo saber.",
        // Claves exactas que espera tu req.body
        variables: ["time", "cost", "range"],
        placeholders: {
          time: "8:00 am - 6:00pm",
          cost: "200",
          range: "día",
        },
      },
      {
        type: "BUTTONS",
        buttons: [
          { text: "Voy en camino" },
          { text: "No podre pasar por el hoy" },
        ],
      },
    ],
  },
  {
    id: "pets_time_change",
    name: "Adelantamos tu cita",
    endpoint: "/pets-time-change",
    category: "Utilidad",
    requiresFile: false,
    language: "ES",
    components: [
      {
        type: "HEADER",
        format: "TEXT",
        text: "¡Hemos adelantado tu cita!",
      },
      {
        type: "BODY",
        text: "Hola, Este es un mensaje automático para comentarte que adelantamos la atención para tu mascota a las {{time}}, esperaremos una confirmación de tu visita para agendarla en nuestro sistema.",
        variables: ["time"],
        placeholders: { time: "10:00 am" },
      },
      {
        type: "BUTTONS",
        buttons: [{ text: "Confirmar agenda" }],
      },
    ],
  },
  {
    id: "pets_reminder",
    name: "Recordatorio Mascota",
    endpoint: "/pets-reminder",
    requiresFile: false,
    category: "Utilidad",
    language: "ES",
    components: [
      {
        type: "HEADER",
        format: "TEXT",
        text: "¡Ya puedes pasar por {{petName}}!",
        variables: ["petName"],
        placeholders: { petName: "Sammy" },
      },
      {
        type: "BODY",
        text: "Hola {{ownerName}}, este es un mensaje para comentarte que tu mascota ¡está lista!\n\nPuedes pasar por ella. ¡Te estaremos esperando!",
        variables: ["ownerName"],
        placeholders: { ownerName: "Jesus" },
      },
      {
        type: "BUTTONS",
        buttons: [{ text: "Voy en camino" }],
      },
    ],
  },
  {
    id: "welcome_ws_system",
    name: "Bienvenido Sistema",
    endpoint: "/welcome-system",
    category: "Marketing",
    requiresFile: false,
    language: "ES",
    components: [
      {
        type: "HEADER",
        format: "IMAGE",
        url: "https://res.cloudinary.com/dcgup4dzv/image/upload/v1781564888/large_logo_mzvkpm.png",
      },
      {
        type: "BODY",
        text: "¡Bienvenido!, es un placer contar con tu preferencia; mediante este medio, puedes establecer un enlace directo con nosotros.\n\nSerá un placer atenderte.",
      },
    ],
  },
  {
    id: "welcome_pet",
    name: "Bienvenida Mascota",
    endpoint: "/welcome-pet",
    requiresFile: false,
    category: "Marketing",
    language: "ES",
    components: [
      {
        type: "HEADER",
        format: "IMAGE",
        url: "https://res.cloudinary.com/dcgup4dzv/image/upload/v1781564888/large_logo_mzvkpm.png",
      },
      {
        type: "BODY",
        text: "¡Bienvenido!, es un placer contar con tu preferencia; será un placer atender a {{petName}}, cualquier duda o pregunta, puedes hacerlo desde este chat.\n\nSerá un placer atenderte.",
        variables: ["petName"],
        placeholders: { petName: "Sammy" },
      },
    ],
  },
  {
    id: "coffee_template",
    name: "Aviso Café",
    endpoint: "/coffee-template",
    requiresFile: true,
    category: "Utilidad",
    language: "ES",
    components: [
      {
        type: "HEADER",
        format: "IMAGE",
        url: "FILE_UPLOAD_PLACEHOLDER",
      },
      {
        type: "BODY",
        text: "¡Tu {{product}} va en camino!\n\n Por favor, prepárate para recibirlo, recuerda que nuestro repartidor se pondrá en contacto contigo cuando llegue a tu domicilio.",
        variables: ["product"],
        placeholders: { product: "Frappuccino Moka" },
      },
      {
        type: "BUTTONS",
        buttons: [{ text: "¡Enterad@!" }],
      },
    ],
  },
];
