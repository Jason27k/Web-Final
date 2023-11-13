import { Outlet, Link } from "react-router-dom";
import SpotifySearch from "./SpotifySearch";

const Layout = () => {
  return (
    <div className="w-screen h-screen">
      <nav className="bg-black text-white flex flex-row justify-between items-center px-4 py-6">
        <div className="flex flex-row justify-evenly items-center gap-x-4">
          <Link to="/">
            <img
              src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
              alt="Workflow"
              className="h-8 w-auto sm:h-10v"
            />
          </Link>
          <Link to="/">
            <h1 className="text-3xl font-bold hover:text-indigo-400">Home</h1>
          </Link>
          <Link to="/albums">
            <h1 className="text-3xl font-bold hover:text-indigo-400">Albums</h1>
          </Link>
          <Link to="/artists">
            <h1 className="text-3xl font-bold hover:text-indigo-400">Artists</h1>
          </Link>
          <Link to="/about">
            <h1 className="text-3xl font-bold hover:text-indigo-400">About</h1>
          </Link>
        </div>
        
        <SpotifySearch />
      </nav>
      <Outlet />
    </div>
  );
};

export default Layout;
