import { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

export const EditorHtml = ({ valorinicial, nombre, cambiohtml }) => {
	const [html, sethtml] = useState(valorinicial);
	const editorRef = useRef(null);
	useEffect(() => {
		sethtml(valorinicial);
		// console.log(valorinicial);
	}, [valorinicial]);
	return (
		<Editor
			apiKey="sdr0vt65som2yt3w6vlqazlj643smfhpzwn6g2ggpjhcyulc"
			onInit={(evt, editor) => (editorRef.current = editor)}
			initialValue={html}
			onBlur={() => {
				cambiohtml(editorRef.current.getContent(), nombre);
			}}
			init={{
				max_with: 600,
				height: 300,
				menubar: true,
				plugins: "code",
				toolbar:
					"undo redo | blocks | " +
					"bold italic backcolor | alignleft aligncenter " +
					"alignright alignjustify | bullist numlist outdent indent | " +
					"removeformat | help",
				content_style:
					"body { font-family:Helvetica,Arial,sans-serif; font-size:14px ;  }",
				menu: {
					file: {
						title: "File",
						items: "restoredraft | preview ",
					},
					edit: {
						title: "Edit",
						items: "undo redo | cut copy paste | selectall | searchreplace",
					},

					insert: {
						title: "Insert",
						items:
							"image |  link |  media | template|  codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor toc | insertdatetime",
					},
					format: {
						title: "Format",
						items:
							"bold italic underline strikethrough superscript subscript codeformat | formats blockformats fontformats fontsizes align lineheight | forecolor backcolor | removeformat",
					},
					tools: {
						title: "Tools",
						items: "spellchecker spellcheckerlanguage | code wordcount",
					},
					table: {
						title: "Table",
						items: "inserttable | cell row column | tableprops deletetable",
					},
					help: { title: "Help", items: "help" },
				},
			}}
		/>
	);
};
