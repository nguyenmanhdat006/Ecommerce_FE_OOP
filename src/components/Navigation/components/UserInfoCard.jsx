export function UserInfoCard({ user }) {
  const initials = user
    ? user.firstName && user.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : user.email?.[0].toUpperCase()
    : "U"

  const name = user
    ? user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.email || "User"
    : "User"

  return (
    <div className="flex items-center gap-3 p-3 border rounded-md">
      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
        <span className="text-sm font-semibold text-primary">{initials}</span>
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{name}</p>
        {user?.email && (
          <p className="text-xs text-muted-foreground">{user.email}</p>
        )}
      </div>
    </div>
  )
}

