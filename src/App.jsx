import React, { useState } from "react";
import classNames from "classnames";
import { Routes, Route } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

import { AppTopbar } from "./AppTopbar";
import { AppFooter } from "./AppFooter";
import { AppMenu } from "./AppMenu";
import { AppConfig } from "./AppConfig";

// import { Dashboard } from "./components/Dashboard";

import {
	Items,
	Bom,
	Compras,
	Plantilla,
	Cotizacion,
	Cliente,
	Unidades,
	Partidas,
} from "./pages/crud/";
import { useSelector } from "react-redux";
import { Documentos } from "./pages/crud/Documentos";
import { Sitio } from "./pages/crud/Sitio";
import { Slider } from "./pages/crud/Slider";
import { Perfiles } from "./pages/crud/Perfiles";
import { MenuPrincipal } from "./pages/crud/MenuPrincipal";
import { Ediciones } from "./pages/crud/Ediciones";
import { Banners } from "./pages/crud/Banners";
import { Noticas } from "./pages/crud/Noticas";
import { VideoPromo } from "./pages/crud/VideoPromo";
import { Contenidos } from "./pages/crud/Contenidos";
import { Cifras } from "./pages/crud/Cifras";
import { Faq } from "./pages/crud/Faq";
import { Aliados } from "./pages/crud/Aliados";
import { Sedes } from "./pages/crud/Sedes";
import { Equipo } from "./pages/crud/Equipo";
import { CategoriasSeleccion } from "./pages/crud/CategoriasSeleccion";
import { Categorias } from "./pages/crud/Categorias";
import { ComiteSeleccion } from "./pages/crud/ComiteSeleccion";
import { Proyectos } from "./pages/crud/Proyectos";
import { ProgramacionEventos } from "./pages/crud/ProgramacionEventos";
import { Newslattrers } from "./pages/crud/Newslattrers";
import { Speakers } from "./pages/crud/Speakers";
import { Labels } from "./pages/crud/Labels";
import { Galerias } from "./pages/crud/Galerias";
import { ParticipanBam } from "./pages/crud/ParticipanBam";
import { RegionesBam } from "./pages/crud/RegionesBam";
import { ProgramacionEventosRegiones } from "./pages/crud/ProgramacionEventosRegiones";
import { SpeakersRegiones } from "./pages/crud/SpeakersRegiones";
import { Aliadosacreditaciones } from "./pages/crud/Aliadosacreditaciones";
import { Tarifas } from "./pages/crud/Tarifas";
import { Acreditados } from "./pages/crud/Acreditados";

const App = () => {
	const [layoutMode, setLayoutMode] = useState("static");
	const [layoutColorMode, setLayoutColorMode] = useState("light");
	const [inputStyle, setInputStyle] = useState("outlined");
	const [ripple, setRipple] = useState(true);
	const [staticMenuInactive, setStaticMenuInactive] = useState(false);
	const [overlayMenuActive, setOverlayMenuActive] = useState(false);
	const [mobileMenuActive, setMobileMenuActive] = useState(false);
	const [mobileTopbarMenuActive, setMobileTopbarMenuActive] = useState(false);
	const appSession = useSelector((state) => state.appsesion);
	let menuClick = false;
	let mobileTopbarMenuClick = false;

	const onWrapperClick = (event) => {
		if (!menuClick) {
			setOverlayMenuActive(false);
			setMobileMenuActive(false);
		}

		if (!mobileTopbarMenuClick) {
			setMobileTopbarMenuActive(false);
		}

		mobileTopbarMenuClick = false;
		menuClick = false;
	};

	const onToggleMenuClick = (event) => {
		menuClick = true;

		if (isDesktop()) {
			if (layoutMode === "overlay") {
				if (mobileMenuActive === true) {
					setOverlayMenuActive(true);
				}

				setOverlayMenuActive((prevState) => !prevState);
				setMobileMenuActive(false);
			} else if (layoutMode === "static") {
				setStaticMenuInactive((prevState) => !prevState);
			}
		} else {
			setMobileMenuActive((prevState) => !prevState);
		}

		event.preventDefault();
	};

	const onSidebarClick = () => {
		menuClick = true;
	};

	const onMobileTopbarMenuClick = (event) => {
		mobileTopbarMenuClick = true;

		setMobileTopbarMenuActive((prevState) => !prevState);
		event.preventDefault();
	};

	const onMobileSubTopbarMenuClick = (event) => {
		mobileTopbarMenuClick = true;

		event.preventDefault();
	};

	const onMenuItemClick = (event) => {
		if (!event.item.items) {
			setOverlayMenuActive(false);
			setMobileMenuActive(false);
		}
	};
	const isDesktop = () => {
		return window.innerWidth >= 992;
	};

	const menu = [
		{
			label: "WEBSITE",
			icon: "pi pi-fw pi-bookmark",
			items: [
				{
					label: "Sitio",
					icon: "pi pi-globe",
					to: "/sitio",
				},
				{
					label: "Menu Princial",
					icon: "pi pi-fw pi-building",
					to: "/MenuPrincipal",
				},
				{
					label: "Ediciones BAM",
					icon: "pi pi-globe",
					to: "/ediciones",
				},
				{
					label: "Labels",
					icon: "pi pi-globe",
					to: "/label",
				},
				{
					label: "Galeria de Imagenes",
					icon: "pi pi-globe",
					to: "/galeria",
				},
			],
		},
		{
			label: "HOME",
			icon: "pi pi-fw pi-bookmark",
			items: [
				{
					label: "Banner Imagen",
					icon: "pi pi-briefcase",
					to: "/banners/1",
				},
				{
					label: "Banner Textos",
					icon: "pi pi-fw pi-id-card",
					to: "/banners/2",
				},
				{
					label: "Banner Logos",
					icon: "pi pi-fw pi-id-card",
					to: "/banners/3",
				},
				{
					label: "Noticias",
					icon: "pi pi-file-pdf",
					to: "/noticas/1",
				},
				{
					label: "Destacados",
					icon: "pi pi-sitemap",
					to: "/noticas/2",
				},

				{
					label: "Recomendaciones",
					icon: "pi pi-fw pi-id-card",
					to: "/noticas/3",
				},
				{
					label: "Video Promocional",
					icon: "pi pi-fw pi-id-card",
					to: "/videopromo",
				},
			],
		},
		{
			label: "ACERCA DEL BAM",
			icon: "pi pi-fw pi-bookmark",
			items: [
				{
					label: "Secciones",
					icon: "pi pi-book",
					to: "/contenidos",
				},
				// {
				// 	label: "Galeria",
				// 	icon: "pi pi-book",
				// 	to: "/contenidos",
				// },
				{
					label: "cifras",
					icon: "pi pi-book",
					to: "/cifras",
				},
				{
					label: "FAQ",
					icon: "pi pi-book",
					to: "/faq",
				},
				{
					label: "Aliados",
					icon: "pi pi-book",
					to: "/aliados",
				},
				{
					label: "Sedes",
					icon: "pi pi-book",
					to: "/sedes",
				},
				{
					label: "Equipo",
					icon: "pi pi-book",
					to: "/equipo",
				},
			],
		},
		{
			label: "CONVOCATORIA",
			icon: "pi pi-fw pi-bookmark",
			items: [
				{
					label: "Categorias",
					icon: "pi pi-book",
					to: "/convocatoriacategorias",
				},
			],
		},
		{
			label: "SELECCIONADOS",
			icon: "pi pi-fw pi-bookmark",
			items: [
				{
					label: "Categorias",
					icon: "pi pi-book",
					to: "/Categorias",
				},
				{
					label: "Seleccionados",
					icon: "pi pi-book",
					to: "/proyectos",
				},
				{
					label: "Comite Evaluador",
					icon: "pi pi-book",
					to: "/comiteseleccion",
				},
			],
		},
		{
			label: "EVENTOS",
			icon: "pi pi-fw pi-bookmark",
			items: [
				{
					label: "Programacion",
					icon: "pi pi-book",
					to: "/programacionEventos",
				},
				{
					label: "Speakers",
					icon: "pi pi-book",
					to: "/speakers/0",
				},
			],
		},
		{
			label: "BAM REGIONES",
			icon: "pi pi-fw pi-bookmark",
			items: [
				{
					label: "Regiones",
					icon: "pi pi-book",
					to: "/regiones",
				},
				{
					label: "Programacion",
					icon: "pi pi-book",
					to: "/eventosregion",
				},

				{
					label: "Speakers",
					icon: "pi pi-book",
					to: "/speakersregion/1",
				},

				{
					label: "Participan",
					icon: "pi pi-book",
					to: "/participanBam",
				},
			],
		},
		{
			label: "OFICINA DE PRENSA",
			icon: "pi pi-fw pi-bookmark",
			items: [
				{
					label: "Prensa",
					icon: "pi pi-book",
					to: "/newsletters",
				},
			],
		},
		{
			label: "ACREDITACIONES",
			icon: "pi pi-fw pi-bookmark",
			items: [
				{
					label: "Acreditados",
					icon: "pi pi-book",
					to: "/acreditados",
				},
				{
					label: "Aliados",
					icon: "pi pi-book",
					to: "/aliadosacreditaciones",
				},

				{
					label: "Tarifas",
					icon: "pi pi-book",
					to: "/tarifas",
				},
			],
		},
	];

	const wrapperClass = classNames("layout-wrapper", {
		"layout-overlay": layoutMode === "overlay",
		"layout-static": layoutMode === "static",
		"layout-static-sidebar-inactive":
			staticMenuInactive && layoutMode === "static",
		"layout-overlay-sidebar-active":
			overlayMenuActive && layoutMode === "overlay",
		"layout-mobile-sidebar-active": mobileMenuActive,
		"p-input-filled": inputStyle === "filled",
		"p-ripple-disabled": ripple === false,
		"layout-theme-light": layoutColorMode === "light",
	});

	return (
		<div className={wrapperClass} onClick={onWrapperClick}>
			<AppTopbar
				onToggleMenuClick={onToggleMenuClick}
				mobileTopbarMenuActive={mobileTopbarMenuActive}
				onMobileTopbarMenuClick={onMobileTopbarMenuClick}
				onMobileSubTopbarMenuClick={onMobileSubTopbarMenuClick}
			/>

			<div className='layout-sidebar' onClick={onSidebarClick}>
				<AppMenu model={menu} onMenuItemClick={onMenuItemClick} />
				{/* <pre style={{ fontSize: "0.9rem" }}>
					{JSON.stringify(appSession, null, "\n")}
				</pre> */}
			</div>

			<div className='layout-main-container'>
				<div className='layout-main'>
					<Routes>
						{/* <Route
							path="/"
							render={() => <Dashboard colorMode={layoutColorMode} />}
						/> */}
						<Route path='/' element={<Contenidos />} />
						{/* Mi menu */}
						{/* <Route path='/bom' element={<Bom />} />
						<Route path='/plantilla' element={<Plantilla />} />
						<Route path='/partidas' element={<Partidas />} />
						<Route path='/cliente' element={<Cliente />} />
						<Route path='/cotizacion' element={<Cotizacion />} />
						<Route path='/compras' element={<Compras />} />
						<Route path='/item' element={<Items />} />
						<Route path='/unidades' element={<Unidades />} /> */}
						{/* <Route path="/loginleo" element={<Login />} /> */}
						{/* Mi menu */}

						<Route path='/aliados' element={<Aliados />} />
						<Route path='/cifras' element={<Cifras />} />
						<Route path='/documentos' element={<Documentos />} />
						<Route path='/sitio' element={<Sitio />} />
						<Route path='/slider' element={<Slider />} />
						<Route path='/contenidos' element={<Contenidos />} />
						<Route path='/equipo' element={<Equipo />} />
						<Route path='/perfiles' element={<Perfiles />} />
						<Route
							path='/MenuPrincipal'
							element={<MenuPrincipal />}
						/>
						<Route path='/ediciones' element={<Ediciones />} />
						<Route path='/banners/:grupo' element={<Banners />} />
						<Route path='/noticas/:grupo' element={<Noticas />} />
						<Route path='/videopromo' element={<VideoPromo />} />
						<Route path='/contenidos' element={<Contenidos />} />
						<Route path='/cifras' element={<Cifras />} />
						<Route path='/faq' element={<Faq />} />
						<Route path='/sedes' element={<Sedes />} />
						<Route
							path='/convocatoriacategorias'
							element={<CategoriasSeleccion />}
						/>
						<Route path='/categorias' element={<Categorias />} />
						<Route
							path='/comiteseleccion'
							element={<ComiteSeleccion />}
						/>
						<Route path='/proyectos' element={<Proyectos />} />
						<Route
							path='/programacionEventos'
							element={<ProgramacionEventos />}
						/>
						<Route path='/newsletters' element={<Newslattrers />} />
						<Route path='/comunicados' element={<Newslattrers />} />
						<Route
							path='/regioncontenido'
							element={<Newslattrers />}
						/>
						<Route path='/regiones' element={<RegionesBam />} />
						<Route
							path='/eventosregion'
							element={<ProgramacionEventosRegiones />}
						/>
						<Route path='/speakers/:grupo' element={<Speakers />} />
						<Route path='/label' element={<Labels />} />
						<Route path='/galeria' element={<Galerias />} />
						<Route
							path='/participanBam'
							element={<ParticipanBam />}
						/>
						<Route
							path='/speakersregion/:grupo'
							element={<SpeakersRegiones />}
						/>

						<Route path='/galeria' element={<Galerias />} />
						<Route
							path='/aliadosacreditaciones'
							element={<Aliadosacreditaciones />}
						/>

						<Route path='/tarifas' element={<Tarifas />} />
						<Route path='/acreditados' element={<Acreditados />} />
					</Routes>
				</div>

				<AppFooter layoutColorMode={layoutColorMode} />
			</div>

			<AppConfig />

			<CSSTransition
				classNames='layout-mask'
				timeout={{ enter: 200, exit: 200 }}
				in={mobileMenuActive}
				unmountOnExit>
				<div className='layout-mask p-component-overlay'></div>
			</CSSTransition>
		</div>
	);
};

export default App;
