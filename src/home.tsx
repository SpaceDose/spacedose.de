import type { FC } from "react";
import { Link } from "react-router-dom";
import Logo from "./assets/logo.svg";
import { Page } from "./page";

export const Home: FC = () => (
	<Page className="items-center gap-24 py-32 text-orange-light">
		<img src={Logo} className="w-56 max-w-1/2 drop-shadow" alt="Logo" />

		<div className="flex flex-col gap-4 text-center">
			<Link
				to="/dictionary"
				className="rounded-lg bg-orange-light p-3 text-black"
			>
				Vokabeln
			</Link>

			<Link to="/kcal" className="rounded-lg bg-orange-light p-3 text-black">
				Abspecken
			</Link>
		</div>

		<p className="absolute right-0 bottom-0 px-2 font-thin text-orange-light text-sm">
			Build from {new Date(VERSION).toLocaleString()}
		</p>
	</Page>
);
