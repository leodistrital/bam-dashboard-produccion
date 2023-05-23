import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Toast, FileUpload, Button } from ".";
import { setDataSet, setFormData } from "../../store/appSlice";

export const AdjuntoCampo = ({
	label,
	nombreCampo,
	formData,
	CampoImagen,
	edicampo = "",
	urlupload = "docs",
}) => {
	const toast = useRef(null);
	const dispatch = useDispatch();
	const [srcImage, setsrcImage] = useState("");
	const [cargando, setcargando] = useState(false);

	const onBasicUploadAuto = (e) => {
		const { resp } = JSON.parse(e.xhr.response);
		// console.log(CampoImagen, resp.file);
		// console.log(resp);
		if (resp.status !== 200) {
			toast.current.show({
				severity: "error",
				summary: "Archivo",
				detail: resp.mensaje,
			});
			setcargando(false);
			return false;
		}
		let _temp = { ...formData };
		_temp[`${CampoImagen}`] = resp.file;
		// console.log(_temp);
		setsrcImage(resp.file);
		dispatch(setFormData(_temp));

		toast.current.show({
			severity: "info",
			summary: "Archivo",
			detail: "El archivo subió correctamente",
		});
		setcargando(false);
	};

	useEffect(() => {
		if (edicampo) {
			setsrcImage(edicampo);
		} else {
			setsrcImage("");
		}
		// console.log(edicampo, "efect imagen");
	}, [edicampo]);

	const openInNewTab = (url) => {
		window.open(url, "_blank", "noopener,noreferrer");
	};

	return (
		<>
			<div className='grid'>
				<div className='col-6'>
					<label htmlFor='url_ali'>{label}:</label>
					{cargando === false ? (
						<FileUpload
							// withCredentials ="true"
							mode='basic'
							name={nombreCampo}
							// url="https://recaudobogota.rbsas.co/upload/cifras"
							url={process.env.REACT_APP_URLAPI + urlupload}
							accept='.pdf'
							maxFileSize={1000000 * 10}
							onUpload={onBasicUploadAuto}
							auto
							chooseLabel='Seleccionar'
							uploadLabel='Cargando...'
							style={{ marginTop: "15px" }}
							onError={(e, a) => {
								// console.log(e,a, "onError");
							}}
							onSelect={(e, a) => {
								// console.log(e,a, "onSelect");
							}}
							onBeforeSend={(e, a) => {}}
							onBeforeUpload={(e, a) => {
								// console.log(e,a, "onBeforeUpload");
								setcargando(true);
							}}
							onValidationFail={(e, a) => {
								console.log(e, a, "onValidationFail");
								toast.current.show({
									severity: "error",
									summary: "Error de Archivo",
									detail: "El archivo no es valido",
								});
							}}
							uploadHandler={(e, a) => {
								// console.log(e,a, "uploadHandler");
							}}
						/>
					) : (
						<Button
							className='p-fileupload'
							label='Cargando...'
							iconPos='right'
							loading={1}
							style={{
								width: "45%",
								display: "block",
								marginTop: "15px",
							}}
						/>
					)}
				</div>
				<div className='col-6'>
					{console.log(srcImage, "se revienta")}
					{srcImage.length === 0 ? (
						<></>
					) : (
						<Button
							onClick={() => openInNewTab(srcImage)}
							className=' p-button-outlined p-button-info  p-0'
							aria-label='Facebook'
							style={{
								width: "80%",
								height: "50%",
								marginTop: "30px",
							}}>
							<i className='pi pi-paperclip px-2'></i>
							<span className='px-3'>Ver Adjunto</span>
						</Button>
					)}
				</div>
			</div>

			<Toast ref={toast} />
		</>
	);
};
