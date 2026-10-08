import type { StaffProfileType } from "../../../../../../types/home/dashboardTypes";

export const ProfileUser = ({ name, photo }: StaffProfileType) => {
  return (
    <div className="staff-info">
      <div className="staff-photo">
        <img src={photo} alt={`${name}'s profile`} />
      </div>
      <div className="staff-data">
        <h3>{name}</h3>
        {/* <p>{`dni: ${"Putito"}`}</p> */}
      </div>
    </div>
  );
};
