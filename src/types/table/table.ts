import type { ReactNode } from "react";

export type TableProps = {
  headers: string[];
  data: Record<string, ReactNode>[];
  width?: string;
  height?: string;
};
