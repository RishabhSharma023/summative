import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from './Contexts';
import AppRoutes from './AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <AppRoutes />
      </StoreProvider>
    </BrowserRouter>
  )
}

export default App;