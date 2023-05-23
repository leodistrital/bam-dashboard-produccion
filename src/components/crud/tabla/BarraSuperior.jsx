import React from 'react';
import { Button,Toolbar }  from '../index';
export const BarraSuperior = ({openNew}) => {


    const leftToolbarTemplate = () => {
        return (
            <>
                <div className="my-2">
                    <Button
                        label="Agregar"
                        icon="pi pi-plus"
                        style={{
                            fontSize: "1.3rem"
                        }}
                        className="p-button-success mr-2"
                        onClick={openNew}
                    />
                </div>
            </>
        );
    };


  return (<>
    <Toolbar className="mb-4" left={leftToolbarTemplate} ></Toolbar>
  </>);
};
