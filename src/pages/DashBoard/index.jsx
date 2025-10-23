import React from "react"
import { Outlet } from "react-router-dom"
import { DashboardLayout } from "@/layout/DashBoard"

export function Dashboard() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  )
}
