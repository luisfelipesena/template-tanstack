import { createFileRoute } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useDebouncedCallback } from '@tanstack/react-pacer'
import * as React from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { create } from 'zustand'

type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

const defaultData: Person[] = [
  {
    firstName: 'tanner',
    lastName: 'linsley',
    age: 24,
    visits: 100,
    status: 'In Relationship',
    progress: 50,
  },
  {
    firstName: 'tandy',
    lastName: 'miller',
    age: 40,
    visits: 40,
    status: 'Single',
    progress: 80,
  },
  {
    firstName: 'joe',
    lastName: 'dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
  },
]

const columnHelper = createColumnHelper<Person>()

const columns = [
  columnHelper.accessor('firstName', {
    cell: (info) => info.getValue(),
    // footer: () => 'FIRSTNAME',
    header: () => 'FIRSTNAME',
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => 'LAST NAME',
    // footer: () => 'LASTNAME',
  }),
  columnHelper.accessor('age', {
    header: () => 'AGE',
    cell: (info) => info.renderValue(),
    // footer: () => 'AGE',
  }),
  columnHelper.accessor('visits', {
    header: () => 'VISITS',
    // footer: () => 'VISITS',
  }),
  columnHelper.accessor('status', {
    header: () => 'STATUS',
    // footer: () => 'STATUS',
  }),
  columnHelper.accessor('progress', {
    header: () => 'PROFILE PROGRESS',
    // footer: () => 'PROGRESS',
  }),
]

interface CounterState {
  count: number
  increment: () => void
}

const useCounterStore = create<CounterState>()((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}))

export const Route = createFileRoute('/home/teste')({
  component: Home,
})

function Home() {
  const [data, setData] = React.useState(() => [...defaultData])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const debouncedLog = useDebouncedCallback((value: string) => {
    console.log('Debounced value:', value)
  }, { wait: 500 })

  const form = useForm({
    defaultValues: {
      name: '',
    },
    onSubmit: async ({ value }) => {
      console.log(value)
      alert('Form submitted! Check the console.')
    },
  })

  const { count, increment } = useCounterStore()

  return (
    <div className="p-4 space-y-4">
      <div className="border p-4 rounded-md shadow-sm">
        <h3 className="text-xl font-bold mb-2">Zustand Counter Example</h3>
        <p className="mb-2">Count: {count}</p>
        <button
          type="button"
          onClick={increment}
          className="py-1 px-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Increment Count
        </button>
      </div>

      <hr className="my-4" />

      <h3 className="text-xl font-bold">TanStack Form & Pacer Example</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          void form.handleSubmit()
        }}
        className="space-y-2"
      >
        <div>
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) =>
                !value ? 'A name is required' : undefined,
            }}
          >
            {(field) => {
              const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                const newValue = e.target.value
                field.handleChange(newValue)
                debouncedLog(newValue)
              }

              return (
                <>
                  <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                    Name:
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {field.state.meta.errors ? (
                    <em className="text-sm text-red-600">{field.state.meta.errors.join(', ')}</em>
                  ) : null}
                </>
              )
            }}
          </form.Field>
        </div>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSubmitting ? '...' : 'Submit'}
            </button>
          )}
        </form.Subscribe>
      </form>

      <hr className="my-4" />

      <h3 className="text-xl font-bold">TanStack Table Example</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          {/* <tfoot className="bg-gray-50">
            {table.getFooterGroups().map(footerGroup => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map(header => (
                  <th key={header.id} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot> */}
        </table>
      </div>
    </div>
  )
}
