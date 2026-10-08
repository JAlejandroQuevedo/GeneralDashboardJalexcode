import { BeatLoader } from "react-spinners";
import {
  useisChatDashboardLoading,
  useisMessageDashboardLoading,
  useisStaffLoading,
} from "../../../../../../stores/loadersStore";
import type { ListComponentProps } from "../../../../../../types/home/dashboardTypes";
import type { CSSProperties } from "react";

export const ListCardsComponent = ({ data }: ListComponentProps) => {
  const { isLoading: isStaffLoading } = useisStaffLoading();
  const { isLoading: isMessageLoading } = useisMessageDashboardLoading();
  const { isLoading: isChatLoading } = useisChatDashboardLoading();
  const isLoading = isStaffLoading || isMessageLoading || isChatLoading;
  return (
    <section
      style={
        {
          "--dinamc-width-mobile": "650px",
        } as CSSProperties
      }
      className="general-card-container"
    >
      {data?.map((item, index) => {
        return (
          <div key={index} className="cards-assets">
            {isLoading ? (
              <div className="loader-card">
                <BeatLoader size={8} color="#85b6ff" />
              </div>
            ) : (
              <>
                <div className="nav-card">
                  <div className="nav-txt-btn">
                    <div className="nav-img-txt">
                      {item.type === "staff-list" ? (
                        <img
                          src="/img/icons/staff_icon_inactive.svg"
                          alt="Icono de Usuario"
                        />
                      ) : item.type === "active-policies" ? (
                        <img
                          src="/img/icons/logo_shield.svg"
                          alt="Icono del escudo de la empresa"
                        />
                      ) : (
                        <img
                          src="/img/icons/messages_icon_inactive.svg"
                          alt="Icono de mensajes"
                        />
                      )}

                      <h4>{item.title}</h4>
                    </div>
                    <p>{item.subtitle}</p>
                  </div>
                  <button onClick={item.btnVoid} className="btn-see-all">
                    {item.btnTxt}
                  </button>
                </div>
                <div className="cards-assets-list ">
                  {item.listDetailData.map((detail, detailIndex) => {
                    return (
                      <div key={detailIndex} className="list-element">
                        <div className="list-card">
                          <div className="img-container">
                            {item.type === "staff-list" ? (
                              <img
                                src="/img/icons/logo_shield.svg"
                                alt="Icono del escudo del logo"
                              />
                            ) : item.type === "active-policies" ? (
                              <img
                                src="/img/icons/logo_shield.svg"
                                alt="Icono del escudo de la empresa"
                              />
                            ) : (
                              <img
                                src="/img/icons/messages_icon.svg"
                                alt="Icono del escudo del logo"
                              />
                            )}
                          </div>

                          <div className="list-detail">
                            <h3>{detail.detailTitle}</h3>
                            <p>{detail.detailSubtitle}</p>
                          </div>
                        </div>
                        <div className="list-timer">
                          {item.type === "staff-list" ? (
                            <img
                              src="/img/icons/calenadar_icon.svg"
                              alt="Icono de calendario"
                            />
                          ) : (
                            <img
                              src="/img/icons/timer_icon.svg"
                              alt="Icono de reloj"
                            />
                          )}

                          <p>
                            {detail.date === "NaN/Invalid Date/NaN"
                              ? "Fecha no disponible"
                              : detail.date}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        );
      })}
    </section>
  );
};
