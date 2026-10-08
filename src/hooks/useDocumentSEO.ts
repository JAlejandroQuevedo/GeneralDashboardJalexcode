import { useEffect } from "react";

type SEOData = {
  title: string;
  description?: string;
};
const useDocumentSEO = ({ title, description }: SEOData) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;
    let metaTag = document.querySelector('meta[name="description"]');

    if (!metaTag) {
      metaTag = document.createElement("meta");
      metaTag.setAttribute("name", "description");
      document.head.appendChild(metaTag);
    }
    const prevDescription = metaTag.getAttribute("content") || "";
    if (description) {
      metaTag.setAttribute("content", description);
    }

    return () => {
      document.title = prevTitle;
      metaTag.setAttribute("content", prevDescription);
    };
  }, [title, description]);
};

export default useDocumentSEO;
