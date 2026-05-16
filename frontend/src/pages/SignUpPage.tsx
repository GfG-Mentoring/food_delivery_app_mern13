import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { AuthFormShell } from '../components/auth/AuthFormShell.tsx'
import { Button } from '../components/ui/Button.tsx'
import { TextField } from '../components/ui/TextField.tsx'
import {
  clearAuthError,
  registerUser,
  selectAuthError,
  selectAuthRequestStatus,
} from '../features/auth/authSlice.ts'
import { useAppDispatch, useAppSelector } from '../store/hooks.ts'

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function SignUpPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const apiError = useAppSelector(selectAuthError)
  const requestStatus = useAppSelector(selectAuthRequestStatus)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    dispatch(clearAuthError())
  }, [dispatch])

  const nameError =
    submitted && name.trim().length === 0 ? 'Name is required.' : undefined
  const emailError =
    submitted && email.trim().length === 0
      ? 'Email is required.'
      : submitted && !isValidEmail(email)
        ? 'Enter a valid email.'
        : undefined
  const passwordError =
    submitted && password.length < 8
      ? 'Use at least 8 characters.'
      : undefined

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    if (
      name.trim().length === 0 ||
      email.trim().length === 0 ||
      !isValidEmail(email) ||
      password.length < 8
    ) {
      return
    }
    void dispatch(
      registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
      }),
    )
      .unwrap()
      .then(() => navigate('/'))
      .catch(() => {
        /* error surfaced via slice */
      })
  }

  const isSubmitting = requestStatus === 'loading'

  return (
    <AuthFormShell
      title="Join Feastlane"
      subtitle="Create an account to save spots, faster checkout, and tailored picks."
      asideEyebrow="Onboarding"
      asideTitle="A calmer way to order in."
      asideBody="One profile for dietary notes, default tip, and drivers who find your buzzer the first time."
      footer={
        <p className="text-body">
          Already have an account?{' '}
          <Link
            to="/sign-in"
            className="font-semibold text-primary underline-offset-2 hover:underline"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <form className="flex flex-col gap-5" onSubmit={onSubmit} noValidate>
        {apiError ? (
          <p
            role="alert"
            className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {apiError}
          </p>
        ) : null}
        <TextField
          type="text"
          name="name"
          autoComplete="name"
          label="Full name"
          value={name}
          onChange={(ev) => setName(ev.target.value)}
          placeholder="Avery Kim"
          error={nameError}
        />
        <TextField
          type="email"
          name="email"
          autoComplete="email"
          label="Email"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          placeholder="you@example.com"
          error={emailError}
        />
        <TextField
          type="password"
          name="password"
          autoComplete="new-password"
          label="Password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          hint="At least 8 characters."
          error={passwordError}
        />
        <Button
          type="submit"
          className="w-full sm:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
    </AuthFormShell>
  )
}
