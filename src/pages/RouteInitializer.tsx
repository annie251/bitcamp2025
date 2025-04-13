import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const RouteInitializer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    chrome.storage.local.get("currentPage", (result) => {
      const target = "/" + (result.currentPage || "");
      console.log("Route Initializer Target: " + target);
      if (location.pathname !== target) {
        navigate(target);
      }
    });
  }, []);

  return null;
};

export default RouteInitializer;
