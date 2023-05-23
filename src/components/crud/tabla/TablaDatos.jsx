import React, { useRef, useState } from 'react';
import { DataTable, InputText } from '../index';


export const TablaDatos = ({ datostabla,  children , buscador=true, paginator=true, titulo=''}) => {


    const [globalFilter, setGlobalFilter] = useState(null);
    const dt = useRef(null);


    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <><h2 className="m-0">{titulo}</h2>
            {
                buscador && (
                <span className="block mt-2 md:mt-0 p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" onInput={e => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
                </span>)
            }
            </>
            
        </div>
    );



    return (
        <>
            <DataTable
                ref={dt}
                value={datostabla}
                dataKey="id"
                paginator= {paginator}
                rows={15}
                rowsPerPageOptions={[10, 15, 25, 50]}
                className="datatable-responsive"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="{first} de {last},  Total: {totalRecords} registros"
                globalFilter={globalFilter}
                emptyMessage="No hay Resultados"
                header={header}
                responsiveLayout="scroll"
            >
                {children}
            </DataTable>
        </>
    );
};
