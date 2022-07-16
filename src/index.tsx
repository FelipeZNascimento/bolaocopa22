import React from 'react';
import ReactDOM from 'react-dom/client';
import { Navbar } from 'components/index';
import { Bets, Home, Ranking, Results } from 'sections/index';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import ROUTES from 'constants/routes';
import './index.scss';
import 'typeface-roboto';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Router>
      <Navbar />
      <Routes>
        <Route path={`${ROUTES.HOME.url}/*`} element={<Home />} />
        <Route path={`${ROUTES.RESULTS.url}/*`} element={<Results />} />
        <Route path={`${ROUTES.BETS.url}/*`} element={<Bets />} />
        <Route path={`${ROUTES.RANKING.url}/*`} element={<Ranking />} />
        <Route path={'/'} element={<Home />} />
        <Route path={'*'} element={<Home />} />
      </Routes>
    </Router>
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
