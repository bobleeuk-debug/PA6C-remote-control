export type Gear = 'low' | 'mid' | 'high';
export type RobotStatus = 'idle' | 'running' | 'entering' | 'exiting' | 'fault' | 'stopped';

export interface RobotState {
  battery: number;
  status: RobotStatus;
  gear: Gear;
  process_step: string;
}

export interface AlarmMessage {
  type: 'alarm';
  message: string;
}

export interface ProcessDoneMessage {
  type: 'process_done';
}

export type RobotMessage = 
  | ({ type: 'status' } & RobotState)
  | AlarmMessage
  | ProcessDoneMessage;

export interface JoystickData {
  move: number; // -1.0 to 1.0
  turn: number; // -1.0 to 1.0
}
