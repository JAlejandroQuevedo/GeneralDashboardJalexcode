import type { PolicyProfileType } from "../../../../../../types/home/dashboardTypes";

export const ProfileUserPolicy = ({
  name,
  photo,
  policyNumber,
}: PolicyProfileType) => {
  return (
    <div className="staff-info">
      <div className="staff-photo">
        <img src={photo} alt={`${name}'s profile`} />
      </div>
      <div className="staff-data">
        <h3>{name}</h3>
        <p>{`Número de póliza: ${policyNumber}`}</p>
      </div>
    </div>
  );
};
