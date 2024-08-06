# Okv-GeoPin

Okv-GeoPin is a geolocation-based application that allows users to pin locations on a map and share their location with other. This monorepo contains both the client and server code for the application.

![image](https://github.com/user-attachments/assets/e857811a-7de8-4a3e-b421-bcb50cb740d3)



## Features

- **Interactive Map**: Users can pin locations on the map.
- **Real-time Updates**: Connected users are updated in real-time.
- **Loader for Map**: Displays a loader while the map is loading.

## Tech Stack

- **Client**: TypeScript, JavaScript, CSS, Socket.io client
- **Server**: Node.js, Express, Socket.io
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js
- npm or yarn

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/onamkrverma/Okv-GeoPin.git
    ```
2. Navigate to the project directory:
    ```bash
    cd Okv-GeoPin
    ```
3. Install dependencies for both client and server:
    ```bash
    cd client
    npm install
    cd ../server
    npm install
    ```

### Running the Application

1. Start the client:
    ```bash
    cd client
    npm start
    ```
2. Start the server:
    ```bash
    cd server
    npm start
    ```

## Deployment

The application is deployed on Vercel. You can access it [here](https://okv-geopin.vercel.app/).

## Contributing

Feel free to open issues or submit pull requests. Contributions are welcome!
