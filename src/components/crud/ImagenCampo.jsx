import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Toast, FileUpload, Image, Button } from "../../components/crud";
import { setDataSet, setFormData } from "../../store/appSlice";

export const ImagenCampo = ({
	label,
	nombreCampo,
	formData,
	CampoImagen,
	edicampo = "",
	urlupload,
}) => {
	const toast = useRef(null);
	const dispatch = useDispatch();
	const [srcImage, setsrcImage] = useState("");
	const [cargando, setcargando] = useState(false);

	const onBasicUploadAuto = (e) => {
		const { resp } = JSON.parse(e.xhr.response);
		// console.log(CampoImagen, resp.file);
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
		console.log(edicampo, "efect imagen");
	}, [edicampo]);

	return (
		<>
			<div className='grid'>
				<div className='col-4'>
					<label htmlFor='url_ali'>{label}:</label>
					{cargando === false ? (
						<FileUpload
							mode='basic'
							name={nombreCampo}
							// url="http://localhost/upload/cifras"
							url={process.env.REACT_APP_URLAPI + urlupload}
							accept='image/*'
							maxFileSize={3000000 * 1}
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
							onBeforeSend={(e, a) => {
								// console.log(e,a, "onBeforeSend");
							}}
							onBeforeUpload={(e, a) => {
								// console.log(e,a, "onBeforeUpload");
								setcargando(true);
							}}
							onValidationFail={(e, a) => {
								// console.log(e,a, "onValidationFail");
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
				<div className='col-8'>
					{srcImage.length === 0 ? (
						<></>
					) : (
						<Image
							src={srcImage}
							imageStyle={{
								width: "50%",
								height: "50%",
								marginTop: "1rem",
							}}
							alt='Image'
							preview
						/>
					)}
				</div>
			</div>

			<Toast ref={toast} />
		</>
	);
};
