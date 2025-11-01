import React from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"

export function UserDropdown({ user, onLogout }) {
  const navigate = useNavigate()

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

  const handleNavigate = (path) => () => navigate(path)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-11 w-11 rounded-full p-0">
          <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">{initials}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{name}</p>
            {user?.email && (
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleNavigate("/profile")}>
          <User className="mr-2 h-4 w-4" /> <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleNavigate("/settings")}>
          <Settings className="mr-2 h-4 w-4" /> <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} className="text-red-600 focus:text-red-600">
          <LogOut className="mr-2 h-4 w-4" /> <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
