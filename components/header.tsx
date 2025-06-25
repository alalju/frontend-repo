"use client"

import { Bell, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface HeaderProps {
  userRole: "student" | "works-admin" | "users-admin"
}

export function Header({ userRole }: HeaderProps) {
  const getRoleTitle = () => {
    switch (userRole) {
      case "student":
        return "Portal del Estudiante"
      case "works-admin":
        return "Administración de Trabajos"
      case "users-admin":
        return "Administración de Usuarios"
      default:
        return "Sistema Académico"
    }
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-green-800">Universidad Verde</h1>
          <p className="text-sm text-gray-600">{getRoleTitle()}</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Buscar trabajos..." className="pl-10 w-64" />
          </div>

          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs">3</Badge>
          </Button>

          <Button variant="ghost" size="sm">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
