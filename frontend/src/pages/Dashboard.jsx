import { useState } from "react"
import Espacios from "./Espacios"
import Usuarios from "./Usuarios"
import Reservas from "./Reservas"
import "./dashboard.css"

const NAV_ITEMS = [
  {
    key: "espacios",
    label: "Espacios",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/>
        <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/>
        <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/>
      </svg>
    )
  },
  {
    key: "reservas",
    label: "Reservas",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
        <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
      </svg>
    )
  },
  {
    key: "usuarios",
    label: "Usuarios",
    adminOnly: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
]

function Dashboard({ rol, setToken }) {
  const [vista, setVista] = useState("espacios")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const cerrarSesion = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("rol")
    setToken(null)
    window.location.reload()
  }

  const navItems = NAV_ITEMS.filter(
    item => !item.adminOnly || rol === "admin"
  )

  return (
    <div className="dashboard">

      {/* ── Sidebar ── */}
      <aside className={`sidebar ${sidebarOpen ? "sidebar--open" : ""}`}>

        <div className="sidebar__header">
          <div className="sidebar__logo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="9 22 9 12 15 12 15 22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="sidebar__brand">
            <span className="sidebar__brand-name">Reservas</span>
            <span className="sidebar__brand-sub">Sistema de gestión</span>
          </div>
        </div>

        <nav className="sidebar__nav">
          {navItems.map(item => (
            <button
              key={item.key}
              className={`sidebar__nav-item ${vista === item.key ? "sidebar__nav-item--active" : ""}`}
              onClick={() => { setVista(item.key); setSidebarOpen(false) }}
            >
              <span className="sidebar__nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__user">
            <div className="sidebar__user-avatar">
              {rol === "admin" ? "A" : "U"}
            </div>
            <div className="sidebar__user-info">
              <span className="sidebar__user-role">
                {rol === "admin" ? "Administrador" : "Usuario"}
              </span>
              <span className="sidebar__user-badge">
                {rol}
              </span>
            </div>
          </div>

          <button className="sidebar__logout" onClick={cerrarSesion}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Cerrar sesión
          </button>
        </div>

      </aside>

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div className="sidebar__overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Main area ── */}
      <div className="dashboard__main">

        <header className="topbar">
          <button
            className="topbar__menu-btn btn-ghost"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="3" y1="6"  x2="21" y2="6"  stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          <h2 className="topbar__title">
            {navItems.find(i => i.key === vista)?.label}
          </h2>

          <div className="topbar__actions">
            <span className={`badge ${rol === "admin" ? "badge-blue" : "badge-green"}`}>
              {rol}
            </span>
          </div>
        </header>

        <main className="dashboard__content">
          {vista === "espacios"  && <Espacios />}
          {vista === "usuarios"  && <Usuarios />}
          {vista === "reservas"  && <Reservas />}
        </main>

      </div>

    </div>
  )
}

export default Dashboard
