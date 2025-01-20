import React from "react";
import Dashboard from '../component/Dashboard/Dashboard.jsx';
import "../../styles/home.css";
import Sidebar from "../component/Sidebar/Sidebar.jsx";

export const Home = () => {
	return (
		<div className="homeContainer text-center">
			<Sidebar className="mt-5"/>
			<Dashboard/>  
		</div>
	);
};
