import {type FC} from 'react';
import {RouterProvider, createBrowserRouter} from 'react-router-dom';
import {Home} from './home';
import {Kcal} from './kcal/kcal';
import {DatabaseProvider} from './provider/database';

import '@fontsource/poppins/200.css';
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/poppins/800.css';
import '@fontsource/poppins/900.css';

const router = createBrowserRouter([
  {
    path: '',
    element: <Home />,
  },
  {
    path: 'kcal',
    element: <Kcal />,
    children: [
      {
        path: ':mealId',
        element: <Kcal />,
      },
    ],
  },
]);

const App: FC = () => (
  <DatabaseProvider>
    <RouterProvider router={router} />
  </DatabaseProvider>
);

export default App;
