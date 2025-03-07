'use client'
import { useRouter } from "next/navigation";

export default function LoginErrorPage() {
    const router = useRouter()

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{height: "70vh"}}>
            <div className="border p-3">
                <h1>Error al iniciar sesión</h1>
                <p>¡Lo sentimos! Ha ocurrido un error al intentar iniciar sesión con sus credenciales de Uber. Por favor intente de nuevo.</p>
                <button
                    className="btn btn-primary d-flex align-items-center justify-content-center mb-2"
                    onClick={() => router.push("/")}
                    style={{ backgroundColor: '#7BAF45', borderColor: '#7BAF45' }}
                >Volver al inicio</button>
            </div>            
        </div>
    )
}