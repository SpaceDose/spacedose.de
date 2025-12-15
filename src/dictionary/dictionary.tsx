import { useLiveQuery } from "dexie-react-hooks";
import type { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FAB } from "../components/fab";
import { SlideView } from "../components/slide-view";
import { Page } from "../page";
import { useDb } from "../provider/database";
import { seedExampleData } from "../provider/vocabulary-seeder";
import { Card } from "./components/card";
import { VocabularyForm } from "./components/vocabulary-form";

export const Dictionary: FC = () => {
	const { vocabularyId } = useParams();
	const db = useDb();
	const navigate = useNavigate();

	const vocabularies = useLiveQuery(() => db.vocabularies.toArray());

	return (
		<Page>
			<h1 className="mx-4 my-2 text-gray">Vokabeln</h1>

			<div className="flex flex-col overflow-y-auto">
				{vocabularies?.map((vocabulary) => (
					<Card key={vocabulary.id} vocabulary={vocabulary} />
				))}
			</div>

			{import.meta.env.DEV && (
				<FAB
					left
					onClick={async () => {
						seedExampleData(db);
					}}
				/>
			)}

			<FAB
				onClick={async () => {
					const newVocabularyId = await db.vocabularies.add({
						date: new Date(),
						german: "",
						english: "",
					});

					navigate(`./${newVocabularyId}`);
				}}
			/>

			<SlideView show={!!vocabularyId} close={() => navigate(-1)}>
				<VocabularyForm />
			</SlideView>
		</Page>
	);
};
