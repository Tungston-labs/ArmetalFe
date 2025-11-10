// src/hooks/useAdminLocationSocket.js

import { useEffect, useRef, useState } from "react";
// Import your token retrieval utility
import { getAccessToken } from './useAccessToken'; 

const useAdminLocationSocket = (employeeId) => {
  const socket = useRef(null);
  const [liveLocation, setLiveLocation] = useState(null); 

  useEffect(() => {
    if (!employeeId) return;


    const accessToken = getAccessToken();
    
    if (!accessToken) {
      console.error("Admin Access Token not found. Cannot connect WebSocket.");
      return;
    }
    
   
    const baseUrl = "ws://192.168.29.193:8001"; 
    const url = `${baseUrl}/ws/dashboard/location/${employeeId}/?token=${accessToken}`;
    
    // Establish the connection
    socket.current = new WebSocket(url);

    socket.current.onopen = () => {
      console.log(`✅ Live location socket connected for Employee ID: ${employeeId}`);
    };

    socket.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.latitude && data.longitude) {
          console.log("🧭 Received live location:", data);
          setLiveLocation(data); 
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

  return liveLocation;
};

export default useAdminLocationSocket;