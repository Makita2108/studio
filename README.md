# AquaControl IoT

This is a Next.js application for monitoring and controlling an automated greenhouse system.

## Getting Started

To get started with the application, you can use the following credentials for login:

-   **Username:** `admin`
-   **Password:** `admin`

## Simulated Sensor

This application includes a simulated sensor that allows you to test the general watering functionality without the need for physical hardware.

### How to Use the Simulated Sensor

1.  **Open Developer Tools:** In your browser, right-click anywhere on the page and select "Inspect." This will open a panel, usually on the right or bottom of the screen.

2.  **Go to the "Console" Tab:** Within the developer tools, find and click on the tab that says "Console."

3.  **Call the Watering Function:** In the console, type the following command and press `Enter`:

    ```javascript
    window.triggerGlobalWatering()
    ```

That's it! By running this command, you will see the application react in the same way as if you had pressed the "Activate General Watering" button. All plants will start watering simultaneously.

This is a very effective way to simulate any external event you want to integrate in the future, such as a signal from a physical sensor or a call from another system.
