import { useMediaQuery } from "react-responsive";

export const useResponsive = () => {
  //Querys chrome
  const isSamsungS8 = useMediaQuery({
    query:
      "(min-width: 360px) and (max-width: 374px) and (min-height: 740px) and (max-height: 900px)",
  });
  const isSmSE = useMediaQuery({
    query:
      "(min-width: 375px) and (max-width: 389px) and (min-height: 667px) and (max-height: 739px)",
  });

  const isIphone12Pro = useMediaQuery({
    query:
      "(min-width: 390px) and (max-width: 411px) and (min-height: 844px) and (max-height: 895px)",
  });
  const isPixel7 = useMediaQuery({
    query: "(min-width: 412px) and (max-width: 413px)",
  });
  const isS20Ultra = useMediaQuery({
    query:
      "(min-width: 412px) and (max-width: 413px) and (min-height: 915px) and (max-height: 931px)",
  });
  const isIphoneXR = useMediaQuery({
    query:
      "(min-width: 413px) and (max-width: 429px) and (min-height: 896px) and (max-height: 931px)",
  });
  const isIphonePMax = useMediaQuery({
    query:
      "(min-width: 430px) and (max-width: 767px) and (min-height: 932px) and (max-height: 1024px)",
  });

  const isIpadMini = useMediaQuery({
    query:
      "(min-width: 768px) and (max-width: 819px) and (min-height: 1024px) and (max-height: 1179px)",
  });

  const isIpadAir = useMediaQuery({
    query:
      "(min-width: 820px) and (max-width: 911px) and (min-height: 1180px) and (max-height: 1365px)",
  });

  const isIpadPro = useMediaQuery({
    query:
      "(min-width: 912px) and (max-width: 1024px) and (min-height: 1366px) and (max-height: 1368px)",
  });

  //Querys especificos

  const isSmLarge = useMediaQuery({
    query: "(min-width: 414px) and (max-width: 430px)",
  });
  const isSmIntermedate = useMediaQuery({
    query: "(min-width: 390px) and (max-width: 476px)",
  });

  //Laptop

  const isLaptop = useMediaQuery({
    query:
      "(min-height: 992px) and (max-height: 1024px) and (min-width: 992px) and (max-width: 1024px)",
  });
  //Querys estandar
  const isSm = useMediaQuery({ query: "(max-width: 576px)" });
  const isMd = useMediaQuery({ query: "(max-width: 768px)" });
  const isLg = useMediaQuery({ query: "(max-width: 992px)" });
  const isXL = useMediaQuery({ query: "(min-width: 1200px)" });
  const isXXL = useMediaQuery({ query: "(min-width: 1400px)" });
  const isUHD = useMediaQuery({ query: "(min-width: 1920px)`" });

  return {
    isSamsungS8,
    isIphone12Pro,
    isIphoneXR,
    isIphonePMax,
    isPixel7,
    isS20Ultra,
    isIpadMini,
    isIpadAir,
    isIpadPro,
    isSmSE,
    isSmLarge,
    isSmIntermedate,
    isSm,
    isMd,
    isLg,
    isXL,
    isXXL,
    isUHD,
    isLaptop,
  };
};
