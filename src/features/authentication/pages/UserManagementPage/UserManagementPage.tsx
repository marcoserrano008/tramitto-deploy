"use client"
import {useEffect, useState} from "react"
import styles from "./UserManagementPage.module.scss"
import {UserResponse} from "../../../../types/User.interface.ts";
import {RoleEnum} from "../../../../types/enum/Role.enum.ts";
import {RegisterRequest} from "../../../../types/RegisterRequest.interface.ts";
import {UsersByRoleAndEnabledRequest} from "../../../../types/UsersByRoleAndEnabledRequest.interface.ts";
import {getUsersByRoleAndEnabled} from "../../../../services/GetUsersByRoleAndEnabled.http.service.ts";
import {registerService} from "../../../../services/RegisterUser.http.service.ts";
import {UpdateUserRequest} from "../../../../types/UpdateUserRequest.ts";
import {updateUserService} from "../../../../services/UpdateUserService.http.service.ts";


const ROLE_LABELS: Record<RoleEnum, string> = {
  [RoleEnum.ADMINISTRATOR]: "Administrador",
  [RoleEnum.APPLICANT]: "Solicitante",
  [RoleEnum.ARCHIVES_MANAGER]: "Jefe de Archivos",
  [RoleEnum.GENERAL_SECRETARY]: "Secretario General",
}

const ROLE_COLORS: Record<RoleEnum, string> = {
  [RoleEnum.ADMINISTRATOR]: "#9333ea",
  [RoleEnum.APPLICANT]: "#10b981",
  [RoleEnum.ARCHIVES_MANAGER]: "#f97316",
  [RoleEnum.GENERAL_SECRETARY]: "#3b82f6",
}

export default function UserManagement() {
  const [users, setUsers] = useState<UserResponse[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserResponse[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [userToToggle, setUserToToggle] = useState<UserResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)


  // Formulario de nuevo usuario
  const [newUser, setNewUser] = useState<RegisterRequest>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    secondLastName: "",
    identificationNumber: "",
    sisCode: 0,
    birthdate: "",
    isIdentityValidated: false
  })

  useEffect(() => {
    loadUsers()
  }, [])

  // Función para cargar usuarios
  const loadUsers = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const request: UsersByRoleAndEnabledRequest = {
        role: undefined,
        enabled: undefined,
      }

      const data = await getUsersByRoleAndEnabled.getUsers(request)
      setUsers(data)
    } catch (err) {
      setError("Error al cargar usuarios")
      console.error("Error loading users:", err)
    } finally {
      setIsLoading(false)
    }
  }

// Filtrar usuarios
  useEffect(() => {
    let filtered = users

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.identificationNumber.includes(searchTerm),
      )
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    if (statusFilter !== "all") {
      const isEnabled = statusFilter === "enabled"
      filtered = filtered.filter((user) => user.enabled === isEnabled)
    }

    setFilteredUsers(filtered)
  }, [searchTerm, roleFilter, statusFilter, users])


  // Crear usuario
  const handleCreateUser = async () => {
    try {
      setIsLoading(true)
      setError(null)

      await registerService.register(newUser)

      // Recargar la lista de usuarios después de crear uno nuevo
      await loadUsers()

      setIsCreateDialogOpen(false)
      setNewUser({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        secondLastName: "",
        identificationNumber: "",
        sisCode: 0,
        birthdate: "",
        isIdentityValidated: false
      })
    } catch (err) {
      setError("Error al crear usuario")
      console.error("Error creating user:", err)
    } finally {
      setIsLoading(false)
    }
  }


  // Actualizar estado de usuario (habilitar/deshabilitar)
  const handleToggleUserStatus = async (user: UserResponse) => {
    try {
      setIsLoading(true)
      setError(null)

      const updateData: UpdateUserRequest = {
        enabled: !user.enabled,
      }

      const updatedUser = await updateUserService.update(user.id, updateData)

      setUsers(users.map((u) => (u.id === user.id ? updatedUser : u)))

      setUserToToggle(null)
    } catch (err) {
      setError("Error al actualizar estado del usuario")
      console.error("Error toggling user status:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Estadísticas
  const stats = {
    total: users.length,
    active: users.filter((u) => u.enabled).length,
    inactive: users.filter((u) => !u.enabled).length,
    administrators: users.filter((u) => u.role === RoleEnum.ADMINISTRATOR).length,
    applicants: users.filter((u) => u.role === RoleEnum.APPLICANT).length,
    archivesManagers: users.filter((u) => u.role === RoleEnum.ARCHIVES_MANAGER).length,
    generalSecretaries: users.filter((u) => u.role === RoleEnum.GENERAL_SECRETARY).length,
  }

  return (
    <div className={styles.container}>
      <div>
        {error && <div className="error-message">{error}</div>}
      </div>

      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <svg className={styles.headerIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <h2 className={styles.sidebarTitle}>Gestión de Usuarios</h2>
        </div>

        <div className={styles.statsSection}>
          <h3 className={styles.statsTitle}>Estadísticas</h3>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Total de Usuarios</p>
              <p className={styles.statValue}>{stats.total}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{color: "#10b981"}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Usuarios Habilitados</p>
              <p className={styles.statValue}>{stats.active}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{color: "#ef4444"}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Usuarios Deshabilitados</p>
              <p className={styles.statValue}>{stats.inactive}</p>
            </div>
          </div>

          <div className={styles.divider}/>

          <h4 className={styles.rolesTitle}>Por Rol</h4>

          <div className={styles.roleStatCard}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{color: "#9333ea"}}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span className={styles.roleStatLabel}>Administrador</span>
            <span className={styles.roleStatValue}>{stats.administrators}</span>
          </div>

          <div className={styles.roleStatCard}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{color: "#3b82f6"}}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            <span className={styles.roleStatLabel}>Secreatario General</span>
            <span className={styles.roleStatValue}>{stats.generalSecretaries}</span>
          </div>

          <div className={styles.roleStatCard}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{color: "#f97316"}}>
              <polyline points="21 8 21 21 3 21 3 8"/>
              <rect x="1" y="3" width="22" height="5"/>
              <line x1="10" y1="12" x2="14" y2="12"/>
            </svg>
            <span className={styles.roleStatLabel}>Jefe de Archivos</span>
            <span className={styles.roleStatValue}>{stats.archivesManagers}</span>
          </div>

          <div className={styles.roleStatCard}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{color: "#10b981"}}>
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span className={styles.roleStatLabel}>Solicitantes</span>
            <span className={styles.roleStatValue}>{stats.applicants}</span>
          </div>
        </div>

        <div className={styles.infoBox}>
          <p className={styles.infoText}>
            Gestiona los usuarios del sistema, asigna roles y controla el acceso a las diferentes funcionalidades.
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Administración de Usuarios</h1>
            <p className={styles.subtitle}>Gestiona los usuarios, roles y permisos del sistema</p>
          </div>

          <button className={styles.createButton} onClick={() => setIsCreateDialogOpen(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <line x1="20" y1="8" x2="20" y2="14"/>
              <line x1="23" y1="11" x2="17" y2="11"/>
            </svg>
            Crear Usuario
          </button>
        </div>

        {/* Filtros */}
        <div className={styles.filtersCard}>
          <div className={styles.filters}>
            <div className={styles.searchWrapper}>
              <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Buscar por nombre, email o CI..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className={styles.filterSelect}>
              <option value="all">Todos los roles</option>
              {Object.entries(ROLE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">Todos los estados</option>
              <option value="enabled">Activos</option>
              <option value="disabled">Inactivos</option>
            </select>
          </div>
        </div>

        {/* Tabla de usuarios */}
        <div className={styles.tableCard}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
              <tr>
                <th>Usuario</th>
                <th>Rol</th>
                <th>CI</th>
                <th>Código SIS</th>
                <th>Estado</th>
                <th>Validación</th>
                <th className={styles.textRight}>Acciones</th>
              </tr>
              </thead>
              <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className={styles.emptyState}>
                    No se encontraron usuarios
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className={!user.enabled ? styles.disabledRow : ""}>
                    <td>
                      <div className={styles.userCell}>
                        <div>
                          <p className={styles.userName}>
                            {user.firstName} {user.lastName} {user.secondLastName}
                          </p>
                          <p className={styles.userEmail}>{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                        <span className={styles.roleBadge} style={{backgroundColor: ROLE_COLORS[user.role]}}>
                          {ROLE_LABELS[user.role]}
                        </span>
                    </td>
                    <td>{user.identificationNumber}</td>
                    <td>{user.sisCode || "-"}</td>
                    <td>
                      {user.enabled ? (
                        <span className={styles.statusActive}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                              <polyline points="22 4 12 14.01 9 11.01"/>
                            </svg>
                            Activo
                          </span>
                      ) : (
                        <span className={styles.statusInactive}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <circle cx="12" cy="12" r="10"/>
                              <line x1="15" y1="9" x2="9" y2="15"/>
                              <line x1="9" y1="9" x2="15" y2="15"/>
                            </svg>
                            Inactivo
                          </span>
                      )}
                    </td>
                    <td>
                      {user.isIdentityValidated ? (
                        <span className={styles.validatedBadge}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                              <polyline points="22 4 12 14.01 9 11.01"/>
                            </svg>
                            Validado
                          </span>
                      ) : (
                        <span className={styles.notValidatedBadge}>Pendiente</span>
                      )}
                    </td>
                    <td className={styles.textRight}>
                      <div className={styles.dropdownWrapper}>
                        <button
                          className={styles.dropdownTrigger}
                          onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="12" cy="12" r="1"/>
                            <circle cx="12" cy="5" r="1"/>
                            <circle cx="12" cy="19" r="1"/>
                          </svg>
                        </button>
                        {activeDropdown === user.id && (
                          <div className={styles.dropdownMenu}>
                            <button
                              className={styles.dropdownItem}
                              onClick={() => {
                                setUserToToggle(user)
                                setActiveDropdown(null)
                              }}
                            >
                              {user.enabled ? (
                                <>
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10"/>
                                    <line x1="15" y1="9" x2="9" y2="15"/>
                                    <line x1="9" y1="9" x2="15" y2="15"/>
                                  </svg>
                                  Deshabilitar
                                </>
                              ) : (
                                <>
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                    <polyline points="22 4 12 14.01 9 11.01"/>
                                  </svg>
                                  Habilitar
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.resultsInfo}>
          Mostrando {filteredUsers.length} de {users.length} usuarios
        </div>
      </main>

      {/* Modal de crear usuario */}
      {isCreateDialogOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsCreateDialogOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Crear Nuevo Usuario</h2>
              <p className={styles.modalDescription}>
                Completa la información para registrar un nuevo usuario en el sistema
              </p>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="firstName">Nombre *</label>
                <input
                  id="firstName"
                  type="text"
                  value={newUser.firstName}
                  onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                  placeholder="Ej: Juan"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="lastName">Apellido Paterno *</label>
                <input
                  id="lastName"
                  type="text"
                  value={newUser.lastName}
                  onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                  placeholder="Ej: Pérez"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="secondLastName">Apellido Materno</label>
                <input
                  id="secondLastName"
                  type="text"
                  value={newUser.secondLastName}
                  onChange={(e) => setNewUser({...newUser, secondLastName: e.target.value})}
                  placeholder="Ej: García"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="identificationNumber">Carnet de Identidad *</label>
                <input
                  id="identificationNumber"
                  type="text"
                  value={newUser.identificationNumber}
                  onChange={(e) => setNewUser({...newUser, identificationNumber: e.target.value})}
                  placeholder="Ej: 1234567"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Correo Electrónico *</label>
                <input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder="usuario@umss.edu.bo"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password">Contraseña *</label>
                <input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  placeholder="••••••••"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="birthdate">Fecha de Nacimiento *</label>
                <input
                  id="birthdate"
                  type="date"
                  value={newUser.birthdate}
                  onChange={(e) => setNewUser({...newUser, birthdate: e.target.value})}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="sisCode">Código SIS</label>
                <input
                  id="sisCode"
                  type="number"
                  value={newUser.sisCode || ""}
                  onChange={(e) =>
                    setNewUser({...newUser, sisCode: e.target.value ? Number.parseInt(e.target.value) : 0})
                  }
                  placeholder="Ej: 202101234"
                />
              </div>

              {/*<div className={styles.formGroupFull}>*/}
              {/*  <label htmlFor="role">Rol *</label>*/}
              {/*  <select*/}
              {/*    id="role"*/}
              {/*    value={newUser.role}*/}
              {/*    onChange={(e) => setNewUser({...newUser, role: e.target.value as RoleEnum})}*/}
              {/*  >*/}
              {/*    {Object.entries(ROLE_LABELS).map(([key, label]) => (*/}
              {/*      <option key={key} value={key}>*/}
              {/*        {label}*/}
              {/*      </option>*/}
              {/*    ))}*/}
              {/*  </select>*/}
              {/*</div>*/}
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.buttonSecondary}
                onClick={() => setIsCreateDialogOpen(false)}
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                className={styles.buttonPrimary}
                onClick={handleCreateUser}
                disabled={isLoading || !newUser.email || !newUser.password || !newUser.firstName || !newUser.lastName}
              >
                {isLoading ? "Creando..." : "Crear Usuario"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación */}
      {userToToggle && (
        <div className={styles.modalOverlay} onClick={() => setUserToToggle(null)}>
          <div className={styles.alertDialog} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.alertTitle}>
              {userToToggle.enabled ? "¿Deshabilitar usuario?" : "¿Habilitar usuario?"}
            </h3>
            <p className={styles.alertDescription}>
              {userToToggle.enabled ? (
                <>
                  Estás a punto de deshabilitar a{" "}
                  <strong>
                    {userToToggle.firstName} {userToToggle.lastName}
                  </strong>
                  . El usuario no podrá acceder al sistema hasta que sea habilitado nuevamente.
                </>
              ) : (
                <>
                  Estás a punto de habilitar a{" "}
                  <strong>
                    {userToToggle.firstName} {userToToggle.lastName}
                  </strong>
                  . El usuario podrá acceder al sistema nuevamente.
                </>
              )}
            </p>
            <div className={styles.alertFooter}>
              <button className={styles.buttonSecondary} onClick={() => setUserToToggle(null)} disabled={isLoading}>
                Cancelar
              </button>
              <button
                className={styles.buttonPrimary}
                onClick={() => handleToggleUserStatus(userToToggle)}
                disabled={isLoading}
              >
                {isLoading ? "Procesando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
