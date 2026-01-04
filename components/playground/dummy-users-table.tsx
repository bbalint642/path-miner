"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import styles from "./dummy-users-table.module.css"

type Subscription = "basic" | "pro" | "enterprise"

type UserRow = {
  id: number
  firstName: string
  lastName: string
  birthDate: string // YYYY-MM-DD
  subscription: Subscription
}

const DUMMY_USERS: UserRow[] = [
  { id: 1001, firstName: "John", lastName: "Doe", birthDate: "1991-02-14", subscription: "pro" },
  { id: 1002, firstName: "Jane", lastName: "Doe", birthDate: "1993-09-03", subscription: "basic" },
  { id: 1003, firstName: "Alice", lastName: "Johnson", birthDate: "1988-11-22", subscription: "enterprise" },
  { id: 1004, firstName: "Bob", lastName: "Smith", birthDate: "2000-05-09", subscription: "basic" },
  { id: 1005, firstName: "Charlie", lastName: "Brown", birthDate: "1994-01-28", subscription: "pro" },
  { id: 1006, firstName: "Emily", lastName: "Davis", birthDate: "1999-07-16", subscription: "basic" },
  { id: 1007, firstName: "Michael", lastName: "Wilson", birthDate: "1985-03-30", subscription: "enterprise" },
  { id: 1008, firstName: "Sarah", lastName: "Taylor", birthDate: "1992-12-07", subscription: "pro" },
  { id: 1009, firstName: "David", lastName: "Miller", birthDate: "1997-10-19", subscription: "basic" },
  { id: 1010, firstName: "Olivia", lastName: "Anderson", birthDate: "1989-06-01", subscription: "enterprise" },
  { id: 1011, firstName: "Daniel", lastName: "Thomas", birthDate: "2002-04-12", subscription: "basic" },
  { id: 1012, firstName: "Sophia", lastName: "Martin", birthDate: "1990-08-25", subscription: "pro" },
]

function toTime(birthDate: string) {
  // Birthdate is a date-only string (YYYY-MM-DD). Append 'T00:00:00Z' to keep it stable across locales.
  return new Date(`${birthDate}T00:00:00Z`).getTime()
}

function getAge(birthDate: string) {
  const birth = new Date(`${birthDate}T00:00:00Z`)
  const today = new Date()
  let age = today.getUTCFullYear() - birth.getUTCFullYear()
  const m = today.getUTCMonth() - birth.getUTCMonth()
  if (m < 0 || (m === 0 && today.getUTCDate() < birth.getUTCDate())) age -= 1
  return age
}

type SortMode = "none" | "name-asc" | "name-desc" | "birth-asc" | "birth-desc"

const DEFAULT_VISIBLE_COLUMNS = {
  id: true,
  firstName: true,
  lastName: true,
  age: true,
  birthDate: true,
  subscription: true,
} as const

type ColumnKey = keyof typeof DEFAULT_VISIBLE_COLUMNS

const COLUMN_LABELS: Record<ColumnKey, string> = {
  id: "ID",
  firstName: "First name",
  lastName: "Last name",
  age: "Age",
  birthDate: "Birth date",
  subscription: "Subscription",
}

export default function DummyUsersTable() {
  const [sortMode, setSortMode] = React.useState<SortMode>("none")
  const [nameQuery, setNameQuery] = React.useState("")
  const [idQuery, setIdQuery] = React.useState("")
  const [visibleColumns, setVisibleColumns] = React.useState<Record<ColumnKey, boolean>>({
    ...DEFAULT_VISIBLE_COLUMNS,
  })

  const rows = React.useMemo(() => {
    const nq = nameQuery.trim().toLowerCase()
    const iq = idQuery.trim()

    const filtered = DUMMY_USERS.filter((u) => {
      const nameMatches =
        !nq ||
        u.firstName.toLowerCase().includes(nq) ||
        u.lastName.toLowerCase().includes(nq)
      const idMatches = !iq || String(u.id).includes(iq)
      return nameMatches && idMatches
    })

    const sorted = [...filtered]
    const nameCompare = (a: UserRow, b: UserRow) => {
      const ln = a.lastName.localeCompare(b.lastName, "en", { sensitivity: "base" })
      if (ln !== 0) return ln
      const fn = a.firstName.localeCompare(b.firstName, "en", { sensitivity: "base" })
      if (fn !== 0) return fn
      return a.id - b.id
    }

    if (sortMode === "name-asc") sorted.sort(nameCompare)
    if (sortMode === "name-desc") sorted.sort((a, b) => -nameCompare(a, b))
    if (sortMode === "birth-asc") sorted.sort((a, b) => toTime(a.birthDate) - toTime(b.birthDate))
    if (sortMode === "birth-desc") sorted.sort((a, b) => toTime(b.birthDate) - toTime(a.birthDate))

    return sorted
  }, [idQuery, nameQuery, sortMode])

  const visibleColumnKeys = React.useMemo(
    () =>
      (Object.keys(DEFAULT_VISIBLE_COLUMNS) as ColumnKey[]).filter((k) => visibleColumns[k]),
    [visibleColumns],
  )

  const canReset =
    sortMode !== "none" ||
    nameQuery.trim().length > 0 ||
    idQuery.trim().length > 0 ||
    visibleColumnKeys.length !== (Object.keys(DEFAULT_VISIBLE_COLUMNS) as ColumnKey[]).length

  function resetAll() {
    setSortMode("none")
    setNameQuery("")
    setIdQuery("")
    setVisibleColumns({ ...DEFAULT_VISIBLE_COLUMNS })
  }

  return (
    <Card id="dummyUsersTableCard" className={`w-full ${styles.card}`}>
      <CardContent className={styles.content}>
        <div className={styles.toolbar} aria-label="Table filters">
          <div className={styles.control}>
            <Label htmlFor="dummyUsersSort">Sort</Label>
            <Select value={sortMode} onValueChange={(v) => setSortMode(v as SortMode)}>
              <SelectTrigger id="dummyUsersSort" className={styles.selectTrigger}>
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="name-asc">Name (A–Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z–A)</SelectItem>
                <SelectItem value="birth-asc">Birth date (older → newer)</SelectItem>
                <SelectItem value="birth-desc">Birth date (newer → older)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={styles.control}>
            <Label htmlFor="dummyUsersNameSearch">Search by name</Label>
            <Input
              id="dummyUsersNameSearch"
              value={nameQuery}
              onChange={(e) => setNameQuery(e.target.value)}
              placeholder="first name / last name"
            />
          </div>

          <div className={styles.control}>
            <Label htmlFor="dummyUsersIdSearch">Search by ID</Label>
            <Input
              id="dummyUsersIdSearch"
              value={idQuery}
              onChange={(e) => setIdQuery(e.target.value)}
              placeholder="e.g. 1003"
              inputMode="numeric"
            />
          </div>

          <div className={styles.controlRight}>
            <Button
              id="dummyUsersResetFilters"
              type="button"
              variant="outline"
              className={styles.resetButton}
              onClick={resetAll}
              disabled={!canReset}
            >
              Clear filters
            </Button>
          </div>
        </div>

        <div className={styles.columnsBlock} aria-label="Column selector">
          <p className={styles.columnsTitle}>Columns</p>
          <div className={styles.columnsGrid}>
            {(Object.keys(DEFAULT_VISIBLE_COLUMNS) as ColumnKey[]).map((key) => {
              const id = `dummyUsersCol-${key}`
              const checked = visibleColumns[key]
              return (
                <div key={key} className={styles.columnToggle}>
                  <Checkbox
                    id={id}
                    checked={checked}
                    onCheckedChange={(next) =>
                      setVisibleColumns((prev) => ({ ...prev, [key]: Boolean(next) }))
                    }
                  />
                  <Label htmlFor={id} className={styles.columnToggleLabel}>
                    {COLUMN_LABELS[key]}
                  </Label>
                </div>
              )
            })}
          </div>
        </div>

        <div className={styles.tableShell}>
          <Table>
            <TableHeader>
              <TableRow>
                {visibleColumns.id ? <TableHead>ID</TableHead> : null}
                {visibleColumns.firstName ? <TableHead>First name</TableHead> : null}
                {visibleColumns.lastName ? <TableHead>Last name</TableHead> : null}
                {visibleColumns.age ? <TableHead>Age</TableHead> : null}
                {visibleColumns.birthDate ? <TableHead>Birth date</TableHead> : null}
                {visibleColumns.subscription ? <TableHead>Subscription</TableHead> : null}
              </TableRow>
            </TableHeader>

            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={visibleColumnKeys.length || 1} className={styles.emptyCell}>
                    <Empty className={styles.empty}>
                      <EmptyHeader>
                        <EmptyTitle>No results</EmptyTitle>
                        <EmptyDescription>Try clearing filters or adjusting your search.</EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((u) => (
                  <TableRow key={u.id}>
                    {visibleColumns.id ? <TableCell>{u.id}</TableCell> : null}
                    {visibleColumns.firstName ? <TableCell>{u.firstName}</TableCell> : null}
                    {visibleColumns.lastName ? <TableCell>{u.lastName}</TableCell> : null}
                    {visibleColumns.age ? <TableCell>{getAge(u.birthDate)}</TableCell> : null}
                    {visibleColumns.birthDate ? <TableCell>{u.birthDate}</TableCell> : null}
                    {visibleColumns.subscription ? <TableCell>{u.subscription}</TableCell> : null}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <CardFooter className={styles.footer}>
        <p className={styles.footerText}>
          Results: <strong>{rows.length}</strong> / {DUMMY_USERS.length}
        </p>
      </CardFooter>
    </Card>
  )
}


