import { useEffect, useState } from "react"
import "./section.css"

const API = "http://127.0.0.1:8000"

const ROL_BADGE = {
  admin:   "badge-blue",
  usuario: "badge-green"
}

function Usuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [loading,  setLoading]  = useState(true)

  const token = () => localStorage.getItem("token")

  useEffect(() => {
    const cargar = async () => {
      const res  = await fetch(`${API}/usuarios/`, {
        headers: { Authorization: `Bearer ${token()}` }
      })
      const data = await res.json()
      setUsuarios(Array.isArray(data) ? data : [])
      setLoading(false)
    }
    cargar()
  }, [])

  return (
    <div className="section">

      <div className="section__head">
        <div>
          <h1 className="section-title">Usuarios</h1>
          <p style={{ marginTop: ".2rem" }}>
            {usuarios.length} {usuarios.length === 1 ? "usuario registrado" : "usuarios registrados"}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="empty-state"><p>Cargando usuarios…</p></div>
      ) : (
        <div className="card table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(u => (
                <tr key={u.id_usuario}>
                  <td style={{ color: "var(--gray-400)", fontSize: ".8rem" }}>
                    {u.id_usuario}
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: ".65rem" }}>
                      <div className="usuario-avatar">
                        {(u.nombre?.[0] ?? u.correo?.[0] ?? "?").toUpperCase()}
                      </div>
                      <strong style={{ fontWeight: 500 }}>{u.nombre}</strong>
                    </div>
                  </td>
                  <td style={{ color: "var(--gray-600)", fontSize: ".88rem" }}>
                    {u.correo}
                  </td>
                  <td>
                    <span className={`badge ${ROL_BADGE[u.rol] ?? "badge-gray"}`}>
                      {u.rol}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  )
}

export default Usuarios
