import { useSession, signIn, signOut } from "next-auth/react"
import Nav from "@/components/Nav";
import {useState} from "react";
import Logo from "@/components/Logo";

export default function Layout({children}) {
  const [showNav,setShowNav] = useState(false);
  const { data: session } = useSession();
  if (!session) {
    return (
      <div
      className="w-screen h-screen flex flex-col justify-center items-center text-center p-4 relative"
      style={{
        backgroundImage: "url('/fondo.svg')", // Ruta al archivo SVG en la carpeta public
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div> {/* Capa de color negro con opacidad para mejorar contraste */}
      <div className="relative z-10">
        <h1 className="text-4xl md:text-6xl text-white font-bold mb-4">
          Bienvenido al sistema de administración LedeJuni
        </h1>
        <p className="text-lg md:text-2xl mb-8">
          El sistema completo para gestionar tu e-commerce. Aquí puedes añadir, ver y administrar productos, manejar órdenes, gestionar permisos de administradores, y mucho más. Todo en una interfaz intuitiva y fácil de usar.
        </p>
        <button onClick={() => signIn('google')} className="bg-white text-blue-900 font-bold p-3 px-6 rounded-lg shadow-md hover:bg-gray-300 transition">
          Iniciar sesión con Google
        </button>
      </div>
    </div>
    );
  }

  return (
    <div className="bg-bgGray min-h-screen ">
      <div className="block md:hidden flex items-center p-4">
        <button onClick={() => setShowNav(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
          </svg>
        </button>
        <div className="flex grow justify-center mr-6">
          <Logo />
        </div>
      </div>
      <div className="flex">
        <Nav show={showNav} />
        <div className="flex-grow p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
