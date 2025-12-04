import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EditorLayout } from './layouts/EditorLayout';
import { EditorPage } from './pages/EditorPage';
import { PreviewPage } from './pages/PreviewPage';
import { useScenePersistence } from './hooks/useScenePersistence';

function App() {
  useScenePersistence();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EditorLayout />}>
          <Route index element={<EditorPage />} />
        </Route>
        <Route path="/preview" element={<PreviewPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
