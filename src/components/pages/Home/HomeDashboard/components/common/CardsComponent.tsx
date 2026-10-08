import type { CSSProperties } from "react";
import type { CardsComponentProps } from "../../../../../../types/home/dashboardTypes";
import {
  useisChatDashboardLoading,
  useisMessageDashboardLoading,
  useisStaffAdminLoading,
  useisStaffLoading,
} from "../../../../../../stores/loadersStore";
import { BeatLoader } from "react-spinners";

export const CardsComponent = ({
  data,
  dinamicHeightMobile,
  dinamicHeightDesktop,
}: CardsComponentProps) => {
  const { isLoading: isStaffLoading } = useisStaffLoading();
  const { isLoading: isMessageLoading } = useisMessageDashboardLoading();
  const { isLoading: isChatLoading } = useisChatDashboardLoading();
  const { isLoading: isStaffAdminLoading } = useisStaffAdminLoading();

  const isLoading =
    isStaffLoading || isMessageLoading || isChatLoading || isStaffAdminLoading;

  return (
    <section
      style={
        {
          "--dinamc-height-mobile": dinamicHeightMobile
            ? dinamicHeightMobile
            : "540px",
          "--dnamic-height": dinamicHeightDesktop
            ? dinamicHeightDesktop
            : "540px",
        } as CSSProperties
      }
      className="general-card-container"
    >
      {data.map((item, index) => {
        return (
          <div key={index} className="dashboard-card">
            {isLoading ? (
              <div className="loader-card">
                <BeatLoader size={8} color="#85b6ff" />
              </div>
            ) : (
              <>
                <div className="nav-card">
                  <h4>{item.title}</h4>
                  <img src={item.icon} alt={item.alt} />
                </div>
                <div
                  style={
                    {
                      "--dinamic-color": item.color ? item.color : "#3c83f6",
                    } as CSSProperties
                  }
                  className="body-card"
                >
                  <h2>{item.counter}</h2>
                  <p>{item.phrase}</p>
                </div>
              </>
            )}
          </div>
        );
      })}
    </section>
  );
};
