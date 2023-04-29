import './App.css';

import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { RouteManager } from './utils/routes'
import { Provider } from 'react-redux'
import { store } from './app/store'

const queryClient = new QueryClient()

function App() {
  return (
    <div>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <RouteManager/>
          </BrowserRouter>
          {/* <ReactQueryDevtools initialOpen={false}/> */}
        </QueryClientProvider>
      </Provider>
    </div>
  );
}

export default App;
