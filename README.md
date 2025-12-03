# Trident OBS Overlay Builder

A powerful, user-friendly web application for creating, customizing, and managing OBS (Open Broadcaster Software) overlays directly from your browser. Designed for streamers who need professional-looking overlays without coding.

## 🚀 Features

*   **Visual Editor**: Drag-and-drop canvas to arrange components with ease.
*   **Real-time Preview**: See changes instantly as you edit.
*   **Auto-scaling Canvas**: The editor view automatically adjusts to fit your screen while maintaining a broadcast-standard 1920x1080 aspect ratio.
*   **Components**:
    *   **Marquee Ticker**: Infinite scrolling text for disclaimers, news, or shoutouts.
    *   **Weekly Journal**: An editable table to track profits, schedules, or stats with automatic totals.
    *   **Media Support**: Drag and drop images or videos directly onto the canvas, or use URLs.
*   **Customization**:
    *   **Theming**: Choose from built-in themes (Dark Modern, Neon Cyber, Clean Light) or customize colors.
    *   **Typography**: Select fonts per component.
    *   **Layering**: Easily reorder elements (Bring to Front, Send Backward, etc.).
*   **Persistence**: Your layout is automatically saved to your browser. You can also **Export** and **Import** configurations as JSON files for backup or sharing.
*   **OBS Integration**: Generates a clean, transparent URL specifically for OBS Browser Sources.

## 🛠️ Tech Stack

*   **React 19**: UI Library
*   **Vite**: Build tool and dev server
*   **TypeScript**: Type safety
*   **Tailwind CSS v4**: Styling
*   **Zustand**: State management (with persistence)
*   **React RND**: Resizable and draggable components
*   **Framer Motion**: Animations

## 📦 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd trident-obs-overlay
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:5173` (or the next available port).

## 🖥️ Usage Guide

### 1. Creating Your Overlay
1.  Open the application in your browser.
2.  Use the **Add Widget** dropdown in the top bar to add components (Marquee, Journal, Media).
3.  **Drag** components to position them.
4.  **Resize** components by dragging their corners or edges.
5.  **Select** a component to edit its properties in the right-hand Inspector panel:
    *   Change text, colors, fonts, and speed.
    *   Upload media or paste URLs.
    *   Adjust layer order (z-index).

### 2. Using with OBS
1.  Once your overlay is ready, click the **Open Preview** button in the Inspector.
2.  Copy the URL of the opened tab (e.g., `http://localhost:5173/preview`).
3.  Open **OBS Studio**.
4.  Add a new **Browser Source** to your scene.
5.  Paste the copied URL into the URL field.
6.  Set **Width** to `1920` and **Height** to `1080`.
7.  The overlay will appear transparently over your stream content.

## 📜 Available Scripts

*   `npm run dev`: Starts the development server.
*   `npm run build`: Compiles the application for production.
*   `npm run preview`: Locally preview the production build.
*   `npm run lint`: Runs ESLint to check for code quality issues.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
