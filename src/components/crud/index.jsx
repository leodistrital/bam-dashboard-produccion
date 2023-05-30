import { Chip } from "primereact/chip";

export { Chip } from "primereact/chip";
export { DataTable } from "primereact/datatable";
export { Column } from "primereact/column";
export { Toast } from "primereact/toast";
export { Button } from "primereact/button";
export { Toolbar } from "primereact/toolbar";
export { InputTextarea } from "primereact/inputtextarea";
export { InputNumber } from "primereact/inputnumber";
export { Dialog } from "primereact/dialog";
export { InputText } from "primereact/inputtext";
export { Dropdown } from "primereact/dropdown";
export { AutoComplete } from "primereact/autocomplete";
export { Calendar } from "primereact/calendar";
export { locale } from "primereact/api";
export { addLocale } from "primereact/api";
export { TabView, TabPanel } from "primereact/tabview";
export { OverlayPanel } from "primereact/overlaypanel";
export { Accordion, AccordionTab } from "primereact/accordion";
export { Tag } from "primereact/tag";
export { ProgressSpinner } from "primereact/progressspinner";
export { FileUpload } from "primereact/fileupload";
export { Image } from "primereact/image";
export { EditorHtml } from "../../components/crud/EditorHtml";
export { Divider } from "primereact/divider";
export { ListBox } from "primereact/listbox";

export const tabHeaderIIespanol = (options) => {
	return (
		<div
			className='flex align-items-center px-1'
			style={{ cursor: "pointer" }}
			onClick={options.onClick}>
			<Chip label='Español' className='mr-2 mb-2' />
		</div>
	);
};

export const tabHeaderIIingles = (options) => {
	return (
		<div
			className='flex align-items-center px-1'
			style={{ cursor: "pointer" }}
			onClick={options.onClick}>
			<Chip label='Ingles' className='mr-2 mb-2' />
		</div>
	);
};

export const tabHeaderIIPrograciones = (options) => {
	return (
		<div
			className='flex align-items-center px-1'
			style={{ cursor: "pointer" }}
			onClick={options.onClick}>
			<Chip label='Adjuntos' className='mr-2 mb-2' />
		</div>
	);
};

export const tabHeaderIIResumen = (options) => {
	return (
		<div
			className='flex align-items-center px-1'
			style={{ cursor: "pointer" }}
			onClick={options.onClick}>
			<Chip label='Resumen' className='mr-2 mb-2' />
		</div>
	);
};

export const tabHeaderIIPaso1 = (options) => {
	return (
		<div
			className='flex align-items-center px-1'
			style={{ cursor: "pointer" }}
			onClick={options.onClick}>
			<Chip label='Paso 1' className='mr-2 mb-2' />
		</div>
	);
};

export const tabHeaderIIPaso2 = (options) => {
	return (
		<div
			className='flex align-items-center px-1'
			style={{ cursor: "pointer" }}
			onClick={options.onClick}>
			<Chip label='Paso 2' className='mr-2 mb-2' />
		</div>
	);
};

export const tabHeaderIIPaso3 = (options) => {
	return (
		<div
			className='flex align-items-center px-1'
			style={{ cursor: "pointer" }}
			onClick={options.onClick}>
			<Chip label='Paso 3' className='mr-2 mb-2' />
		</div>
	);
};

export const tabHeaderIIPaso4 = (options) => {
	return (
		<div
			className='flex align-items-center px-1'
			style={{ cursor: "pointer" }}
			onClick={options.onClick}>
			<Chip label='Paso 4' className='mr-2 mb-2' />
		</div>
	);
};
