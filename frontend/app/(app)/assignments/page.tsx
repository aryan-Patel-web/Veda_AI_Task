// // "use client"

// // import { useEffect, useMemo, useState } from "react"
// // import Link from "next/link"
// // import { useRouter } from "next/navigation"
// // import { ChevronDown, MoreVertical, Search } from "lucide-react"
// // import { Badge } from "@/components/ui/badge"
// // import { Button } from "@/components/ui/button"
// // import { Card, CardContent } from "@/components/ui/card"
// // import { Input } from "@/components/ui/input"
// // import {
// //   DropdownMenu,
// //   DropdownMenuContent,
// //   DropdownMenuItem,
// //   DropdownMenuTrigger,
// // } from "@/components/ui/dropdown-menu"
// // // import { TopBar } from "@/components/veda/topbar"
// // import { cn } from "@/lib/utils"
// // import { TopBar } from "@/components/veda/topbar"

// // const statusOptions = [
// //   { label: "All", value: "all" },
// //   { label: "Pending", value: "pending" },
// //   { label: "Processing", value: "processing" },
// //   { label: "Completed", value: "completed" },
// //   { label: "Failed", value: "failed" },
// // ]

// // type Assignment = {
// //   _id: string
// //   title: string
// //   createdAt: string
// //   dueDate: string
// //   status: string
// // }

// // export default function AssignmentsPage() {
// //   const router = useRouter()
// //   const [assignments, setAssignments] = useState<Assignment[]>([])
// //   const [isLoading, setIsLoading] = useState(true)
// //   const [error, setError] = useState<string | null>(null)
// //   const [deletingId, setDeletingId] = useState<string | null>(null)
// //   const [search, setSearch] = useState("")
// //   const [statusFilter, setStatusFilter] = useState("all")

// //   const filteredAssignments = useMemo(() => {
// //     return assignments.filter((assignment) => {
// //       const matchesSearch = assignment.title
// //         .toLowerCase()
// //         .includes(search.toLowerCase())
// //       const matchesStatus =
// //         statusFilter === "all" || assignment.status === statusFilter
// //       return matchesSearch && matchesStatus
// //     })
// //   }, [assignments, search, statusFilter])

// //   useEffect(() => {
// //     const fetchAssignments = async () => {
// //       setIsLoading(true)
// //       setError(null)
// //       try {
// //         const response = await fetch("/api/assignments", {
// //           credentials: "include",
// //         })
// //         if (response.status === 401) {
// //           router.replace("/signin")
// //           return
// //         }
// //         if (!response.ok) {
// //           throw new Error("Failed to fetch assignments")
// //         }
// //         const data = await response.json()
// //         setAssignments(data?.data || [])
// //       } catch (error) {
// //         console.error(error)
// //         setError("We could not load assignments. Please try again.")
// //         setAssignments([])
// //       } finally {
// //         setIsLoading(false)
// //       }
// //     }

// //     fetchAssignments()
// //   }, [router])

// //   const handleDelete = async (assignmentId: string) => {
// //     if (deletingId) return
// //     const confirmed = window.confirm(
// //       "Are you sure you want to delete this assignment?"
// //     )
// //     if (!confirmed) return

// //     setDeletingId(assignmentId)
// //     try {
// //       const response = await fetch(`/api/assignments/${assignmentId}`, {
// //         method: "DELETE",
// //         credentials: "include",
// //       })
// //       if (response.status === 401) {
// //         router.replace("/signin")
// //         return
// //       }
// //       if (!response.ok) {
// //         throw new Error("Failed to delete assignment")
// //       }
// //       setAssignments((prev) =>
// //         prev.filter((assignment) => assignment._id !== assignmentId)
// //       )
// //     } catch (deleteError) {
// //       console.error(deleteError)
// //       window.alert("Could not delete assignment. Please try again.")
// //     } finally {
// //       setDeletingId(null)
// //     }
// //   }

// //   return (
// //     <div className="space-y-5">
// //       <TopBar breadcrumbLabel="Assignments" />

// //       <section className="rounded-[26px] border border-gray-200 bg-white px-5 py-4 shadow-[0_10px_24px_rgba(0,0,0,0.06)]">
// //         <div className="flex flex-col gap-2">
// //           <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-gray-500 uppercase">
// //             <span className="size-2 rounded-full bg-[#22c55e]" />
// //             Assignments
// //           </div>
// //           <h1 className="text-[26px] font-semibold tracking-tight text-gray-900">
// //             Assignments
// //           </h1>
// //           <p className="text-sm text-gray-500">
// //             Manage, review, and create assignments for your classes.
// //           </p>
// //         </div>

// //         <div className="mt-4 flex flex-col gap-3 rounded-[18px] border border-gray-200 bg-[#f3f3f3] p-3 lg:flex-row lg:items-center">
// //           <div className="flex items-center gap-2 text-sm text-gray-500">
// //             <span className="font-medium">Filter By</span>
// //             <div className="relative">
// //               <select
// //                 className="h-10 rounded-full border border-gray-200 bg-white px-4 pr-10 text-sm text-gray-900 shadow-sm"
// //                 value={statusFilter}
// //                 onChange={(event) => setStatusFilter(event.target.value)}
// //               >
// //                 {statusOptions.map((option) => (
// //                   <option key={option.value} value={option.value}>
// //                     {option.label}
// //                   </option>
// //                 ))}
// //               </select>
// //               <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-gray-400" />
// //             </div>
// //           </div>
// //           <div className="relative flex-1">
// //             <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
// //             <Input
// //               className="h-10 rounded-full border border-gray-200 bg-white pl-9 shadow-sm"
// //               placeholder="Search Assignment"
// //               value={search}
// //               onChange={(event) => setSearch(event.target.value)}
// //             />
// //           </div>
// //         </div>
// //       </section>

// //       {isLoading ? (
// //         <div className="rounded-[22px] border border-gray-200 bg-white p-6 text-sm text-gray-500 shadow-sm">
// //           Loading assignments...
// //         </div>
// //       ) : error ? (
// //         <div className="rounded-[22px] border border-dashed border-gray-200 bg-white p-6 text-sm text-red-600 shadow-sm">
// //           {error}
// //         </div>
// //       ) : filteredAssignments.length === 0 ? (
// //         <div className="rounded-[28px] border border-gray-200 bg-white p-12 text-center shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
// //           <div className="mx-auto flex size-28 items-center justify-center rounded-full bg-[#f3f3f3] shadow-inner">
// //             <svg viewBox="0 0 120 120" className="size-20" aria-hidden>
// //               <circle
// //                 cx="52"
// //                 cy="52"
// //                 r="30"
// //                 fill="#ffffff"
// //                 stroke="#d9d9d9"
// //                 strokeWidth="4"
// //               />
// //               <rect
// //                 x="72"
// //                 y="72"
// //                 width="30"
// //                 height="10"
// //                 rx="5"
// //                 transform="rotate(45 72 72)"
// //                 fill="#c9c9c9"
// //               />
// //               <circle cx="52" cy="52" r="18" fill="#f2f2f2" />
// //               <path
// //                 d="M46 46 L58 58 M58 46 L46 58"
// //                 stroke="#ef4444"
// //                 strokeWidth="4"
// //                 strokeLinecap="round"
// //               />
// //             </svg>
// //           </div>
// //           <h2 className="mt-6 text-lg font-semibold text-gray-900">
// //             No assignments yet
// //           </h2>
// //           <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
// //             Create your first assignment to start collecting and grading student
// //             submissions. You can set up rubrics, define marking criteria, and
// //             let AI assist with grading.
// //           </p>
// //           <Button
// //             asChild
// //             className="mt-6 rounded-full border border-orange-400 bg-[#111111] px-6 text-white shadow-[0_12px_26px_rgba(0,0,0,0.18)] hover:bg-[#1a1a1a]"
// //           >
// //             <Link href="/assignments/create">
// //               + Create Your First Assignment
// //             </Link>
// //           </Button>
// //         </div>
// //       ) : (
// //         <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
// //           {filteredAssignments.map((assignment) => (
// //             <Card
// //               key={assignment._id}
// //               className="rounded-[22px] border border-gray-200 bg-white shadow-[0_12px_26px_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(0,0,0,0.12)]"
// //             >
// //               <CardContent className="space-y-4 p-5">
// //                 <div className="flex items-start justify-between gap-3">
// //                   <div>
// //                     <h3 className="text-[17px] font-semibold text-gray-900">
// //                       {assignment.title}
// //                     </h3>
// //                     <p className="mt-1 text-xs text-gray-500">
// //                       Assigned on:{" "}
// //                       {new Date(assignment.createdAt).toLocaleDateString()}
// //                     </p>
// //                     <p className="text-xs text-gray-500">
// //                       Due: {new Date(assignment.dueDate).toLocaleDateString()}
// //                     </p>
// //                   </div>
// //                   <DropdownMenu>
// //                     <DropdownMenuTrigger className="rounded-full border border-gray-200 bg-[#f7f7f7] p-2 text-gray-400 transition hover:bg-[#efefef]">
// //                       <MoreVertical className="size-4" />
// //                     </DropdownMenuTrigger>
// //                     <DropdownMenuContent align="end">
// //                       <DropdownMenuItem asChild>
// //                         <Link href={`/assignments/${assignment._id}`}>
// //                           View Assignment
// //                         </Link>
// //                       </DropdownMenuItem>
// //                       <DropdownMenuItem className="text-red-500">
// //                         <button
// //                           type="button"
// //                           className="w-full text-left"
// //                           onClick={() => handleDelete(assignment._id)}
// //                           disabled={deletingId === assignment._id}
// //                         >
// //                           {deletingId === assignment._id
// //                             ? "Deleting..."
// //                             : "Delete"}
// //                         </button>
// //                       </DropdownMenuItem>
// //                     </DropdownMenuContent>
// //                   </DropdownMenu>
// //                 </div>
// //                 <Badge
// //                   className={cn(
// //                     "w-fit rounded-full px-3 py-1 capitalize",
// //                     assignment.status === "completed"
// //                       ? "bg-green-100 text-green-700"
// //                       : assignment.status === "failed"
// //                         ? "bg-red-100 text-red-700"
// //                         : "bg-orange-100 text-orange-700"
// //                   )}
// //                 >
// //                   {assignment.status}
// //                 </Badge>
// //               </CardContent>
// //             </Card>
// //           ))}
// //         </div>
// //       )}

// //       <Button
// //         asChild
// //         className="fixed bottom-24 left-1/2 z-20 h-11 w-[220px] -translate-x-1/2 rounded-full border border-orange-400 bg-[#111111] text-white shadow-[0_12px_28px_rgba(0,0,0,0.22)] hover:bg-[#1a1a1a] md:bottom-10"
// //       >
// //         <Link href="/assignments/create">+ Create Assignment</Link>
// //       </Button>
// //     </div>
// //   )
// // }




// "use client"

// import { useCallback, useEffect, useMemo, useRef, useState } from "react"
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

//   // Use a ref so the polling interval always sees the latest assignments
//   const assignmentsRef = useRef<Assignment[]>([])
//   assignmentsRef.current = assignments

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

//   const fetchAssignments = useCallback(
//     async (showLoader = false) => {
//       if (showLoader) setIsLoading(true)
//       setError(null)
//       try {
//         const response = await fetch("/api/assignments", {
//           credentials: "include",
//         })
//         if (response.status === 401) {
//           router.replace("/signin")
//           return
//         }
//         if (!response.ok) throw new Error("Failed to fetch assignments")
//         const data = await response.json()
//         setAssignments(data?.data || [])
//       } catch (err) {
//         console.error(err)
//         if (showLoader) {
//           setError("We could not load assignments. Please try again.")
//           setAssignments([])
//         }
//       } finally {
//         if (showLoader) setIsLoading(false)
//       }
//     },
//     [router]
//   )

//   // Initial load
//   useEffect(() => {
//     fetchAssignments(true)
//   }, [fetchAssignments])

//   // Auto-poll every 5s while any assignment is processing/pending
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const hasPending = assignmentsRef.current.some(
//         (a) => a.status === "processing" || a.status === "pending"
//       )
//       if (hasPending) fetchAssignments(false)
//     }, 5000)
//     return () => clearInterval(interval)
//   }, [fetchAssignments])

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
//       if (!response.ok) throw new Error("Failed to delete assignment")
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
//               <circle cx="52" cy="52" r="30" fill="#ffffff" stroke="#d9d9d9" strokeWidth="4" />
//               <rect x="72" y="72" width="30" height="10" rx="5" transform="rotate(45 72 72)" fill="#c9c9c9" />
//               <circle cx="52" cy="52" r="18" fill="#f2f2f2" />
//               <path d="M46 46 L58 58 M58 46 L46 58" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
//             </svg>
//           </div>
//           <h2 className="mt-6 text-lg font-semibold text-gray-900">No assignments yet</h2>
//           <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
//             Create your first assignment to start collecting and grading student
//             submissions. You can set up rubrics, define marking criteria, and
//             let AI assist with grading.
//           </p>
//           <Button
//             asChild
//             className="mt-6 rounded-full border border-orange-400 bg-[#111111] px-6 text-white shadow-[0_12px_26px_rgba(0,0,0,0.18)] hover:bg-[#1a1a1a]"
//           >
//             <Link href="/assignments/create">+ Create Your First Assignment</Link>
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
//                           {deletingId === assignment._id ? "Deleting..." : "Delete"}
//                         </button>
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </div>

//                 {/* ── Status badge with spinner for processing/pending ── */}
//                 <Badge
//                   className={cn(
//                     "flex w-fit items-center gap-1.5 rounded-full px-3 py-1 capitalize",
//                     assignment.status === "completed"
//                       ? "bg-green-100 text-green-700"
//                       : assignment.status === "failed"
//                         ? "bg-red-100 text-red-700"
//                         : "bg-orange-100 text-orange-700"
//                   )}
//                 >
//                   {(assignment.status === "processing" ||
//                     assignment.status === "pending") && (
//                     <svg
//                       className="size-3 animate-spin"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       />
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8v8z"
//                       />
//                     </svg>
//                   )}
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
import { Filter, MoreVertical, Search } from "lucide-react"
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
  const [filterOpen, setFilterOpen] = useState(false)

  const assignmentsRef = useRef<Assignment[]>([])
  assignmentsRef.current = assignments

  const filteredAssignments = useMemo(() => {
    return assignments.filter((a) => {
      const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === "all" || a.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [assignments, search, statusFilter])

  const fetchAssignments = useCallback(
    async (showLoader = false) => {
      if (showLoader) setIsLoading(true)
      setError(null)
      try {
        const response = await fetch("/api/assignments", { credentials: "include" })
        if (response.status === 401) { router.replace("/signin"); return }
        if (!response.ok) throw new Error("Failed to fetch assignments")
        const data = await response.json()
        setAssignments(data?.data || [])
      } catch (err) {
        console.error(err)
        if (showLoader) { setError("We could not load assignments. Please try again."); setAssignments([]) }
      } finally {
        if (showLoader) setIsLoading(false)
      }
    },
    [router]
  )

  useEffect(() => { fetchAssignments(true) }, [fetchAssignments])

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
    if (!window.confirm("Are you sure you want to delete this assignment?")) return
    setDeletingId(assignmentId)
    try {
      const response = await fetch(`/api/assignments/${assignmentId}`, { method: "DELETE", credentials: "include" })
      if (response.status === 401) { router.replace("/signin"); return }
      if (!response.ok) throw new Error("Failed to delete")
      setAssignments((prev) => prev.filter((a) => a._id !== assignmentId))
    } catch (e) {
      console.error(e); window.alert("Could not delete assignment. Please try again.")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <TopBar breadcrumbLabel="Assignments" />

      {/* ── Header ── */}
      <div className="px-1">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-gray-500 uppercase">
          <span className="size-2 rounded-full bg-[#22c55e]" />
          Assignments
        </div>
        <h1 className="mt-1 text-[26px] font-semibold tracking-tight text-gray-900">Assignments</h1>
        <p className="text-sm text-gray-500">Manage and create assignments for your classes.</p>
      </div>

      {/* ── Filter bar — Figma exact ── */}
      <div className="flex items-center gap-3">
        {/* Filter pill with dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setFilterOpen((v) => !v)}
            className="flex h-9 items-center gap-2 rounded-full border border-gray-200 bg-white px-4 text-sm text-gray-600 shadow-sm hover:bg-gray-50"
          >
            <Filter className="size-3.5" />
            <span>Filter By</span>
          </button>
          {filterOpen && (
            <div className="absolute top-full left-0 z-10 mt-1 w-44 rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
              {statusOptions.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  className={cn(
                    "w-full px-4 py-2 text-left text-sm hover:bg-gray-50",
                    statusFilter === o.value ? "font-semibold text-gray-900" : "text-gray-600"
                  )}
                  onClick={() => { setStatusFilter(o.value); setFilterOpen(false) }}
                >
                  {o.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
          <Input
            className="h-9 rounded-full border border-gray-200 bg-white pl-9 text-sm shadow-sm"
            placeholder="Search Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ── Content ── */}
      {isLoading ? (
        <div className="rounded-[22px] border border-gray-200 bg-white p-6 text-sm text-gray-500 shadow-sm">
          Loading assignments...
        </div>
      ) : error ? (
        <div className="rounded-[22px] border border-dashed border-gray-200 bg-white p-6 text-sm text-red-600 shadow-sm">
          {error}
        </div>
      ) : filteredAssignments.length === 0 ? (
        /* Empty state — Figma exact illustration */
        <div className="flex flex-col items-center justify-center rounded-[28px] border border-gray-200 bg-white p-16 text-center shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
          <div className="mx-auto mb-5 flex size-28 items-center justify-center">
            <svg viewBox="0 0 160 160" className="size-28" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Document */}
              <rect x="38" y="24" width="72" height="90" rx="8" fill="#fff" stroke="#e5e7eb" strokeWidth="2"/>
              <rect x="50" y="42" width="48" height="4" rx="2" fill="#e5e7eb"/>
              <rect x="50" y="54" width="36" height="4" rx="2" fill="#e5e7eb"/>
              <rect x="50" y="66" width="42" height="4" rx="2" fill="#e5e7eb"/>
              {/* Red X circle */}
              <circle cx="100" cy="96" r="30" fill="#fef2f2" stroke="#fca5a5" strokeWidth="2"/>
              <path d="M89 85 L111 107 M111 85 L89 107" stroke="#ef4444" strokeWidth="4" strokeLinecap="round"/>
              {/* Magnifying glass handle */}
              <line x1="118" y1="114" x2="132" y2="128" stroke="#d1d5db" strokeWidth="6" strokeLinecap="round"/>
              {/* Sparkles */}
              <circle cx="44" cy="110" r="3" fill="#a5b4fc"/>
              <circle cx="134" cy="56" r="4" fill="#fbbf24"/>
              <circle cx="58" cy="130" r="2" fill="#86efac"/>
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900">No assignments yet</h2>
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
        /* Assignment cards grid — desktop 2-col, mobile list */
        <div className="grid gap-4 md:grid-cols-2">
          {filteredAssignments.map((assignment) => (
            <Card
              key={assignment._id}
              className="rounded-[20px] border border-gray-200 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)]"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[15px] font-semibold text-gray-900 truncate">{assignment.title}</h3>
                    {/* Dates inline — Figma exact */}
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span>
                        <span className="font-medium text-gray-600">Assigned on</span>{" : "}
                        {new Date(assignment.createdAt).toLocaleDateString("en-GB").replace(/\//g, "-")}
                      </span>
                      <span>
                        <span className="font-medium text-gray-600">Due</span>{" : "}
                        {new Date(assignment.dueDate).toLocaleDateString("en-GB").replace(/\//g, "-")}
                      </span>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex size-8 items-center justify-center rounded-full border border-gray-200 bg-[#f7f7f7] text-gray-400 transition hover:bg-[#efefef]">
                      <MoreVertical className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/assignments/${assignment._id}`}>View Assignment</Link>
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

                {/* Status badge with spinner */}
                <div className="mt-3">
                  <Badge
                    className={cn(
                      "flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs capitalize",
                      assignment.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : assignment.status === "failed"
                          ? "bg-red-100 text-red-700"
                          : "bg-orange-100 text-orange-700"
                    )}
                  >
                    {(assignment.status === "processing" || assignment.status === "pending") && (
                      <svg className="size-3 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                    )}
                    {assignment.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Floating create button */}
      {/* <Button
        asChild
        className="fixed bottom-24 left-1/2 z-20 h-11 w-[220px] -translate-x-1/2 rounded-full border border-orange-400 bg-[#111111] text-white shadow-[0_12px_28px_rgba(0,0,0,0.22)] hover:bg-[#1a1a1a] md:bottom-10"
      >
        <Link href="/assignments/create">+ Create Assignment</Link>
      </Button> */}
    </div>
  )
}