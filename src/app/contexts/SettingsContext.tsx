"use client"

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react"
import { getSettings } from "../admin/actions/settings"

const SettingsContext = createContext<SettingsContextProps | undefined>(
  undefined
)

export const useSettings = () => {
  const context = useContext(SettingsContext)

  if (!context)
    throw new Error("useSettings must be used within a SettingsProvider")

  return context
}

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const [settings, setSettings] = useState<Settings | null>(null)

  const fetchSettings = async () => {
    const response = await getSettings()

    setSettings(response as Settings)
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  if (settings === null) return

  return (
    <SettingsContext.Provider
      value={{ settings, refreshSettings: fetchSettings }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

type Settings = {
  metric: "miles" | "km"
  percent: number
}

type SettingsContextProps = {
  settings: Settings
  refreshSettings: () => void
}

type SettingsProviderProps = {
  children: ReactNode
}
