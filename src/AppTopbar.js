import React from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { useSelector, useDispatch } from "react-redux";
import { increment, logOff } from "./store/appSlice";

export const AppTopbar = (props) => {
	// const { counter } = useSelector((state) => state.appsesion);
	const dispatch = useDispatch();

	const hadleSalir = () => {
		console.log("salio,,,,");
		dispatch(logOff());
	};

	return (
		<div className="layout-topbar">
			<Link to="/" className="layout-topbar-logo">
				{/* <img
					src={
						props.layoutColorMode === "light"
							? "assets/layout/images/logonextrade.jpg"
							: "assets/layout/images/logonextrade.jpg"
					}
					alt="logo"
				/> */}
				
			</Link>

			<button
				type="button"
				className="p-link  layout-menu-button layout-topbar-button"
				onClick={props.onToggleMenuClick}
			>
				<i style={{ fontSize: "2em" }} className="pi pi-bars" />
			</button>
			{/* {counter} */}
			<button
				type="button"
				className="p-link layout-topbar-menu-button layout-topbar-button"
				onClick={props.onMobileTopbarMenuClick}
			>
				<i className="pi pi-ellipsis-v" />
			</button>

			<ul
				className={classNames("layout-topbar-menu lg:flex origin-top", {
					"layout-topbar-menu-mobile-active": props.mobileTopbarMenuActive,
				})}
			>
				<li>
					<button
						className="p-link layout-topbar-button"
						onClick={props.onMobileSubTopbarMenuClick}
					>
						<i className="pi pi-user" />
						<span>Usuario</span>
					</button>
				</li>
				<li>
					<button className="p-link layout-topbar-button" onClick={hadleSalir}>
						<i className="pi pi-sign-out mr-2" />
						<span>Salir </span>
					</button>
				</li>
			</ul>
		</div>
	);
};
