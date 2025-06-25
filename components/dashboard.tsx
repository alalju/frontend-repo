"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { StudentDashboard } from "./student-dashboard"
import { WorksAdminDashboard } from "./works-admin-dashboard"
import { UsersAdminDashboard } from "./users-admin-dashboard"

export function Dashboard() {
  const [activeView, setActiveView] = useState("student-dashboard")
  const [userRole, setUserRole] = useState<"student" | "works-admin" | "users-admin">("student")

  const renderContent = () => {
    switch (activeView) {
      case "student-dashboard":
        return <StudentDashboard />
      case "works-admin-dashboard":
        return <WorksAdminDashboard />
      case "users-admin-dashboard":
        return <UsersAdminDashboard />
      default:
        return <StudentDashboard />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeView={activeView} setActiveView={setActiveView} userRole={userRole} setUserRole={setUserRole} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userRole={userRole} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">{renderContent()}</main>
      </div>
    </div>
  )
}
