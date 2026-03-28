'use client'

export default function SignOutButton() {
  function handleSignOut(e: React.MouseEvent) {
    if (!confirm('Sign out of the dashboard?')) {
      e.preventDefault()
    }
  }

  return (
    <a
      href="/api/auth/logout"
      onClick={handleSignOut}
      className="px-4 py-2 text-xs uppercase tracking-widest text-brand-muted hover:text-brand-text transition"
    >
      Sign Out
    </a>
  )
}
