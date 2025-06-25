"use client"

import {
  BookOpen,
  Upload,
  Search,
  FileText,
  Users,
  BarChart3,
  Settings,
  GraduationCap,
  Shield,
  UserCog,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SidebarProps {
  activeView: string
  setActiveView: (view: string) => void
  userRole: "student" | "works-admin" | "users-admin"
  setUserRole: (role: "student" | "works-admin" | "users-admin") => void
}

export function Sidebar({ activeView, setActiveView, userRole, setUserRole }: SidebarProps) {
  const studentMenuItems = [
    { id: "student-dashboard", label: "Dashboard", icon: BookOpen },
    { id: "upload-work", label: "Subir Trabajo", icon: Upload },
    { id: "my-works", label: "Mis Trabajos", icon: FileText },
    { id: "search-works", label: "Buscar Trabajos", icon: Search },
    { id: "profile", label: "Mi Perfil", icon: Settings },
  ]

  const worksAdminMenuItems = [
    { id: "works-admin-dashboard", label: "Dashboard", icon: BookOpen },
    { id: "manage-works", label: "Gestionar Trabajos", icon: FileText },
    { id: "pending-works", label: "Trabajos Pendientes", icon: Upload },
    { id: "advanced-search", label: "Búsqueda Avanzada", icon: Search },
    { id: "statistics", label: "Estadísticas", icon: BarChart3 },
  ]

  const usersAdminMenuItems = [
    { id: "users-admin-dashboard", label: "Dashboard", icon: Users },
    { id: "manage-users", label: "Gestionar Usuarios", icon: UserCog },
    { id: "create-user", label: "Crear Usuario", icon: Users },
    { id: "system-stats", label: "Estadísticas Sistema", icon: BarChart3 },
    { id: "settings", label: "Configuración", icon: Settings },
  ]

  const getMenuItems = () => {
    switch (userRole) {
      case "student":
        return studentMenuItems
      case "works-admin":
        return worksAdminMenuItems
      case "users-admin":
        return usersAdminMenuItems
      default:
        return studentMenuItems
    }
  }

  const getRoleIcon = () => {
    switch (userRole) {
      case "student":
        return <GraduationCap className="h-5 w-5" />
      case "works-admin":
        return <Shield className="h-5 w-5" />
      case "users-admin":
        return <UserCog className="h-5 w-5" />
    }
  }

  return (
    <div className="bg-green-800 text-white w-64 flex flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-6">
          {getRoleIcon()}
          <span className="font-semibold">Sistema Académico</span>
        </div>

        <Select
          value={userRole}
          onValueChange={(value: "student" | "works-admin" | "users-admin") => setUserRole(value)}
        >
          <SelectTrigger className="bg-green-700 border-green-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="student">Estudiante</SelectItem>
            <SelectItem value="works-admin">Admin. Trabajos</SelectItem>
            <SelectItem value="users-admin">Admin. Usuarios</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <nav className="flex-1 px-4">
        {getMenuItems().map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={activeView === item.id ? "secondary" : "ghost"}
              className={`w-full justify-start mb-2 ${
                activeView === item.id
                  ? "bg-green-700 text-white"
                  : "text-green-100 hover:bg-green-700 hover:text-white"
              }`}
              onClick={() => setActiveView(item.id)}
            >
              <Icon className="mr-3 h-4 w-4" />
              {item.label}
            </Button>
          )
        })}
      </nav>
    </div>
  )
}
