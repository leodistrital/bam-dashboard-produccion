import React, { useState } from "react";
import classNames from "classnames";
import { AppFooter } from "./AppFooter";
import { FormLogin } from "./pages/FormLogin";
import { AppConfig } from './AppConfig';

export const Login = () => {
	const [layoutMode, setLayoutMode] = useState("static");
	const [layoutColorMode, setLayoutColorMode] = useState("light");

	const wrapperClass = classNames("layout-wrapper", {
		"layout-overlay": layoutMode === "overlay",
		"layout-static": layoutMode === "static",
	});

	return (
		<div className={wrapperClass}>
			<div className="layout-main-container1" >
				<div className="layout-main">
					<FormLogin />
				</div>
			</div>
				<AppConfig />
		</div>
	);
};
