import { useState } from "react";
import { SearchContainer } from "../../../chatHome/components/common/search/SearchContainer";
import type {
  TemplateSideBarProps,
  TemplateType,
} from "../../../../../../../../../types/home/templateSectionTypes";
import { getInitials } from "../../../../../../../../../functions/helpersChat";

export const TemplateSideBar = ({
  templates,
  onSelect,
  activeTemplateId,
}: TemplateSideBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTemplates = templates.filter((tpl: any) =>
    tpl.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <aside className="sidebar">
      <SearchContainer
        isTemplateScreen={true}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <div className="chat-list">
        {filteredTemplates.map((tpl: TemplateType) => (
          <div
            key={tpl.id}
            className={`chat-item ${activeTemplateId === tpl.id ? "active" : ""}`}
            onClick={() => onSelect(tpl)}
          >
            <div className="avatar">{getInitials(tpl.name)}</div>
            <div className="chat-content">
              <div className="chat-header">
                <div className="name-container">
                  <span className="chat-name">{tpl.name}</span>
                </div>
                <div className="header-actions">
                  <span className="time">{tpl.language}</span>
                </div>
              </div>

              <div className="chat-last-message">
                <div className="message-preview">
                  <span className="text">{tpl.category}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};
