import { useFormBuilder } from "@atmina/formbuilder";
import { useLiveQuery } from "dexie-react-hooks";
import { type FC, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "../../components/input";
import { useDb, type Vocabulary } from "../../provider/database";

export const VocabularyForm: FC = () => {
	const { vocabularyId } = useParams();
	const db = useDb();
	const navigate = useNavigate();
	const { fields, handleSubmit, reset } = useFormBuilder<Vocabulary>();

	const vocabulary = useLiveQuery(() =>
		db.vocabularies.get(parseInt(vocabularyId ?? "", 10)),
	);

	useEffect(() => {
		if (vocabulary) reset(vocabulary);
	}, [vocabulary, reset]);

	return (
		<>
			<form
				onSubmit={handleSubmit((data) => {
					if (vocabulary) {
						db.vocabularies.update(vocabulary.id, { ...data });
					}
					navigate(-1);
				})}
				className="flex flex-col gap-2 p-4"
			>
				<Input field={fields.english()} label="English" />
				<Input field={fields.german()} label="German" />

				<button
					type="submit"
					className="mt-1 rounded-lg bg-purple px-2.5 py-1.5 font-bold text-purple-light text-white"
				>
					{vocabulary ? "Save" : "Add"}
				</button>
			</form>

			<button
				type="button"
				onClick={() => {
					if (vocabulary) {
						db.vocabularies.delete(vocabulary.id);
					}
					navigate(-1);
				}}
				className="m-4 mt-auto rounded-lg bg-purple px-2.5 py-1.5 font-bold text-purple-light text-white"
			>
				Delete
			</button>
		</>
	);
};
