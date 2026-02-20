import { useState, useRef, useEffect } from "react"
import {
  PieChart,
  Pie,
  ResponsiveContainer,
} from "recharts"

const AVAILABLE_CATEGORIES = [
  "Academic",
  "Health",
  "Leisure",
  "Family",
  "Personal Dev",
  "Social",
  "Work",
]

const COLOR_OPTIONS = [
  "#6366F1",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
]

export default function TimeDistribution() {
  const [isEditing, setIsEditing] = useState(false)

  const [categories, setCategories] = useState([
    { name: "Academic", value: 100, fill: "#6366F1" },
  ])

  const [showMore, setShowMore] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(null)
  const colorPickerRef = useRef(null)

  const total = categories.reduce((sum, c) => sum + c.value, 0)

  const evenlyDistribute = (newCategories) => {
    const split = 100 / newCategories.length
    return newCategories.map((c) => ({ ...c, value: split }))
  }

  const addCategory = (name) => {
    if (categories.find((c) => c.name === name)) return
    const newCats = evenlyDistribute([
      ...categories,
      { name, value: 0, fill: "#9CA3AF" },
    ])
    setCategories(newCats)
  }

  const removeCategory = (name) => {
    const filtered = categories.filter((c) => c.name !== name)
    if (filtered.length === 0) return
    setCategories(evenlyDistribute(filtered))
  }

  const updateValue = (index, newValue) => {
    const value = Math.max(0, Math.min(100, Number(newValue)))

    const updated = [...categories]

    // If only one category, force 100%
    if (updated.length === 1) {
        updated[0].value = 100
        setCategories(updated)
        return
    }

    const otherCategories = updated.filter((_, i) => i !== index)

    const remaining = 100 - value

    const totalOfOthers = otherCategories.reduce(
        (sum, c) => sum + c.value,
        0
    )

    // Redistribute proportionally
    const redistributed = updated.map((cat, i) => {
        if (i === index) {
        return { ...cat, value }
        }

        const proportion =
        totalOfOthers === 0
            ? 1 / otherCategories.length
            : cat.value / totalOfOthers

        return {
        ...cat,
        value: parseFloat((remaining * proportion).toFixed(2)),
        }
    })

    setCategories(redistributed)
  }

  const updateColor = (index, newColor) => {
    const updated = [...categories]
    updated[index].fill = newColor
    setCategories(updated)
    setShowColorPicker(null)
  }

  const reset = () => {
    setCategories([{ name: "Academic", value: 100, fill: "#6366F1" }])
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
        if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target)
        ) {
        setShowColorPicker(null)
        }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
        document.removeEventListener("mousedown", handleClickOutside)
    }
    }, [])
  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-md mx-auto">

      <h1 className="text-xl font-bold mb-6">Weekly Time Distribution</h1>

      {/* Donut Chart */}
      <div className="h-64 mb-6">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={categories}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={100}
              animationDuration={400}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Category List */}
      {categories.map((cat, index) => (
        <div key={index} className="mb-4 border p-3 rounded-xl bg-white">

          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-3">

              {/* Color Selector */}
              {isEditing && (
                <div className="relative">
                  <div
                    onClick={() => setShowColorPicker(index)}
                    className="w-5 h-5 border rounded cursor-pointer"
                    style={{ backgroundColor: cat.fill }}
                  />
                  {showColorPicker === index && (
                    <div
                     ref={colorPickerRef} 
                     className="absolute bg-white shadow-lg p-2 rounded-full flex gap-2 mt-2"
                    >

                      {COLOR_OPTIONS.map((color) => (
                        <div
                          key={color}
                          onClick={() => updateColor(index, color)}
                          className="w-6 h-6 rounded-full cursor-pointer"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              <span className="font-medium">{cat.name}</span>
            </div>

            {isEditing && (
              <button
                onClick={() => removeCategory(cat.name)}
                className="text-red-500 text-sm"
              >
                Remove
              </button>
            )}
          </div>

          {isEditing && (
            <>
              {/* Slider */}
              <input
                type="range"
                min="0"
                max="100"
                value={cat.value}
                onChange={(e) => updateValue(index, e.target.value)}
                className="w-full"
              />

              {/* Manual Edit */}
              <input
                type="number"
                value={cat.value}
                onChange={(e) => updateValue(index, e.target.value)}
                className="mt-2 w-full border rounded p-1"
              />
            </>
          )}

          {!isEditing && (
            <p className="text-gray-500">{cat.value.toFixed(0)}%</p>
          )}
        </div>
      ))}

      {/* Add Category */}
      {isEditing && (
        <>
          <button
            onClick={() => setShowMore(!showMore)}
            className="text-indigo-600 mb-2"
          >
            {showMore ? "Hide Categories" : "Show More Categories"}
          </button>

          {showMore && (
            <div className="flex flex-wrap gap-2 mb-4">
              {AVAILABLE_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => addCategory(cat)}
                  className="px-3 py-1 bg-gray-200 rounded-full text-sm"
                >
                  + {cat}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Total Display */}
      <div className="mt-4 mb-4 font-medium">
        Total: {total.toFixed(0)}%
        {total !== 100 && (
          <span className="text-red-500 ml-2">(Must equal 100%)</span>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex-1 bg-indigo-600 text-white p-2 rounded-xl"
          >
            Edit Changes
          </button>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-green-600 text-white p-2 rounded-xl"
              disabled={total !== 100}
            >
              Save
            </button>

            <button
              onClick={reset}
              className="flex-1 bg-gray-300 p-2 rounded-xl"
            >
              Reset
            </button>
          </>
        )}
      </div>
    </div>
  )
}
