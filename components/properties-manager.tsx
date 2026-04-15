'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

type Property = {
  id: string
  name: string
  address: string | null
  city: string | null
  state: string | null
  created_at: string
}

export default function PropertiesManager({
  initialProperties,
  userId,
  selectedPropertyId,
  onSelectProperty,
}: {
  initialProperties: Property[]
  userId: string
  selectedPropertyId?: string | null
  onSelectProperty?: (id: string) => void
}) {
  const supabase = createClient()
  const [properties, setProperties] = useState(initialProperties)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [stateName, setStateName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase
      .from('properties')
      .insert({
        user_id: userId,
        name,
        address,
        city,
        state: stateName,
      })
      .select()
      .single()

    setLoading(false)

    if (error) {
      alert(error.message)
      return
    }

    setProperties((prev) => [data, ...prev])
    setName('')
    setAddress('')
    setCity('')
    setStateName('')

    if (onSelectProperty) {
      onSelectProperty(data.id)
    }
  }

  const effectiveSelectedId = selectedPropertyId ?? properties[0]?.id ?? null

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Properties</h2>

      <form onSubmit={handleCreate} className="grid gap-3 max-w-xl">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Property name"
          className="border rounded px-3 py-2"
          required
        />
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"
          className="border rounded px-3 py-2"
        />
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
          className="border rounded px-3 py-2"
        />
        <input
          value={stateName}
          onChange={(e) => setStateName(e.target.value)}
          placeholder="State"
          className="border rounded px-3 py-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white rounded px-4 py-2"
        >
          {loading ? 'Creating...' : 'Create Property'}
        </button>
      </form>

      <div className="grid gap-3">
        {properties.map((property) => {
          const isSelected = property.id === effectiveSelectedId
          return (
            <button
              key={property.id}
              type="button"
              onClick={() => onSelectProperty && onSelectProperty(property.id)}
              className={`flex flex-col items-start rounded border p-4 text-left transition ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-950/30'
                  : 'border-gray-700 bg-black hover:border-gray-500'
              }`}
            >
              <h3 className="font-semibold">{property.name}</h3>
              <p className="text-sm text-gray-400">
                {[property.address, property.city, property.state].filter(Boolean).join(', ')}
              </p>
              {isSelected && (
                <p className="mt-1 text-xs uppercase tracking-wide text-emerald-300">
                  Focused for snapshot
                </p>
              )}
            </button>
          )
        })}
      </div>
    </section>
  )
}
