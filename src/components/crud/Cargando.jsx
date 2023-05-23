import { Dialog, ProgressSpinner } from "./index";

export const Cargando = ({cargando}) => {
	return (
		<Dialog
			className={"loading"}
			visible={cargando}
			modal={true}
			draggable={false}
			closable={false}
			showHeader={false}
		>
			<ProgressSpinner
				style={{ width: "100%", height: "100%" }}
				strokeWidth="4"
				animationDuration="2.8s"
			/>
		</Dialog>
	);
};
