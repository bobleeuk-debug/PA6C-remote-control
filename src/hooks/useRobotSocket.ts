import { useState, useEffect, useRef, useCallback } from 'react';
import { RobotState, RobotMessage, JoystickData, Gear } from '../types';

export function useRobotSocket() {
  const [url, setUrl] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [robotState, setRobotState] = useState<RobotState>({
    battery: 0,
    status: 'idle',
    gear: 'mid',
    process_step: ''
  });
  const [lastAlarm, setLastAlarm] = useState<string | null>(null);
  
  const socketRef = useRef<WebSocket | null>(null);
  const joystickRef = useRef<JoystickData>({ move: 0, turn: 0 });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback((newUrl: string) => {
    if (socketRef.current) {
      socketRef.current.close();
    }
    
    setUrl(newUrl);
    setIsConnecting(true);
    
    // Connection timeout: 5 seconds
    const timeout = setTimeout(() => {
      if (socketRef.current?.readyState !== WebSocket.OPEN) {
        console.error('Connection timed out');
        setIsConnecting(false);
        if (socketRef.current) socketRef.current.close();
      }
    }, 5000);

    const ws = new WebSocket(newUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      clearTimeout(timeout);
      setIsConnected(true);
      setIsConnecting(false);
      console.log('Connected to robot:', newUrl);
    };

    ws.onmessage = (event) => {
      try {
        const data: RobotMessage = JSON.parse(event.data);
        if (data.type === 'status') {
          setRobotState({
            battery: data.battery,
            status: data.status,
            gear: data.gear,
            process_step: data.process_step
          });
        } else if (data.type === 'alarm') {
          setLastAlarm(data.message);
          setTimeout(() => setLastAlarm(null), 5000);
        } else if (data.type === 'process_done') {
          // Handled by robotState.process_step usually
        }
      } catch (e) {
        console.error('Failed to parse robot message', e);
      }
    };

    ws.onclose = () => {
      clearTimeout(timeout);
      setIsConnected(false);
      setIsConnecting(false);
      console.log('Disconnected from robot');
    };

    ws.onerror = (err) => {
      clearTimeout(timeout);
      console.error('WebSocket error:', err);
      setIsConnected(false);
      setIsConnecting(false);
    };
  }, []);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
    }
  }, []);

  const sendCommand = useCallback((type: string, payload: any = {}) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type,
        ts: Date.now(),
        ...payload
      }));
    }
  }, []);

  const updateJoystick = useCallback((data: Partial<JoystickData>) => {
    joystickRef.current = { ...joystickRef.current, ...data };
  }, []);

  // Joystick heartbeat: 50ms
  useEffect(() => {
    let lastSentWasZero = true;
    
    if (isConnected) {
      intervalRef.current = setInterval(() => {
        const isZero = joystickRef.current.move === 0 && joystickRef.current.turn === 0;
        
        if (!isZero || !lastSentWasZero) {
          sendCommand('joystick', {
            move: joystickRef.current.move,
            turn: joystickRef.current.turn
          });
          lastSentWasZero = isZero;
        }
      }, 50);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isConnected, sendCommand]);

  return {
    isConnected,
    isConnecting,
    robotState,
    lastAlarm,
    connect,
    disconnect,
    sendCommand,
    updateJoystick,
    url
  };
}
