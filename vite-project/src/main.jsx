import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import store from './redux/store';
import { ContextProvider } from './Pages/SocketContext';

const persistor = persistStore(store);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ContextProvider>
        <App />
        </ContextProvider>
        
      </PersistGate>
    </Provider>
  </StrictMode>
);
