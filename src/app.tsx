import type { FC } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Dictionary } from "./dictionary/dictionary";

import { Home } from "./home";
import { Kcal } from "./kcal/kcal";

import "@fontsource/poppins/200.css";
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";
import "@fontsource/poppins/900.css";
import { DatabaseProvider } from "./provider/database";

const router = createBrowserRouter([
	{
		path: "",
		element: <Home />,
	},
	{
		path: "dictionary",
		element: <Dictionary />,
		children: [
			{
				path: ":vocabularyId",
				element: <Dictionary />,
			},
		],
	},
	{
		path: "kcal",
		element: <Kcal />,
		children: [
			{
				path: ":mealId",
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
