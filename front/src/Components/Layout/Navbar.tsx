import { Link } from "react-router";

export const NavBar = () => {
  return (
    <nav className="bg-gray text-white px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-semibold flex items-center gap-3">
          <img
            className="rounded-full w-10 h-10"
            src="/src/Assets/logo.avif"
            alt="Logo"
          />
          Degree Progress
        </h1>
        <div className="flex gap-6 text-sm">
          <Link to="/" className="hover:text-green transition">
            Home
          </Link>
          <Link to="/dashboard" className="hover:text-green transition">
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
};
