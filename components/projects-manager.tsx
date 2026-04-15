'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

type Project = {
  id: string
  name: string
  description: string | null
  property_id: string
  created_at: string
}

type Property = {
  id: string
  name: string
}

export default function ProjectsManager({
  initialProjects = [],
  properties = [],
  userId,
}: {
  initialProjects?: Project[]
  properties?: Property[]
  userId: string
}) {
  const supabase = createClient()
  const [projects, setProjects] = useState(initialProjects)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [propertyId, setPropertyId] = useState(properties?.[0]?.id ?? '')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!propertyId && properties.length > 0) {
      setPropertyId(properties[0].id)
    }
  }, [properties, propertyId])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!propertyId) {
      alert('Please select a property first.')
      return
    }

    setLoading(true)

    const { data, error } = await supabase
      .from('projects')
      .insert({
        user_id: userId,
        property_id: propertyId,
        name,
        description,
      })
      .select()
      .single()

    setLoading(false)

    if (error) {
      alert(error.message)
      return
    }

    setProjects((prev) => [data, ...prev])
    setName('')
    setDescription('')
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">Projects</h2>
        <p className="text-sm text-gray-600">
          Create and manage projects for a selected property.
        </p>
      </div>

      {properties.length === 0 ? (
        <div className="rounded-lg border p-4 text-sm text-gray-600">
          Add a property first before creating a project.
        </div>
      ) : (
        <form onSubmit={handleCreate} className="grid gap-3 max-w-xl rounded-lg border p-4 bg-white">
          <select
            value={propertyId}
            onChange={(e) => setPropertyId(e.target.value)}
            className="border rounded px-3 py-2"
            required
          >
            <option value="">Select property</option>
            {properties.map((property) => (
              <option key={property.id} value={property.id}>
                {property.name}
              </option>
            ))}
          </select>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Project name"
            className="border rounded px-3 py-2"
            required
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="border rounded px-3 py-2"
            rows={4}
          />

          <button
            type="submit"
            disabled={loading || !propertyId}
            className="bg-black text-white rounded px-4 py-2 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </form>
      )}

      <div className="grid gap-3">
        {projects.length === 0 ? (
          <div className="rounded-lg border p-4 text-sm text-gray-600">
            No projects yet. Create one for the selected property.
          </div>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="rounded-lg border p-4 bg-white">
              <h3 className="font-semibold">{project.name}</h3>
              <p className="text-sm text-gray-600">
                {project.description || 'No description provided.'}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  )
}

