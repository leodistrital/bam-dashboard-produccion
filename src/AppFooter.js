import React from 'react';

export const AppFooter = (props) => {

    return (
        <div className="layout-footer">
            <img src={props.layoutColorMode === 'light' ? 'assets/layout/images/logolys.jpeg' : 'assets/layout/images/logolys.jpeg'} alt="Logo" height="60" className="mr-2" />

            <span className="font-medium ml-2">2022</span>
        </div>
    );
}
