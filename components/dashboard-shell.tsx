'use client'

import { useMemo, useState } from 'react'
import PropertiesManager from '@/components/properties-manager'
import ProjectsManager from '@/components/projects-manager'

type Property = {
  id: string
  name: string
  address: string | null
  city: string | null
  state: string | null
  created_at: string
}

type Project = {
  id: string
  name: string
  description: string | null
  property_id: string
  created_at: string
}

export default function DashboardShell({
  initialProperties,
  initialProjects,
  userId,
}: {
  initialProperties: Property[]
  initialProjects: Project[]
  userId: string
}) {
  const [properties] = useState<Property[]>(initialProperties)
  const [projects] = useState<Project[]>(initialProjects)
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    initialProperties[0]?.id ?? null,
  )

  const selectedProperty = useMemo(
    () => properties.find((p) => p.id === selectedPropertyId) ?? null,
    [properties, selectedPropertyId],
  )

  const selectedPropertyProjects = useMemo(
    () =>
      selectedProperty
        ? projects.filter((project) => project.property_id === selectedProperty.id)
        : [],
    [projects, selectedProperty],
  )

  const urgentAlerts = useMemo(() => {
    if (!selectedProperty) return []

    return [
      'Check drainage flow and low spots near the structure.',
      'Review roof runoff, gutter discharge, and erosion patterns.',
      'Document recurring moisture, vegetation, or structural concerns.',
    ]
  }, [selectedProperty])

  return (
    <main className="min-h-screen max-w-6xl mx-auto space-y-8 bg-black px-6 py-8 text-white">
      <header className="flex items-baseline justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-400">
            Signed in as <span className="font-medium text-gray-200">{userId}</span>
          </p>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
          <p className="text-xs uppercase tracking-wide text-gray-400">Total Properties</p>
          <p className="mt-2 text-3xl font-semibold">{properties.length}</p>
          <p className="mt-2 text-sm text-gray-500">Tracked land and dwelling records</p>
        </div>

        <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
          <p className="text-xs uppercase tracking-wide text-gray-400">Total Projects</p>
          <p className="mt-2 text-3xl font-semibold">{projects.length}</p>
          <p className="mt-2 text-sm text-gray-500">Maintenance and improvement work items</p>
        </div>

        <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
          <p className="text-xs uppercase tracking-wide text-gray-400">Urgent Watch Items</p>
          <p className="mt-2 text-3xl font-semibold">{urgentAlerts.length}</p>
          <p className="mt-2 text-sm text-gray-500">Preventive checks needing attention</p>
        </div>

        <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
          <p className="text-xs uppercase tracking-wide text-gray-400">Selected Property</p>
          <p className="mt-2 text-lg font-semibold">
            {selectedProperty ? selectedProperty.name : 'None selected'}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            {selectedProperty
              ? `${selectedProperty.address ?? ''}${
                  selectedProperty.city ? `, ${selectedProperty.city}` : ''
                }${selectedProperty.state ? `, ${selectedProperty.state}` : ''}`
              : 'Click a property card to focus it'}
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
        <div className="rounded-xl border border-gray-800 bg-zinc-950 p-5 space-y-5">
          <div>
            <h2 className="text-2xl font-semibold">Property Snapshot</h2>
            <p className="text-sm text-gray-400">
              Core awareness, diagnostics, and oversight for the focused property.
            </p>
          </div>

          {selectedProperty ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-gray-800 bg-black p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Identity</p>
                <h3 className="mt-2 text-lg font-semibold">{selectedProperty.name}</h3>
                <p className="mt-2 text-sm text-gray-400">
                  {selectedProperty.address ?? 'No address entered'}
                </p>
                <p className="text-sm text-gray-400">
                  {[selectedProperty.city, selectedProperty.state].filter(Boolean).join(', ') ||
                    'City/state missing'}
                </p>
              </div>

              <div className="rounded-lg border border-gray-800 bg-black p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Project Activity</p>
                <p className="mt-2 text-3xl font-semibold">{selectedPropertyProjects.length}</p>
                <p className="mt-2 text-sm text-gray-400">
                  Projects linked to this property record
                </p>
              </div>

              <div className="rounded-lg border border-gray-800 bg-black p-4 md:col-span-2">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Critical Oversight Areas
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-md border border-gray-800 p-3">
                    <p className="font-medium">Drainage & water movement</p>
                    <p className="text-sm text-gray-400">
                      Runoff direction, pooling, erosion, gutter discharge, grading near foundation.
                    </p>
                  </div>

                  <div className="rounded-md border border-gray-800 p-3">
                    <p className="font-medium">Roof, envelope & moisture</p>
                    <p className="text-sm text-gray-400">
                      Shingles, flashing, soffits, siding, stains, soft spots, intrusion signals.
                    </p>
                  </div>

                  <div className="rounded-md border border-gray-800 p-3">
                    <p className="font-medium">Vegetation & exterior control</p>
                    <p className="text-sm text-gray-400">
                      Tree clearance, root pressure, vine growth, pests, and access obstruction.
                    </p>
                  </div>

                  <div className="rounded-md border border-gray-800 p-3">
                    <p className="font-medium">Foundation & movement clues</p>
                    <p className="text-sm text-gray-400">
                      Settlement, cracking, sticking openings, slope change, and repeat movement.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-gray-800 bg-black p-4 text-sm text-gray-400">
              Select a property to view focused oversight details.
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="rounded-xl border border-gray-800 bg-zinc-950 p-5">
            <p className="text-xs uppercase tracking-wide text-gray-500">Active watch list</p>

            {urgentAlerts.length > 0 ? (
              <ul className="mt-3 space-y-3 text-sm text-gray-300">
                {urgentAlerts.map((alert) => (
                  <li key={alert} className="rounded-md border border-gray-800 bg-black p-3">
                    {alert}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-3 rounded-lg border border-gray-800 bg-black p-4 text-sm text-gray-400">
                No active watch items yet. Add and select a property to start surfacing oversight
                needs.
              </div>
            )}
          </div>

          <div className="rounded-xl border border-gray-800 bg-zinc-950 p-5">
            <p className="text-xs uppercase tracking-wide text-gray-500">History & awareness</p>
            <ul className="mt-3 space-y-2 text-sm text-gray-400">
              <li>Track recurring issues, storm impact, inspections, and repairs.</li>
              <li>Log changes in grading, moisture, vegetation, and structural condition.</li>
              <li>Flag anything that is getting worse, repeating, or overdue.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)]">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Properties</h2>
          <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4 space-y-4">
            <PropertiesManager initialProperties={properties} userId={userId} />
          </div>

          <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
            <p className="text-sm text-gray-400">Click a property below to focus the dashboard.</p>
            <div className="mt-4 grid gap-3">
              {properties.length > 0 ? (
                properties.map((property) => (
                  <button
                    key={property.id}
                    type="button"
                    onClick={() => setSelectedPropertyId(property.id)}
                    className={`rounded-lg border p-4 text-left transition ${
                      selectedPropertyId === property.id
                        ? 'border-white bg-white text-black'
                        : 'border-gray-800 bg-black text-white hover:border-gray-600'
                    }`}
                  >
                    <p className="font-medium">{property.name}</p>
                    <p
                      className={`mt-1 text-sm ${
                        selectedPropertyId === property.id ? 'text-gray-700' : 'text-gray-400'
                      }`}
                    >
                      {[property.address, property.city, property.state]
                        .filter(Boolean)
                        .join(', ') || 'No location details yet'}
                    </p>
                  </button>
                ))
              ) : (
                <div className="rounded-lg border border-gray-800 bg-black p-4 text-sm text-gray-400">
                  No properties yet.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Projects</h2>
          <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4 space-y-4">
            <ProjectsManager
              initialProjects={projects}
              properties={properties}
              userId={userId}
            />
          </div>
        </div>
      </section>
    </main>
  )
}
