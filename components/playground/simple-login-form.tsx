"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import styles from "./simple-login-form.module.css"

export default function SimpleLoginForm() {
  const [username, setUsername] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [fieldErrors, setFieldErrors] = React.useState<{
    username?: string
    password?: string
  }>({})
  const [status, setStatus] = React.useState<"success" | "error" | null>(null)
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null)
  const clearSuccessTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const clearFieldErrorsTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const resetFeedback = React.useCallback(() => {
    setStatus(null)
    setStatusMessage(null)
    if (clearSuccessTimerRef.current) {
      clearTimeout(clearSuccessTimerRef.current)
      clearSuccessTimerRef.current = null
    }
  }, [])

  const scheduleClearFieldErrors = React.useCallback(() => {
    if (clearFieldErrorsTimerRef.current) {
      clearTimeout(clearFieldErrorsTimerRef.current)
      clearFieldErrorsTimerRef.current = null
    }
    clearFieldErrorsTimerRef.current = setTimeout(() => {
      setFieldErrors({})
      clearFieldErrorsTimerRef.current = null
    }, 2500)
  }, [])

  const stopClearFieldErrorsTimer = React.useCallback(() => {
    if (clearFieldErrorsTimerRef.current) {
      clearTimeout(clearFieldErrorsTimerRef.current)
      clearFieldErrorsTimerRef.current = null
    }
  }, [])

  React.useEffect(() => {
    return () => {
      if (clearSuccessTimerRef.current) {
        clearTimeout(clearSuccessTimerRef.current)
      }
      if (clearFieldErrorsTimerRef.current) {
        clearTimeout(clearFieldErrorsTimerRef.current)
      }
    }
  }, [])

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const nextErrors: { username?: string; password?: string } = {}
    if (!username.trim()) nextErrors.username = "Username is required."
    if (!password) nextErrors.password = "Password is required."

    setFieldErrors(nextErrors)
    resetFeedback()

    if (nextErrors.username || nextErrors.password) {
      scheduleClearFieldErrors()
      return
    }

    if (username === "dummy_user" && password === "dummypass") {
      setStatus("success")
      setStatusMessage("Login successful")
      clearSuccessTimerRef.current = setTimeout(() => {
        setStatusMessage(null)
        setStatus(null)
        clearSuccessTimerRef.current = null
      }, 2500)
      return
    }

    setStatus("error")
    setStatusMessage("Login unsuccessful")
    clearSuccessTimerRef.current = setTimeout(() => {
      setStatusMessage(null)
      setStatus(null)
      clearSuccessTimerRef.current = null
    }, 2500)
  }

  return (
    <Card
      className={`mx-auto w-full max-w-md ${styles.card} ${
        status === "success" ? styles.cardSuccess : status === "error" ? styles.cardError : ""
      }`}
    >
      <CardHeader>
        <div className={styles.headerRow}>
          <CardTitle className={styles.headerTitle}>Login</CardTitle>
          <div className={styles.statusSlot}>
            {statusMessage ? (
              <p
                className={`${styles.statusPill} ${
                  status === "success" ? styles.statusPillSuccess : styles.statusPillError
                }`}
                role="status"
              >
                {statusMessage}
              </p>
            ) : null}
          </div>
          <div aria-hidden className={styles.headerSpacer} />
        </div>
      </CardHeader>

      <CardContent>
        <form className="grid gap-4" onSubmit={onSubmit} noValidate>
          <div className="grid gap-2">
            <Label htmlFor="username">User name</Label>
            <Input
              id="username"
              name="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                setFieldErrors((prev) => ({ ...prev, username: undefined }))
                stopClearFieldErrorsTimer()
                resetFeedback()
              }}
              autoComplete="username"
              placeholder="Enter your user name"
              required
              aria-invalid={!!fieldErrors.username}
            />
            <p
              className={`${styles.fieldErrorSlot} ${fieldErrors.username ? styles.fieldErrorVisible : ""}`}
              role={fieldErrors.username ? "alert" : undefined}
              aria-hidden={!fieldErrors.username}
            >
              {fieldErrors.username ?? "\u00A0"}
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setFieldErrors((prev) => ({ ...prev, password: undefined }))
                stopClearFieldErrorsTimer()
                resetFeedback()
              }}
              autoComplete="current-password"
              placeholder="Enter your password"
              required
              aria-invalid={!!fieldErrors.password}
            />
            <p
              className={`${styles.fieldErrorSlot} ${fieldErrors.password ? styles.fieldErrorVisible : ""}`}
              role={fieldErrors.password ? "alert" : undefined}
              aria-hidden={!fieldErrors.password}
            >
              {fieldErrors.password ?? "\u00A0"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="rememberMe" name="rememberMe" />
            <Label htmlFor="rememberMe" className="text-sm font-normal text-muted-foreground">
              Remember me
            </Label>
          </div>

          <Button id="signInButton" type="submit" className={`w-full ${styles.signInButton}`}>
            Sign in
          </Button>
        </form>
      </CardContent>

      <CardFooter>
        <div className={styles.footer}>
          <div className={styles.dummyCreds}>
            <p className={styles.footerTitle}>Dummy login credentials:</p>
            <dl className={styles.credsList}>
              <div className={styles.credsRow}>
                <dt>username</dt>
                <dd>dummy_user</dd>
              </div>
              <div className={styles.credsRow}>
                <dt>password</dt>
                <dd>dummypass</dd>
              </div>
            </dl>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}


