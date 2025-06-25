"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, Search, Clock, CheckCircle, XCircle } from "lucide-react"

export function StudentDashboard() {
  const recentWorks = [
    {
      id: 1,
      title: "Sistema de Gestión Universitaria",
      subject: "Programación Web",
      status: "approved",
      date: "2024-01-15",
    },
    {
      id: 2,
      title: "Análisis de Algoritmos de Ordenamiento",
      subject: "Estructuras de Datos",
      status: "pending",
      date: "2024-01-10",
    },
    { id: 3, title: "Base de Datos para E-commerce", subject: "Base de Datos", status: "rejected", date: "2024-01-05" },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Aprobado
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pendiente
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Rechazado
          </Badge>
        )
      default:
        return <Badge>Desconocido</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard del Estudiante</h2>
        <p className="text-gray-600">Bienvenido al sistema de gestión de trabajos académicos</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trabajos Subidos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 este mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprobados</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">8</div>
            <p className="text-xs text-muted-foreground">66.7% de aprobación</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">3</div>
            <p className="text-xs text-muted-foreground">En revisión</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rechazados</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">1</div>
            <p className="text-xs text-muted-foreground">Requiere revisión</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>Gestiona tus trabajos académicos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="bg-green-600 hover:bg-green-700 h-20 flex flex-col">
              <Upload className="h-6 w-6 mb-2" />
              Subir Nuevo Trabajo
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <FileText className="h-6 w-6 mb-2" />
              Ver Mis Trabajos
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <Search className="h-6 w-6 mb-2" />
              Buscar Trabajos
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Works */}
      <Card>
        <CardHeader>
          <CardTitle>Trabajos Recientes</CardTitle>
          <CardDescription>Tus últimos trabajos subidos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentWorks.map((work) => (
              <div key={work.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">{work.title}</h4>
                  <p className="text-sm text-gray-600">{work.subject}</p>
                  <p className="text-xs text-gray-500">{work.date}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(work.status)}
                  <Button variant="ghost" size="sm">
                    Ver
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
