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
    *   **Theme Editor**: Fine-tune individual theme colors (text, accent, borders, etc.) directly in the inspector.
    *   **Typography**: Select fonts per component.
    *   **Layering**: Easily reorder elements (Bring to Front, Send Backward, etc.).
*   **System Persistence**: The app automatically syncs your scene to a local `scene.json` file when running the dev server. This allows you to open the editor in any browser (Chrome, Firefox, OBS) and see the same state instantly.
*   **OBS Integration**: Generates a clean, transparent URL specifically for OBS Browser Sources.

## 🛠️ Tech Stack

*   **React 19**: UI Library
*   **Vite**: Build tool and dev server (with custom middleware for file persistence)
*   **TypeScript**: Type safety
*   **Tailwind CSS v4**: Styling
*   **Zustand**: State management
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
    The app will be available at `http://localhost:5173`. A `scene.json` file will be created in the project root to store your layout.

## 🖥️ Usage Guide

### 1. Creating Your Overlay
1.  Open the application in your browser.
2.  Use the **Add Widget** dropdown in the top bar to add components (Marquee, Journal, Media).
3.  **Drag** components to position them.
4.  **Resize** components by dragging their corners or edges.
5.  **Select** a component to edit its properties in the right-hand Inspector panel.
6.  **Customize Theme**: Click "Edit Colors" in the Theme panel to tweak specific colors for the active theme.

### 2. Using with OBS
1.  Once your overlay is ready, click the **Open Preview** button (or copy the URL).
2.  The URL will be `http://localhost:5173/preview`.
3.  Open **OBS Studio**.
4.  Add a new **Browser Source** to your scene.
5.  Paste the URL into the URL field.
6.  Set **Width** to `1920` and **Height** to `1080`.
7.  The overlay will appear transparently over your stream content.
8.  **Persistence**: Since the app now syncs to `scene.json` via the dev server, **OBS will automatically load the latest scene** without needing shared browser storage. Just make sure `npm run dev` is running.

## 📜 Available Scripts

*   `npm run dev`: Starts the development server with persistence middleware.
*   `npm run build`: Compiles the application for production.
*   `npm run preview`: Locally preview the production build.
*   `npm run lint`: Runs ESLint to check for code quality issues.
*   `npm run type-check`: Runs TypeScript compiler check.

## 🏗️ Architecture

### State Management
We use **Zustand** for state management. The store is split into slices (Canvas, Components, Theme) to maintain maintainability. State is persisted to a local `scene.json` file via a custom Zustand storage adapter that communicates with a Vite middleware endpoint (`/api/scene`).

### Theme System
Themes are pluggable definitions located in `src/themes`. A theme defines a color palette, font family, and optional wrapper components or animation overrides. The store now supports runtime overrides for theme colors.

### Component Factory
New overlay components are created via a Factory pattern (`src/state/factories`) to ensure consistent initialization of props and IDs.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
