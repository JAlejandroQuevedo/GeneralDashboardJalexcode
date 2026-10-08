export type GeneratePasswordButtonProps = {
  handlePasswordAction: () => void;
  passwordButtonState: string;
};
export const GeneratePasswordButton = ({
  handlePasswordAction,
  passwordButtonState,
}: GeneratePasswordButtonProps) => {
  return (
    <button
      className="btn-generate-password"
      onClick={handlePasswordAction}
      type="button"
    >
      {passwordButtonState}
    </button>
  );
};
