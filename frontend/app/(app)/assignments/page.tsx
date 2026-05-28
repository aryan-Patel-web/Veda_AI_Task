// "use client"

// import { useEffect, useMemo, useState } from "react"
// import Link from "next/link"
// import { useRouter } from "next/navigation"
// import { ChevronDown, MoreVertical, Search } from "lucide-react"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// // import { TopBar } from "@/components/veda/topbar"
// import { cn } from "@/lib/utils"
// import { TopBar } from "@/components/veda/topbar"

// const statusOptions = [
//   { label: "All", value: "all" },
//   { label: "Pending", value: "pending" },
//   { label: "Processing", value: "processing" },
//   { label: "Completed", value: "completed" },
//   { label: "Failed", value: "failed" },
// ]

// type Assignment = {
//   _id: string
//   title: string
//   createdAt: string
//   dueDate: string
//   status: string
// }

// export default function AssignmentsPage() {
//   const router = useRouter()
//   const [assignments, setAssignments] = useState<Assignment[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [deletingId, setDeletingId] = useState<string | null>(null)
//   const [search, setSearch] = useState("")
//   const [statusFilter, setStatusFilter] = useState("all")

//   const filteredAssignments = useMemo(() => {
//     return assignments.filter((assignment) => {
//       const matchesSearch = assignment.title
//         .toLowerCase()
//         .includes(search.toLowerCase())
//       const matchesStatus =
//         statusFilter === "all" || assignment.status === statusFilter
//       return matchesSearch && matchesStatus
//     })
//   }, [assignments, search, statusFilter])

//   useEffect(() => {
//     const fetchAssignments = async () => {
//       setIsLoading(true)
//       setError(null)
//       try {
//         const response = await fetch("/api/assignments", {
//           credentials: "include",
//         })
//         if (response.status === 401) {
//           router.replace("/signin")
//           return
//         }
//         if (!response.ok) {
//           throw new Error("Failed to fetch assignments")
//         }
//         const data = await response.json()
//         setAssignments(data?.data || [])
//       } catch (error) {
//         console.error(error)
//         setError("We could not load assignments. Please try again.")
//         setAssignments([])
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchAssignments()
//   }, [router])

//   const handleDelete = async (assignmentId: string) => {
//     if (deletingId) return
//     const confirmed = window.confirm(
//       "Are you sure you want to delete this assignment?"
//     )
//     if (!confirmed) return

//     setDeletingId(assignmentId)
//     try {
//       const response = await fetch(`/api/assignments/${assignmentId}`, {
//         method: "DELETE",
//         credentials: "include",
//       })
//       if (response.status === 401) {
//         router.replace("/signin")
//         return
//       }
//       if (!response.ok) {
//         throw new Error("Failed to delete assignment")
//       }
//       setAssignments((prev) =>
//         prev.filter((assignment) => assignment._id !== assignmentId)
//       )
//     } catch (deleteError) {
//       console.error(deleteError)
//       window.alert("Could not delete assignment. Please try again.")
//     } finally {
//       setDeletingId(null)
//     }
//   }

//   return (
//     <div className="space-y-5">
//       <TopBar breadcrumbLabel="Assignments" />

//       <section className="rounded-[26px] border border-gray-200 bg-white px-5 py-4 shadow-[0_10px_24px_rgba(0,0,0,0.06)]">
//         <div className="flex flex-col gap-2">
//           <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-gray-500 uppercase">
//             <span className="size-2 rounded-full bg-[#22c55e]" />
//             Assignments
//           </div>
//           <h1 className="text-[26px] font-semibold tracking-tight text-gray-900">
//             Assignments
//           </h1>
//           <p className="text-sm text-gray-500">
//             Manage, review, and create assignments for your classes.
//           </p>
//         </div>

//         <div className="mt-4 flex flex-col gap-3 rounded-[18px] border border-gray-200 bg-[#f3f3f3] p-3 lg:flex-row lg:items-center">
//           <div className="flex items-center gap-2 text-sm text-gray-500">
//             <span className="font-medium">Filter By</span>
//             <div className="relative">
//               <select
//                 className="h-10 rounded-full border border-gray-200 bg-white px-4 pr-10 text-sm text-gray-900 shadow-sm"
//                 value={statusFilter}
//                 onChange={(event) => setStatusFilter(event.target.value)}
//               >
//                 {statusOptions.map((option) => (
//                   <option key={option.value} value={option.value}>
//                     {option.label}
//                   </option>
//                 ))}
//               </select>
//               <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-gray-400" />
//             </div>
//           </div>
//           <div className="relative flex-1">
//             <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
//             <Input
//               className="h-10 rounded-full border border-gray-200 bg-white pl-9 shadow-sm"
//               placeholder="Search Assignment"
//               value={search}
//               onChange={(event) => setSearch(event.target.value)}
//             />
//           </div>
//         </div>
//       </section>

//       {isLoading ? (
//         <div className="rounded-[22px] border border-gray-200 bg-white p-6 text-sm text-gray-500 shadow-sm">
//           Loading assignments...
//         </div>
//       ) : error ? (
//         <div className="rounded-[22px] border border-dashed border-gray-200 bg-white p-6 text-sm text-red-600 shadow-sm">
//           {error}
//         </div>
//       ) : filteredAssignments.length === 0 ? (
//         <div className="rounded-[28px] border border-gray-200 bg-white p-12 text-center shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
//           <div className="mx-auto flex size-28 items-center justify-center rounded-full bg-[#f3f3f3] shadow-inner">
//             <svg viewBox="0 0 120 120" className="size-20" aria-hidden>
//               <circle
//                 cx="52"
//                 cy="52"
//                 r="30"
//                 fill="#ffffff"
//                 stroke="#d9d9d9"
//                 strokeWidth="4"
//               />
//               <rect
//                 x="72"
//                 y="72"
//                 width="30"
//                 height="10"
//                 rx="5"
//                 transform="rotate(45 72 72)"
//                 fill="#c9c9c9"
//               />
//               <circle cx="52" cy="52" r="18" fill="#f2f2f2" />
//               <path
//                 d="M46 46 L58 58 M58 46 L46 58"
//                 stroke="#ef4444"
//                 strokeWidth="4"
//                 strokeLinecap="round"
//               />
//             </svg>
//           </div>
//           <h2 className="mt-6 text-lg font-semibold text-gray-900">
//             No assignments yet
//           </h2>
//           <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
//             Create your first assignment to start collecting and grading student
//             submissions. You can set up rubrics, define marking criteria, and
//             let AI assist with grading.
//           </p>
//           <Button
//             asChild
//             className="mt-6 rounded-full border border-orange-400 bg-[#111111] px-6 text-white shadow-[0_12px_26px_rgba(0,0,0,0.18)] hover:bg-[#1a1a1a]"
//           >
//             <Link href="/assignments/create">
//               + Create Your First Assignment
//             </Link>
//           </Button>
//         </div>
//       ) : (
//         <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
//           {filteredAssignments.map((assignment) => (
//             <Card
//               key={assignment._id}
//               className="rounded-[22px] border border-gray-200 bg-white shadow-[0_12px_26px_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(0,0,0,0.12)]"
//             >
//               <CardContent className="space-y-4 p-5">
//                 <div className="flex items-start justify-between gap-3">
//                   <div>
//                     <h3 className="text-[17px] font-semibold text-gray-900">
//                       {assignment.title}
//                     </h3>
//                     <p className="mt-1 text-xs text-gray-500">
//                       Assigned on:{" "}
//                       {new Date(assignment.createdAt).toLocaleDateString()}
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       Due: {new Date(assignment.dueDate).toLocaleDateString()}
//                     </p>
//                   </div>
//                   <DropdownMenu>
//                     <DropdownMenuTrigger className="rounded-full border border-gray-200 bg-[#f7f7f7] p-2 text-gray-400 transition hover:bg-[#efefef]">
//                       <MoreVertical className="size-4" />
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                       <DropdownMenuItem asChild>
//                         <Link href={`/assignments/${assignment._id}`}>
//                           View Assignment
//                         </Link>
//                       </DropdownMenuItem>
//                       <DropdownMenuItem className="text-red-500">
//                         <button
//                           type="button"
//                           className="w-full text-left"
//                           onClick={() => handleDelete(assignment._id)}
//                           disabled={deletingId === assignment._id}
//                         >
//                           {deletingId === assignment._id
//                             ? "Deleting..."
//                             : "Delete"}
//                         </button>
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </div>
//                 <Badge
//                   className={cn(
//                     "w-fit rounded-full px-3 py-1 capitalize",
//                     assignment.status === "completed"
//                       ? "bg-green-100 text-green-700"
//                       : assignment.status === "failed"
//                         ? "bg-red-100 text-red-700"
//                         : "bg-orange-100 text-orange-700"
//                   )}
//                 >
//                   {assignment.status}
//                 </Badge>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}

//       <Button
//         asChild
//         className="fixed bottom-24 left-1/2 z-20 h-11 w-[220px] -translate-x-1/2 rounded-full border border-orange-400 bg-[#111111] text-white shadow-[0_12px_28px_rgba(0,0,0,0.22)] hover:bg-[#1a1a1a] md:bottom-10"
//       >
//         <Link href="/assignments/create">+ Create Assignment</Link>
//       </Button>
//     </div>
//   )
// }




"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronDown, MoreVertical, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { TopBar } from "@/components/veda/topbar"

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Completed", value: "completed" },
  { label: "Failed", value: "failed" },
]

type Assignment = {
  _id: string
  title: string
  createdAt: string
  dueDate: string
  status: string
}

export default function AssignmentsPage() {
  const router = useRouter()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Use a ref so the polling interval always sees the latest assignments
  const assignmentsRef = useRef<Assignment[]>([])
  assignmentsRef.current = assignments

  const filteredAssignments = useMemo(() => {
    return assignments.filter((assignment) => {
      const matchesSearch = assignment.title
        .toLowerCase()
        .includes(search.toLowerCase())
      const matchesStatus =
        statusFilter === "all" || assignment.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [assignments, search, statusFilter])

  const fetchAssignments = useCallback(
    async (showLoader = false) => {
      if (showLoader) setIsLoading(true)
      setError(null)
      try {
        const response = await fetch("/api/assignments", {
          credentials: "include",
        })
        if (response.status === 401) {
          router.replace("/signin")
          return
        }
        if (!response.ok) throw new Error("Failed to fetch assignments")
        const data = await response.json()
        setAssignments(data?.data || [])
      } catch (err) {
        console.error(err)
        if (showLoader) {
          setError("We could not load assignments. Please try again.")
          setAssignments([])
        }
      } finally {
        if (showLoader) setIsLoading(false)
      }
    },
    [router]
  )

  // Initial load
  useEffect(() => {
    fetchAssignments(true)
  }, [fetchAssignments])

  // Auto-poll every 5s while any assignment is processing/pending
  useEffect(() => {
    const interval = setInterval(() => {
      const hasPending = assignmentsRef.current.some(
        (a) => a.status === "processing" || a.status === "pending"
      )
      if (hasPending) fetchAssignments(false)
    }, 5000)
    return () => clearInterval(interval)
  }, [fetchAssignments])

  const handleDelete = async (assignmentId: string) => {
    if (deletingId) return
    const confirmed = window.confirm(
      "Are you sure you want to delete this assignment?"
    )
    if (!confirmed) return

    setDeletingId(assignmentId)
    try {
      const response = await fetch(`/api/assignments/${assignmentId}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (response.status === 401) {
        router.replace("/signin")
        return
      }
      if (!response.ok) throw new Error("Failed to delete assignment")
      setAssignments((prev) =>
        prev.filter((assignment) => assignment._id !== assignmentId)
      )
    } catch (deleteError) {
      console.error(deleteError)
      window.alert("Could not delete assignment. Please try again.")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-5">
      <TopBar breadcrumbLabel="Assignments" />

      <section className="rounded-[26px] border border-gray-200 bg-white px-5 py-4 shadow-[0_10px_24px_rgba(0,0,0,0.06)]">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-gray-500 uppercase">
            <span className="size-2 rounded-full bg-[#22c55e]" />
            Assignments
          </div>
          <h1 className="text-[26px] font-semibold tracking-tight text-gray-900">
            Assignments
          </h1>
          <p className="text-sm text-gray-500">
            Manage, review, and create assignments for your classes.
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-3 rounded-[18px] border border-gray-200 bg-[#f3f3f3] p-3 lg:flex-row lg:items-center">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="font-medium">Filter By</span>
            <div className="relative">
              <select
                className="h-10 rounded-full border border-gray-200 bg-white px-4 pr-10 text-sm text-gray-900 shadow-sm"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
            <Input
              className="h-10 rounded-full border border-gray-200 bg-white pl-9 shadow-sm"
              placeholder="Search Assignment"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="rounded-[22px] border border-gray-200 bg-white p-6 text-sm text-gray-500 shadow-sm">
          Loading assignments...
        </div>
      ) : error ? (
        <div className="rounded-[22px] border border-dashed border-gray-200 bg-white p-6 text-sm text-red-600 shadow-sm">
          {error}
        </div>
      ) : filteredAssignments.length === 0 ? (
        <div className="rounded-[28px] border border-gray-200 bg-white p-12 text-center shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
          <div className="mx-auto flex size-28 items-center justify-center rounded-full bg-[#f3f3f3] shadow-inner">
            <svg viewBox="0 0 120 120" className="size-20" aria-hidden>
              <circle cx="52" cy="52" r="30" fill="#ffffff" stroke="#d9d9d9" strokeWidth="4" />
              <rect x="72" y="72" width="30" height="10" rx="5" transform="rotate(45 72 72)" fill="#c9c9c9" />
              <circle cx="52" cy="52" r="18" fill="#f2f2f2" />
              <path d="M46 46 L58 58 M58 46 L46 58" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="mt-6 text-lg font-semibold text-gray-900">No assignments yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
            Create your first assignment to start collecting and grading student
            submissions. You can set up rubrics, define marking criteria, and
            let AI assist with grading.
          </p>
          <Button
            asChild
            className="mt-6 rounded-full border border-orange-400 bg-[#111111] px-6 text-white shadow-[0_12px_26px_rgba(0,0,0,0.18)] hover:bg-[#1a1a1a]"
          >
            <Link href="/assignments/create">+ Create Your First Assignment</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredAssignments.map((assignment) => (
            <Card
              key={assignment._id}
              className="rounded-[22px] border border-gray-200 bg-white shadow-[0_12px_26px_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(0,0,0,0.12)]"
            >
              <CardContent className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-[17px] font-semibold text-gray-900">
                      {assignment.title}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                      Assigned on:{" "}
                      {new Date(assignment.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="rounded-full border border-gray-200 bg-[#f7f7f7] p-2 text-gray-400 transition hover:bg-[#efefef]">
                      <MoreVertical className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/assignments/${assignment._id}`}>
                          View Assignment
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500">
                        <button
                          type="button"
                          className="w-full text-left"
                          onClick={() => handleDelete(assignment._id)}
                          disabled={deletingId === assignment._id}
                        >
                          {deletingId === assignment._id ? "Deleting..." : "Delete"}
                        </button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* ── Status badge with spinner for processing/pending ── */}
                <Badge
                  className={cn(
                    "flex w-fit items-center gap-1.5 rounded-full px-3 py-1 capitalize",
                    assignment.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : assignment.status === "failed"
                        ? "bg-red-100 text-red-700"
                        : "bg-orange-100 text-orange-700"
                  )}
                >
                  {(assignment.status === "processing" ||
                    assignment.status === "pending") && (
                    <svg
                      className="size-3 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                  )}
                  {assignment.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Button
        asChild
        className="fixed bottom-24 left-1/2 z-20 h-11 w-[220px] -translate-x-1/2 rounded-full border border-orange-400 bg-[#111111] text-white shadow-[0_12px_28px_rgba(0,0,0,0.22)] hover:bg-[#1a1a1a] md:bottom-10"
      >
        <Link href="/assignments/create">+ Create Assignment</Link>
      </Button>
    </div>
  )
}