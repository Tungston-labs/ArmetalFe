import { useEffect, useRef, useState } from "react";
import { getAccessToken } from './useAccessToken'; 

const useAdminLocationSocket = (employeeId) => {
  const socket = useRef(null);
  const [liveLocations, setLiveLocations] = useState([]); // array instead of single object

  useEffect(() => {
    if (!employeeId) return;

    const accessToken = getAccessToken();
    if (!accessToken) {
      console.error("Admin Access Token not found. Cannot connect WebSocket.");
      return;
    }

    const baseUrl = "ws://192.168.29.193:8001"; 
    const url = `${baseUrl}/ws/dashboard/location/${employeeId}/?token=${accessToken}`;
    
    socket.current = new WebSocket(url);

    socket.current.onopen = () => {
      console.log(`✅ Live location socket connected for Employee ID: ${employeeId}`);
    };

    socket.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.latitude && data.longitude && data.location_name) {
          console.log("🧭 Received live location:", data);

          // Append new location at top (latest first)
          setLiveLocations(prev => [
            {
              ...data,
              timestamp: data.timestamp || new Date().toISOString()
            },
            ...prev
          ]);
        } else {
          console.warn("Received incomplete location data:", data);
        }

      } catch (e) {
        console.error("Error parsing WebSocket message:", e);
      }
    };

    socket.current.onclose = () => {
      console.log(`🔌 Live location socket closed for Employee ID: ${employeeId}`);
    };

    socket.current.onerror = (e) => {
      console.error("⚠️ WebSocket error:", e.message);
    };

    return () => {
      if (
        socket.current?.readyState === WebSocket.OPEN ||
        socket.current?.readyState === WebSocket.CONNECTING
      ) {
        socket.current.close();
      }
    };
  }, [employeeId]);

  return liveLocations; // now returning an array
};

export default useAdminLocationSocket;
