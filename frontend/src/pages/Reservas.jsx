import { useEffect, useState } from "react"
import "./section.css"

const API = "http://127.0.0.1:8000"

const BADGE = {
  aprobada:  "badge-green",
  rechazada: "badge-red",
  cancelada: "badge-gray",
  esperando: "badge-yellow"
}

const ESTADOS = ["todos", "esperando", "aprobada", "rechazada", "cancelada"]

function Reservas() {
  const [reservas,  setReservas]  = useState([])
  const [usuarios,  setUsuarios]  = useState([])
  const [espacios,  setEspacios]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [filtro,    setFiltro]    = useState("todos")

  const rol   = localStorage.getItem("rol")
  const token = () => localStorage.getItem("token")

  useEffect(() => {
    Promise.all([cargarReservas(), cargarUsuarios(), cargarEspacios()])
      .finally(() => setLoading(false))
  }, [])

  const cargarReservas = async () => {
    const endpoint = rol === "admin"
      ? `${API}/reservas/`
      : `${API}/reservas/mis-reservas`
    const res  = await fetch(endpoint, { headers: { Authorization: `Bearer ${token()}` } })
    const data = await res.json()
    setReservas(Array.isArray(data) ? data : [])
  }

  const cargarUsuarios = async () => {
    const res = await fetch(`${API}/usuarios/`, { headers: { Authorization: `Bearer ${token()}` } })
    if (res.ok) setUsuarios(await res.json())
  }

  const cargarEspacios = async () => {
    const res = await fetch(`${API}/espacios/`, { headers: { Authorization: `Bearer ${token()}` } })
    if (res.ok) setEspacios(await res.json())
  }

  const cambiarEstado = async (id, estado) => {
    const res = await fetch(`${API}/reservas/${id}/estado`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
      body: JSON.stringify({ estado })
    })
    const data = await res.json()
    if (res.ok) cargarReservas()
    else alert(data.detail)
  }

  const cancelarReserva = async (id) => {
    if (!confirm("¿Cancelar esta reserva?")) return
    const res  = await fetch(`${API}/reservas/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token()}` }
    })
    const data = await res.json()
    alert(data.mensaje)
    cargarReservas()
  }

  const nombreUsuario = (id) =>
    usuarios.find(u => u.id_usuario === id)?.correo ?? `#${id}`

  const nombreEspacio = (id) =>
    espacios.find(e => e.id_espacio === id)?.nombre ?? `#${id}`

  const reservasFiltradas = filtro === "todos"
    ? reservas
    : reservas.filter(r => r.estado === filtro)

  const conteo = (estado) =>
    estado === "todos"
      ? reservas.length
      : reservas.filter(r => r.estado === estado).length

  return (
    <div className="section">

      {/* ── Header ── */}
      <div className="section__head">
        <div>
          <h1 className="section-title">Reservas</h1>
          <p style={{ marginTop: ".2rem" }}>
            {reservasFiltradas.length} {reservasFiltradas.length === 1 ? "reserva" : "reservas"}
            {filtro !== "todos" && ` en estado "${filtro}"`}
          </p>
        </div>
      </div>

      {/* ── Filtros por estado ── */}
      <div className="reservas-filtros">
        {ESTADOS.map(estado => (
          <button
            key={estado}
            className={`filtro-btn ${filtro === estado ? "filtro-btn--active" : ""}`}
            onClick={() => setFiltro(estado)}
          >
            {estado === "todos" ? "Todos" : estado.charAt(0).toUpperCase() + estado.slice(1)}
            <span className="filtro-btn__count">{conteo(estado)}</span>
          </button>
        ))}
      </div>

      {/* ── Tabla ── */}
      {loading ? (
        <div className="empty-state"><p>Cargando reservas…</p></div>
      ) : reservasFiltradas.length === 0 ? (
        <div className="card empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="8"  y1="2" x2="8"  y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="3"  y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          <p>
            {filtro === "todos"
              ? "No tienes reservas aún. ¡Ve a Espacios para crear una!"
              : `No hay reservas con estado "${filtro}"`}
          </p>
        </div>
      ) : (
        <div className="card table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                {rol === "admin" && <th>Usuario</th>}
                <th>Espacio</th>
                <th>Fecha</th>
                <th>Horario</th>
                <th>Asistentes</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservasFiltradas.map(r => (
                <tr key={r.id_reserva}>
                  <td style={{ color: "var(--gray-400)", fontSize: ".8rem" }}>
                    {r.id_reserva}
                  </td>

                  {rol === "admin" && (
                    <td style={{ fontSize: ".82rem", color: "var(--gray-600)" }}>
                      {nombreUsuario(r.id_usuario)}
                    </td>
                  )}

                  <td>
                    <strong style={{ fontWeight: 500 }}>
                      {nombreEspacio(r.id_espacio)}
                    </strong>
                  </td>

                  <td style={{ whiteSpace: "nowrap" }}>{r.fecha}</td>

                  <td>
                    <span className="horario-pill">
                      {r.hora_inicio} → {r.hora_fin}
                    </span>
                  </td>

                  <td>{r.cantidad_asistentes}</td>

                  <td>
                    <span className={`badge ${BADGE[r.estado] ?? "badge-gray"}`}>
                      {r.estado}
                    </span>
                  </td>

                  <td>
                    <div className="actions-row">
                      {r.estado !== "cancelada" && r.estado !== "rechazada" && (
                        <button
                          className="btn-warning"
                          style={{ fontSize: ".78rem", padding: ".4rem .8rem" }}
                          onClick={() => cancelarReserva(r.id_reserva)}
                        >
                          Cancelar
                        </button>
                      )}
                      {rol === "admin" && r.estado === "esperando" && (
                        <>
                          <button
                            className="btn-success"
                            style={{ fontSize: ".78rem", padding: ".4rem .8rem" }}
                            onClick={() => cambiarEstado(r.id_reserva, "aprobada")}
                          >
                            ✓ Aprobar
                          </button>
                          <button
                            className="btn-danger"
                            style={{ fontSize: ".78rem", padding: ".4rem .8rem" }}
                            onClick={() => cambiarEstado(r.id_reserva, "rechazada")}
                          >
                            ✗ Rechazar
                          </button>
                        </>
                      )}
                    </div>
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

export default Reservas
