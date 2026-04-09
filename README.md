# PA6C Parking Robot Soft Remote Control

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.0-blue.svg)](https://reactjs.org/)
[![Electron](https://img.shields.io/badge/Electron-41.2-blue.svg)](https://www.electronjs.org/)

A professional, cross-platform remote control application designed for the PA6C parking robot. Built with React and Electron, providing a low-latency WebSocket interface for precise robot maneuvering.

![App Preview](https://picsum.photos/seed/robot-remote/800/450)

## 🚀 Features

-   **Dual-Language Support**: Seamlessly switch between Chinese and English.
-   **Precision Control**: Dual virtual joysticks for movement (Y-axis) and rotation (X-axis).
-   **Real-time Feedback**: Live connection status, battery levels, and robot process steps.
-   **Safety First**:
    -   Emergency Stop slider with confirmation.
    -   Operational constraints for mechanical arms (Front must open before Rear; Rear must close before Front).
    -   Obstacle avoidance toggle and system power management.
-   **Debug Mode**: Advanced controls for machine selection (Master/Slave/Dual) and manual arm overrides.
-   **Cross-Platform**: Packaged as a desktop application for Windows and macOS via Electron.

## 🛠 Tech Stack

-   **Frontend**: React 19, TypeScript, Tailwind CSS
-   **Animations**: Motion (formerly Framer Motion)
-   **Icons**: Lucide React
-   **Desktop Wrapper**: Electron
-   **Communication**: WebSocket (ws)
-   **Build Tool**: Vite

## 📦 Installation & Setup

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or higher recommended)
-   npm (comes with Node.js)

### Development

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/pa6c-remote.git
    cd pa6c-remote
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

4.  Run Electron in development mode:
    ```bash
    npm run electron:dev
    ```

### Building for Production

To generate a standalone executable:

-   **Windows (.exe)**:
    ```bash
    npm run build:exe
    ```
-   **macOS (.app)**:
    ```bash
    npm run build:mac
    ```

### Building for Android (APK)

1.  Install [Android Studio](https://developer.android.com/studio).
2.  Sync the project:
    ```bash
    npm run android:sync
    ```
3.  Open in Android Studio:
    ```bash
    npm run android:open
    ```
4.  In Android Studio, go to **Build > Build Bundle(s) / APK(s) > Build APK(s)**.

The output will be located in the `release/` directory for desktop, or inside the Android Studio build folder for APKs.

## 🔌 WebSocket API

The app communicates with the robot using JSON messages over WebSocket.

### Outgoing Commands
```json
{ "type": "joystick", "move": 0.5, "turn": -0.2 }
{ "type": "speed_gear", "gear": "high" }
{ "type": "debug_front_arm", "state": true }
```

### Incoming Status
```json
{
  "type": "status",
  "battery": 85,
  "status": "entering",
  "gear": "mid",
  "process_step": "Aligning"
}
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
Developed for high-performance robot teleoperation.
