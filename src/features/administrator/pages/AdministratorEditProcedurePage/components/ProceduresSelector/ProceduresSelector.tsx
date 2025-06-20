"use client"

import {useState} from "react";
import styles from "./ProceduresSelector.module.scss";
import {ProcedureTypeResponse} from "../../../../../../types/ProcedureTypeResponse.interface.ts";

interface ProcedureSelectorProps {
  procedures: ProcedureTypeResponse[]
  onSelectProcedure: (procedure: ProcedureTypeResponse) => void
  onCancel?: () => void
}

export default function ProceduresSelector({procedures, onSelectProcedure, onCancel}: ProcedureSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<"all" | "active" | "inactive">("all")

  const filteredProcedures = procedures.filter((procedure) => {
    const matchesSearch =
      procedure.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      procedure.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "active" && procedure.active) ||
      (selectedStatus === "inactive" && !procedure.active)

    return matchesSearch && matchesStatus
  })

  return (
    <article className={styles.mainContainer}>
      <div className={styles.container}>
        <div className={styles.selectorCard}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.iconContainer}>
              <i className={`pi pi-file-edit ${styles.icon}`}></i>
            </div>
            <div className={styles.headerContent}>
              <h1 className={styles.title}>Editar Trámites</h1>
              <p className={styles.subtitle}>Selecciona el trámite que deseas modificar</p>
            </div>
          </div>

          {/*/!* Filters *!/*/}
          {/*<div className={styles.filtersSection}>*/}
          {/*  <div className={styles.searchContainer}>*/}
          {/*    <div className={styles.searchInputContainer}>*/}
          {/*      <i className={`pi pi-search ${styles.searchIcon}`}></i>*/}
          {/*      <input*/}
          {/*        type="text"*/}
          {/*        placeholder="Buscar procedimiento por nombre o descripción..."*/}
          {/*        value={searchTerm}*/}
          {/*        onChange={(e) => setSearchTerm(e.target.value)}*/}
          {/*        className={styles.searchInput}*/}
          {/*      />*/}
          {/*    </div>*/}
          {/*  </div>*/}

          {/*  <div className={styles.statusFilter}>*/}
          {/*    <label className={styles.filterLabel}>Estado:</label>*/}
          {/*    <select*/}
          {/*      value={selectedStatus}*/}
          {/*      onChange={(e) => setSelectedStatus(e.target.value as "all" | "active" | "inactive")}*/}
          {/*      className={styles.statusSelect}*/}
          {/*    >*/}
          {/*      <option value="all">Todos</option>*/}
          {/*      <option value="active">Activos</option>*/}
          {/*      <option value="inactive">Inactivos</option>*/}
          {/*    </select>*/}
          {/*  </div>*/}
          {/*</div>*/}

          {/* Results */}
          <div className={styles.resultsSection}>
            {/*<div className={styles.resultsHeader}>*/}
            {/*  <h2 className={styles.resultsTitle}>Procedimientos Disponibles ({filteredProcedures.length})</h2>*/}
            {/*</div>*/}

            {filteredProcedures.length === 0 ? (
              <div className={styles.noResults}>
                <p className={styles.noResultsText}>
                  No se encontraron procedimientos que coincidan con los criterios de búsqueda.
                </p>
              </div>
            ) : (
              <div className={styles.proceduresList}>
                {filteredProcedures.map((procedure) => (
                  <div key={procedure.id} className={styles.procedureCard} onClick={() => onSelectProcedure(procedure)}>
                    <div className={styles.procedureHeader}>
                      <div className={styles.procedureInfo}>
                        <h3 className={styles.procedureName}>{procedure.name}</h3>
                        <span
                          className={`${styles.statusBadge} ${procedure.active ? styles.active : styles.inactive}`}
                        >
                          {procedure.active ? "Activo" : "Inactivo"}
                        </span>
                      </div>
                      <div className={styles.procedureId}>ID: {procedure.id}</div>
                    </div>

                    <p className={styles.procedureDescription}>{procedure.description}</p>

                    <div className={styles.procedureDetails}>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Costo:</span>
                        <span className={styles.detailValue}>Bs. {procedure.cost}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Duración:</span>
                        <span className={styles.detailValue}>{procedure.durationDays} días</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Pasos:</span>
                        <span className={styles.detailValue}>{procedure.steps.length}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Requisitos:</span>
                        <span className={styles.detailValue}>{procedure.requirements.length}</span>
                      </div>
                    </div>

                    <div className={styles.procedureFooter}>
                      <div className={styles.procedureDates}>
                        <span className={styles.dateText}>
                          Actualizado: {new Date(procedure.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className={styles.editButton}>
                        <i className={`pi pi-file-edit ${styles.icon}`}></i>
                        <span>Editar</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          {onCancel && (
            <div className={styles.actions}>
              <button className={styles.cancelButton} onClick={onCancel}>
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
