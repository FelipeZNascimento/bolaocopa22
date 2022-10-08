import React from 'react';
import ReactDOM from 'react-dom/client';
import { DataController, ErrorToast, Navbar, Startup } from 'components/index';
import {
  Bets,
  Extras,
  ForgotPassword,
  Home,
  Ranking,
  Results,
  Teams
} from 'sections/index';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Redux imports
import { Provider } from 'react-redux';
import store from './store/index';

import ROUTES from 'constants/routes';
import './index.scss';
import 'typeface-roboto';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Startup>
          <DataController />
          <Navbar />
          <Routes>
            <Route path={`${ROUTES.HOME.url}/*`} element={<Home />} />
            <Route path={`${ROUTES.RESULTS.url}/*`} element={<Results />} />
            <Route path={`${ROUTES.BETS.url}/*`} element={<Bets />} />
            <Route path={`${ROUTES.RANKING.url}/*`} element={<Ranking />} />
            <Route path={`${ROUTES.EXTRAS.url}/*`} element={<Extras />} />
            <Route path={`${ROUTES.TEAMS.url}/`} element={<Teams />} />
            <Route path={`${ROUTES.TEAMS.url}/:teamId`} element={<Teams />} />
            <Route
              path={`${ROUTES.FORGOT_PASSWORD.url}/:token/:email`}
              element={<ForgotPassword />}
            />
            <Route path={'/'} element={<Home />} />
            <Route path={'*'} element={<Home />} />
            {/* '*' path goes for 404 errors on the page */}
          </Routes>
          <ErrorToast />
        </Startup>
      </Router>
    </Provider>
  </React.StrictMode>
);

serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    const waitingServiceWorker = registration.waiting;
    if (waitingServiceWorker) {
      waitingServiceWorker.addEventListener('statechange', (event) => {
        const target = event.target as any;
        if (target.state && target.state === 'activated') {
          if (
            window.confirm(
              'O app foi atualizado! Por favor, atualize a página.'
            )
          ) {
            window.location.reload();
          }
        }
      });
      waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
    }
  }
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
