import { useEffect, useState, useCallback } from "react"
import "./section.css"
import "./modal.css"

const API = "http://127.0.0.1:8000"

const DISPONIBILIDAD = {
  idle:       null,
  checking:   "checking",
  available:  "available",
  unavailable:"unavailable"
}

function Espacios() {
  const [espacios,      setEspacios]      = useState([])
  const [loading,       setLoading]       = useState(true)
  const [formOpen,      setFormOpen]      = useState(false)
  const [modalEspacio,  setModalEspacio]  = useState(null)
  const [disponibilidad, setDisponibilidad] = useState(DISPONIBILIDAD.idle)
  const [mensajeDisp,   setMensajeDisp]   = useState("")

  const rol = localStorage.getItem("rol")

  const [nuevo, setNuevo] = useState({
    nombre: "", ubicacion: "", capacidad: "", estado: "activo"
  })

  const [reservaForm, setReservaForm] = useState({
    fecha: "", hora_inicio: "", hora_fin: "", cantidad_asistentes: ""
  })

  const token = () => localStorage.getItem("token")

  useEffect(() => { cargarEspacios() }, [])

  // Verificar disponibilidad cuando fecha + horas estén completas
  useEffect(() => {
    const { fecha, hora_inicio, hora_fin } = reservaForm
    if (!modalEspacio || !fecha || !hora_inicio || !hora_fin) {
      setDisponibilidad(DISPONIBILIDAD.idle)
      return
    }
    if (hora_inicio >= hora_fin) {
      setDisponibilidad(DISPONIBILIDAD.unavailable)
      setMensajeDisp("La hora de fin debe ser mayor a la hora de inicio")
      return
    }

    const timer = setTimeout(() => verificarDisponibilidad(fecha, hora_inicio, hora_fin), 500)
    return () => clearTimeout(timer)
  }, [reservaForm.fecha, reservaForm.hora_inicio, reservaForm.hora_fin, modalEspacio])

  const verificarDisponibilidad = async (fecha, hora_inicio, hora_fin) => {
    setDisponibilidad(DISPONIBILIDAD.checking)
    try {
      const params = new URLSearchParams({
        id_espacio: modalEspacio.id_espacio,
        fecha, hora_inicio, hora_fin
      })
      const res  = await fetch(`${API}/reservas/disponibilidad?${params}`, {
        headers: { Authorization: `Bearer ${token()}` }
      })
      const data = await res.json()
      setDisponibilidad(data.disponible ? DISPONIBILIDAD.available : DISPONIBILIDAD.unavailable)
      setMensajeDisp(data.mensaje)
    } catch {
      setDisponibilidad(DISPONIBILIDAD.idle)
      setMensajeDisp("")
    }
  }

  const cargarEspacios = async () => {
    setLoading(true)
    try {
      const res  = await fetch(`${API}/espacios/`, {
        headers: { Authorization: `Bearer ${token()}` }
      })
      const data = await res.json()
      setEspacios(Array.isArray(data) ? data : [])
    } finally {
      setLoading(false)
    }
  }

  const crearEspacio = async (e) => {
    e.preventDefault()
    const res = await fetch(`${API}/espacios/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
      body: JSON.stringify({ ...nuevo, capacidad: Number(nuevo.capacidad) })
    })
    const data = await res.json()
    if (res.ok) {
      setNuevo({ nombre: "", ubicacion: "", capacidad: "", estado: "activo" })
      setFormOpen(false)
      cargarEspacios()
    } else {
      alert(data.detail)
    }
  }

  const eliminarEspacio = async (id) => {
    if (!confirm("¿Eliminar este espacio?")) return
    const res = await fetch(`${API}/espacios/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token()}` }
    })
    if (res.ok) cargarEspacios()
  }

  const abrirModal = (espacio) => {
    setModalEspacio(espacio)
    setReservaForm({ fecha: "", hora_inicio: "", hora_fin: "", cantidad_asistentes: "" })
    setDisponibilidad(DISPONIBILIDAD.idle)
    setMensajeDisp("")
  }

  const cerrarModal = () => {
    setModalEspacio(null)
    setDisponibilidad(DISPONIBILIDAD.idle)
    setMensajeDisp("")
  }

  const crearReserva = async (e) => {
    e.preventDefault()
    if (disponibilidad !== DISPONIBILIDAD.available) return

    const res = await fetch(`${API}/reservas/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
      body: JSON.stringify({
        ...reservaForm,
        id_espacio: modalEspacio.id_espacio,
        cantidad_asistentes: Number(reservaForm.cantidad_asistentes)
      })
    })
    const data = await res.json()
    if (res.ok) {
      alert("¡Reserva creada correctamente!")
      cerrarModal()
    } else {
      alert(data.detail)
    }
  }

  const puedeConfirmar =
    disponibilidad === DISPONIBILIDAD.available &&
    reservaForm.cantidad_asistentes !== ""

  return (
    <div className="section">

      {/* ── Header ── */}
      <div className="section__head">
        <div>
          <h1 className="section-title">Espacios</h1>
          <p style={{ marginTop: ".2rem" }}>
            {espacios.length} {espacios.length === 1 ? "espacio registrado" : "espacios registrados"}
          </p>
        </div>
        {rol === "admin" && (
          <button className="btn-primary" onClick={() => setFormOpen(!formOpen)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            Nuevo espacio
          </button>
        )}
      </div>

      {/* ── Formulario crear espacio ── */}
      {formOpen && rol === "admin" && (
        <div className="card section__form">
          <h3 style={{ marginBottom: "1.25rem" }}>Crear nuevo espacio</h3>
          <form onSubmit={crearEspacio}>
            <div className="form-row-2">
              <div className="form-group">
                <label>Nombre</label>
                <input placeholder="Sala de reuniones A" value={nuevo.nombre}
                  onChange={e => setNuevo({ ...nuevo, nombre: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Ubicación</label>
                <input placeholder="Piso 3, bloque B" value={nuevo.ubicacion}
                  onChange={e => setNuevo({ ...nuevo, ubicacion: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Capacidad</label>
                <input type="number" min="1" placeholder="20" value={nuevo.capacidad}
                  onChange={e => setNuevo({ ...nuevo, capacidad: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Estado</label>
                <select value={nuevo.estado} onChange={e => setNuevo({ ...nuevo, estado: e.target.value })}>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: ".75rem", justifyContent: "flex-end" }}>
              <button type="button" className="btn-ghost" onClick={() => setFormOpen(false)}>Cancelar</button>
              <button type="submit" className="btn-primary">Crear espacio</button>
            </div>
          </form>
        </div>
      )}

      {/* ── Grid de cards ── */}
      {loading ? (
        <div className="empty-state"><p>Cargando espacios…</p></div>
      ) : espacios.length === 0 ? (
        <div className="card empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
            <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
            <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
            <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          <p>No hay espacios registrados aún</p>
        </div>
      ) : (
        <div className="espacio-grid">
          {espacios.map(esp => (
            <div key={esp.id_espacio} className="espacio-card card">
              <div className="espacio-card__header">
                <div className="espacio-card__icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className={`badge ${esp.estado === "activo" ? "badge-green" : "badge-gray"}`}>
                  {esp.estado}
                </span>
              </div>
              <h3 className="espacio-card__name">{esp.nombre}</h3>
              <div className="espacio-card__meta">
                <span className="espacio-card__meta-item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  {esp.ubicacion}
                </span>
                <span className="espacio-card__meta-item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  {esp.capacidad} personas
                </span>
              </div>
              <div className="espacio-card__actions">
                <button className="btn-primary espacio-card__reservar" onClick={() => abrirModal(esp)}>
                  Reservar
                </button>
                {rol === "admin" && (
                  <button className="btn-danger espacio-card__delete" onClick={() => eliminarEspacio(esp.id_espacio)} title="Eliminar">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal de reserva ── */}
      {modalEspacio && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>

            <div className="modal-header">
              <div className="modal-header__info">
                <div className="modal-header__icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="8"  y1="2" x2="8"  y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="3"  y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div>
                  <h3 className="modal-header__title">Reservar: {modalEspacio.nombre}</h3>
                  <p className="modal-header__sub">
                    {modalEspacio.ubicacion} · {modalEspacio.capacidad} personas
                  </p>
                </div>
              </div>
              <button className="modal-close" onClick={cerrarModal}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="6"  y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <hr className="modal-divider" />

            <form onSubmit={crearReserva} className="modal-form">

              <div className="form-group" style={{ gridColumn: "span 2" }}>
                <label>Fecha</label>
                <input type="date" value={reservaForm.fecha}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={e => setReservaForm({ ...reservaForm, fecha: e.target.value })} required />
              </div>

              <div className="form-group">
                <label>Hora inicio</label>
                <input type="time" value={reservaForm.hora_inicio}
                  onChange={e => setReservaForm({ ...reservaForm, hora_inicio: e.target.value })} required />
              </div>

              <div className="form-group">
                <label>Hora fin</label>
                <input type="time" value={reservaForm.hora_fin}
                  onChange={e => setReservaForm({ ...reservaForm, hora_fin: e.target.value })} required />
              </div>

              {/* ── Indicador de disponibilidad ── */}
              {disponibilidad !== DISPONIBILIDAD.idle && (
                <div className={`disp-banner disp-banner--${disponibilidad}`} style={{ gridColumn: "span 2" }}>
                  {disponibilidad === DISPONIBILIDAD.checking && (
                    <>
                      <span className="disp-spinner" />
                      Verificando disponibilidad…
                    </>
                  )}
                  {disponibilidad === DISPONIBILIDAD.available && (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {mensajeDisp}
                    </>
                  )}
                  {disponibilidad === DISPONIBILIDAD.unavailable && (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      {mensajeDisp}
                    </>
                  )}
                </div>
              )}

              <div className="form-group" style={{ gridColumn: "span 2" }}>
                <label>Cantidad de asistentes</label>
                <input type="number" min="1" max={modalEspacio.capacidad}
                  placeholder={`Máx. ${modalEspacio.capacidad}`}
                  value={reservaForm.cantidad_asistentes}
                  onChange={e => setReservaForm({ ...reservaForm, cantidad_asistentes: e.target.value })} required />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-ghost" onClick={cerrarModal}>Cancelar</button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={!puedeConfirmar}
                  style={{ opacity: puedeConfirmar ? 1 : 0.5, cursor: puedeConfirmar ? "pointer" : "not-allowed" }}
                >
                  Confirmar reserva
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default Espacios
