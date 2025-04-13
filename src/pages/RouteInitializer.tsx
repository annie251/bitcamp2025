import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RouteInitializer = () => {
  const navigate = useNavigate();

  useEffect(() => {
    chrome.storage.local.get("currentPage", (result) => {
      navigate("/" + (result.currentPage || ""));
    });
  }, []);

  return null;
};

export default RouteInitializer;