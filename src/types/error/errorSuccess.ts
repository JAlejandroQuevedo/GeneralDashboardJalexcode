type ShowFeedbackProps = {
  title: string;
  message: string;
  width?: string;
  height?: string;
  margin?: string;
};

export type ShowErrorProps = ShowFeedbackProps & {
  linkMessage?: string;
  linkRoute?: string;
  showLink?: boolean;
};

export type ShowSuccessProps = ShowFeedbackProps;
