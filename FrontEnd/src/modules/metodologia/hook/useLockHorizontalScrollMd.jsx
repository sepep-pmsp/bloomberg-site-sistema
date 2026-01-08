import { useEffect } from "react";

function useLockHorizontalScrollMd() {
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const lock = () => {
      document.documentElement.style.overflowX = "hidden";
      document.body.style.overflowX = "hidden";
    };

    const unlock = () => {
      document.documentElement.style.overflowX = "";
      document.body.style.overflowX = "";
    };

    if (mediaQuery.matches) lock();

    mediaQuery.addEventListener("change", e => {
      if (e.matches) lock();
      else unlock();
    });

    return () => unlock();
  }, []);
}
export default useLockHorizontalScrollMd;