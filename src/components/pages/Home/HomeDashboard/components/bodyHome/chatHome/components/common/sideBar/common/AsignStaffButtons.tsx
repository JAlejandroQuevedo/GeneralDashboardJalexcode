import type { StaffSelectionMenuProps } from "../../../../../../../../../../../types/home/chatSectionTypes";

export const AsignStaffButtons = ({
  staffData,
  handleAssignToStaff,
  onBack,
  staffId,
}: StaffSelectionMenuProps) => {
  return (
    <>
      <button className="back-btn" onClick={onBack}>
        ◂ Volver
      </button>

      {staffData.map((staff) => {
        const isAssgnedToStaff = staffId === staff.id;
        return (
          <button
            style={isAssgnedToStaff ? { color: "#85b6ff" } : {}}
            key={staff.id}
            onClick={(e) => handleAssignToStaff(e, staff.id)}
          >
            {staff.name}
          </button>
        );
      })}
    </>
  );
};
