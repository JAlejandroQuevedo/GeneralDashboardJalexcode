import { useEffect, useMemo, useRef } from "react";
import type {
  TemplateComponent,
  TemplatePreviewWindowProps,
} from "../../../../../../../../../types/home/templateSectionTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type FieldErrors, type FieldValues } from "react-hook-form";
import z from "zod";
import { TemplateContainer } from "./components/TemplateContainer";
import { TemplateInputArea } from "./components/TemplateInputArea";

export const TemplatePreviewWindow = ({
  template,
  onSend,
}: TemplatePreviewWindowProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  // 1. Extraemos los componentes
  const headerComponent = template.components.find(
    (c: TemplateComponent) => c.type === "HEADER",
  );
  const bodyComponent = template.components.find(
    (c: TemplateComponent) => c.type === "BODY",
  );
  const buttonsComponent = template.components.find(
    (c: TemplateComponent) => c.type === "BUTTONS",
  );

  // 2. Extraemos todas las variables requeridas por esta plantilla
  const allVariables = useMemo(() => {
    return [
      ...(headerComponent?.variables || []),
      ...(bodyComponent?.variables || []),
    ];
  }, [template]);

  // 3. GENERAMOS EL ESQUEMA ZOD DINÁMICO
  const dynamicSchema = useMemo(() => {
    const schemaShape: Record<string, z.ZodTypeAny> = {};

    // Agregamos cada variable como un string obligatorio
    allVariables.forEach((varName) => {
      schemaShape[varName] = z
        .string()
        .min(1, `El campo ${varName} es obligatorio`);
    });

    // Si la plantilla requiere archivo, lo agregamos al esquema
    if (template.requiresFile) {
      schemaShape.file = z.any().refine((val) => val instanceof File, {
        message: "La imagen de cabecera es obligatoria",
      });
    }

    return z.object(schemaShape);
  }, [allVariables, template.requiresFile]);
  const dynamicDefaultValues = useMemo(() => {
    const defaults: Record<string, unknown> = {};
    allVariables.forEach((varName) => {
      defaults[varName] = ""; // Inicializamos como string vacío
    });
    if (template.requiresFile) {
      defaults.file = null;
    }
    return defaults;
  }, [allVariables, template.requiresFile]);
  // 4. Inicializamos React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(dynamicSchema),
    mode: "onChange",
    defaultValues: dynamicDefaultValues,
  });

  // Reseteamos el formulario cada vez que cambie la plantilla seleccionada
  useEffect(() => {
    reset(dynamicDefaultValues);
  }, [template, reset, dynamicDefaultValues]);

  // Observamos el archivo para la previsualización
  const selectedFile = watch("file") as File | undefined;
  const selectedFilePreview = useMemo(
    () => (selectedFile ? URL.createObjectURL(selectedFile) : ""),
    [selectedFile],
  );

  // 5. Manejador del submit final
  const onSubmit = (data: FieldValues) => {
    const { file, ...variables } = data;
    const normalizedVariables = Object.fromEntries(
      Object.entries(variables).map(([key, value]) => [key, String(value)]),
    ) as Record<string, string>;

    const selectedFile = file instanceof File ? file : null;

    const fileToSend = template.requiresFile ? selectedFile : null;

    onSend(template.endpoint, normalizedVariables, fileToSend);
  };

  const onInvalid = (errors: FieldErrors) => {
    console.warn("Zod bloqueó el envío por estos errores:", errors);
  };
  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className="messages-container "
      >
        {/* Template container body*/}
        <TemplateContainer
          headerComponent={headerComponent}
          bodyComponent={bodyComponent}
          buttonsComponent={buttonsComponent}
          fileInputRef={fileInputRef}
          selectedFile={selectedFile}
          selectedFilePreview={selectedFilePreview}
          template={template}
          register={register}
          watch={watch}
          setValue={setValue}
          errors={errors}
        />

        {/* Button area */}
        <TemplateInputArea isSubmitting={isSubmitting} />
      </form>
    </>
  );
};
