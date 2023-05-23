import React from "react";
import { Button ,Dialog }  from './index';
export const EliminarVentana = ({ deleteProductDialog, product, hideDeleteProductDialog , deleteProduct }) => {

	// console.log(product);
    const deleteProductDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-raised p-button-info p-button-text" onClick={hideDeleteProductDialog} />

            <Button label="Borrar" icon="pi pi-check" className="p-button-raised p-button-danger p-button-text" onClick={deleteProduct} />
        </>
    );
	return (
		<>
			<Dialog
				visible={deleteProductDialog}
				style={{ width: "450px" }}
				header="Confirmación"
				modal
				footer={deleteProductDialogFooter}
				onHide={hideDeleteProductDialog}
			>
				<div className="p-button-danger flex align-items-center justify-content-center">
					<i
						className="pi pi-exclamation-triangle mr-3"
						style={{ fontSize: "4rem", color: "red" }}
					/>
					{product && (
						<span>
							Esta Segurodo de eliminar el registro <b>{product}</b>?
						</span>
					)}
				</div>
			</Dialog>
		</>
	);
};
