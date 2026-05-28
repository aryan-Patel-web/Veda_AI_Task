// "use client"

// import { useEffect, useMemo, useState } from "react"
// import type { FormEvent } from "react"
// import { useRouter } from "next/navigation"
// import { Mic, Minus, Plus, UploadCloud, X } from "lucide-react"
// import { TopBar } from "@/components/veda/topbar"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"

// const difficultyOptions = [
//   { label: "Easy", value: "easy" },
//   { label: "Medium", value: "medium" },
//   { label: "Hard", value: "hard" },
//   { label: "Mixed", value: "mixed" },
// ]

// type Subject = {
//   _id: string
//   name: string
//   questionTypes: string[]
// }

// type BreakdownItem = {
//   type: string
//   count: string
//   marksPerQuestion: string
// }

// export default function CreateAssignmentPage() {
//   const router = useRouter()
//   const [subjects, setSubjects] = useState<Subject[]>([])
//   const [subjectsLoading, setSubjectsLoading] = useState(true)
//   const [subjectId, setSubjectId] = useState("")
//   const [subjectModalOpen, setSubjectModalOpen] = useState(false)
//   const [newSubjectName, setNewSubjectName] = useState("")
//   const [newSubjectTypes, setNewSubjectTypes] = useState("")
//   const [subjectCreateLoading, setSubjectCreateLoading] = useState(false)
//   const [pdfFile, setPdfFile] = useState<File | null>(null)
//   const [title, setTitle] = useState("")
//   const [gradeLevel, setGradeLevel] = useState("")
//   const [schoolName, setSchoolName] = useState("")
//   const [dueDate, setDueDate] = useState("")
//   const [difficulty, setDifficulty] = useState("mixed")
//   const [additionalInstructions, setAdditionalInstructions] = useState("")
//   const [questionBreakdown, setQuestionBreakdown] = useState<BreakdownItem[]>(
//     []
//   )
//   const [error, setError] = useState<string | null>(null)
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   const fetchSubjects = async () => {
//     setSubjectsLoading(true)
//     try {
//       const response = await fetch("/api/subjects", {
//         credentials: "include",
//       })
//       if (response.status === 401) {
//         router.replace("/signin")
//         return
//       }
//       if (!response.ok) {
//         throw new Error("Failed to load subjects")
//       }
//       const data = await response.json()
//       setSubjects(data?.data || [])
//     } catch (error) {
//       console.error(error)
//       setSubjects([])
//     } finally {
//       setSubjectsLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchSubjects()
//   }, [router])

//   useEffect(() => {
//     if (!subjectId) {
//       setQuestionBreakdown([])
//       return
//     }

//     const subject = subjects.find((item) => item._id === subjectId)
//     if (!subject) {
//       return
//     }

//     setQuestionBreakdown(
//       subject.questionTypes.map((type) => ({
//         type,
//         count: "1",
//         marksPerQuestion: "1",
//       }))
//     )
//   }, [subjectId, subjects])

//   const totals = useMemo(() => {
//     return questionBreakdown.reduce(
//       (acc, item) => {
//         const count = Number(item.count) || 0
//         const marks = Number(item.marksPerQuestion) || 0
//         return {
//           totalQuestions: acc.totalQuestions + count,
//           totalMarks: acc.totalMarks + count * marks,
//         }
//       },
//       { totalQuestions: 0, totalMarks: 0 }
//     )
//   }, [questionBreakdown])

//   const handleBreakdownChange = (
//     index: number,
//     field: keyof BreakdownItem,
//     value: string
//   ) => {
//     setQuestionBreakdown((prev) =>
//       prev.map((item, currentIndex) =>
//         currentIndex === index ? { ...item, [field]: value } : item
//       )
//     )
//   }

//   const handleAddBreakdown = () => {
//     const subject = subjects.find((item) => item._id === subjectId)
//     const fallbackType = subject?.questionTypes[0] || ""
//     if (!fallbackType) {
//       return
//     }

//     setQuestionBreakdown((prev) => [
//       ...prev,
//       { type: fallbackType, count: "1", marksPerQuestion: "1" },
//     ])
//   }

//   const handleRemoveBreakdown = (index: number) => {
//     setQuestionBreakdown((prev) =>
//       prev.filter((_, currentIndex) => currentIndex !== index)
//     )
//   }

//   const handleCreateSubject = async () => {
//     setError(null)

//     const name = newSubjectName.trim()
//     const questionTypes = newSubjectTypes
//       .split(",")
//       .map((item) => item.trim())
//       .filter(Boolean)

//     if (!name) {
//       setError("Subject name is required.")
//       return
//     }

//     if (questionTypes.length === 0) {
//       setError("Add at least one question type for the new subject.")
//       return
//     }

//     if (new Set(questionTypes).size !== questionTypes.length) {
//       setError("Question types must be unique.")
//       return
//     }

//     setSubjectCreateLoading(true)
//     try {
//       const response = await fetch("/api/subjects", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ name, questionTypes }),
//       })

//       if (response.status === 401) {
//         router.replace("/signin")
//         return
//       }

//       const data = await response.json().catch(() => ({}))
//       if (!response.ok || !data?.success) {
//         setError(data?.message || "Could not create subject.")
//         return
//       }

//       await fetchSubjects()
//       const createdSubject = data?.data
//       if (createdSubject?.id) {
//         setSubjectId(createdSubject.id)
//       }
//       setNewSubjectName("")
//       setNewSubjectTypes("")
//       setSubjectModalOpen(false)
//     } catch (error) {
//       console.error(error)
//       setError("Could not create subject. Please try again.")
//     } finally {
//       setSubjectCreateLoading(false)
//     }
//   }

//   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault()
//     setError(null)

//     if (!title.trim()) {
//       setError("Title is required.")
//       return
//     }
//     if (!subjectId) {
//       setError("Subject is required.")
//       return
//     }
//     if (!gradeLevel.trim()) {
//       setError("Grade level is required.")
//       return
//     }
//     if (!dueDate) {
//       setError("Due date is required.")
//       return
//     }
//     if (questionBreakdown.length === 0) {
//       setError("Add at least one question type.")
//       return
//     }

//     const typeSet = new Set(questionBreakdown.map((item) => item.type))
//     if (typeSet.size !== questionBreakdown.length) {
//       setError("Question types must be unique.")
//       return
//     }

//     const hasInvalidNumbers = questionBreakdown.some((item) => {
//       const count = Number(item.count)
//       const marks = Number(item.marksPerQuestion)
//       return (
//         Number.isNaN(count) || Number.isNaN(marks) || count < 1 || marks < 0
//       )
//     })
//     if (hasInvalidNumbers) {
//       setError("Counts must be at least 1 and marks cannot be negative.")
//       return
//     }

//     const payload = {
//       title: title.trim(),
//       subjectId,
//       gradeLevel: gradeLevel.trim(),
//       schoolName: schoolName.trim() || undefined,
//       dueDate,
//       difficulty,
//       additionalInstructions: additionalInstructions.trim() || undefined,
//       questionBreakdown: questionBreakdown.map((item) => ({
//         type: item.type,
//         count: Number(item.count),
//         marksPerQuestion: Number(item.marksPerQuestion),
//       })),
//     }

//     setIsSubmitting(true)
//     try {
//       const formData = new FormData()
//       formData.append("payload", JSON.stringify(payload))
//       if (pdfFile) {
//         formData.append("pdfFile", pdfFile)
//       }

//       const response = await fetch("/api/assignments", {
//         method: "POST",
//         credentials: "include",
//         body: formData,
//       })

//       if (response.status === 401) {
//         router.replace("/signin")
//         return
//       }

//       const data = await response.json().catch(() => ({}))
//       if (!response.ok || !data?.success) {
//         setError(data?.message || "Could not create assignment.")
//         return
//       }

//       router.push("/assignments")
//     } catch (error) {
//       console.error(error)
//       setError("Could not create assignment. Please try again.")
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <div className="space-y-5">
//       <TopBar breadcrumbLabel="Create Assignment" />

//       <section className="rounded-[26px] border border-gray-200 bg-white px-5 py-4 shadow-[0_10px_24px_rgba(0,0,0,0.06)]">
//         <div className="flex flex-col gap-2">
//           <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-gray-500 uppercase">
//             <span className="size-2 rounded-full bg-[#22c55e]" />
//             Create assignment
//           </div>
//           <h1 className="text-[26px] font-semibold tracking-tight text-gray-900">
//             Create Assignment
//           </h1>
//           <p className="max-w-2xl text-sm text-gray-500">
//             Set up a new assignment, choose or create a subject, attach a PDF,
//             and define the question breakdown.
//           </p>
//         </div>
//       </section>

//       <form className="space-y-5" onSubmit={handleSubmit}>
//         <Card className="rounded-[30px] border border-gray-200 bg-white shadow-[0_16px_36px_rgba(0,0,0,0.08)]">
//           <CardContent className="space-y-6 p-6 md:p-8">
//             <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#e6e6e6]">
//               <div className="h-full w-[38%] rounded-full bg-[#111111]" />
//             </div>

//             <div className="rounded-[24px] border border-gray-200 bg-[#f7f7f7] p-5 md:p-6">
//               <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
//                 <div>
//                   <h2 className="text-[18px] font-semibold text-gray-900">
//                     Assignment Details
//                   </h2>
//                   <p className="text-sm text-gray-500">
//                     Basic information about your assignment.
//                   </p>
//                 </div>
//                 <Button
//                   type="button"
//                   variant="default"
//                   className="h-9 rounded-full border border-orange-400 bg-[#111111] px-4 text-xs font-semibold text-white shadow-sm hover:bg-[#1a1a1a]"
//                   onClick={() => setSubjectModalOpen(true)}
//                 >
//                   Create your own subject
//                 </Button>
//               </div>

//               <div className="mt-5 grid gap-5 md:grid-cols-2">
//                 <div className="space-y-2 md:col-span-2">
//                   <Label htmlFor="title">Assignment title</Label>
//                   <Input
//                     id="title"
//                     className="h-11 rounded-full border border-gray-200 bg-white text-gray-900 shadow-sm placeholder:text-gray-400"
//                     placeholder="Mid-term Algebra Review"
//                     value={title}
//                     onChange={(event) => setTitle(event.target.value)}
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="subject">Subject</Label>
//                   <select
//                     id="subject"
//                     className="h-11 w-full rounded-full border border-gray-200 bg-white px-4 text-sm text-gray-900 shadow-sm"
//                     value={subjectId}
//                     onChange={(event) => setSubjectId(event.target.value)}
//                     disabled={subjectsLoading}
//                   >
//                     <option value="">Select subject</option>
//                     {subjects.map((subject) => (
//                       <option key={subject._id} value={subject._id}>
//                         {subject.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="gradeLevel">Grade level</Label>
//                   <Input
//                     id="gradeLevel"
//                     className="h-11 rounded-full border border-gray-200 bg-white text-gray-900 shadow-sm placeholder:text-gray-400"
//                     placeholder="Grade 8"
//                     value={gradeLevel}
//                     onChange={(event) => setGradeLevel(event.target.value)}
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="schoolName">School name (optional)</Label>
//                   <Input
//                     id="schoolName"
//                     className="h-11 rounded-full border border-gray-200 bg-white text-gray-900 shadow-sm placeholder:text-gray-400"
//                     placeholder="Veda Public School"
//                     value={schoolName}
//                     onChange={(event) => setSchoolName(event.target.value)}
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="dueDate">Due date</Label>
//                   <Input
//                     id="dueDate"
//                     type="date"
//                     className="h-11 rounded-full border border-gray-200 bg-white text-gray-900 shadow-sm"
//                     value={dueDate}
//                     onChange={(event) => setDueDate(event.target.value)}
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="difficulty">Difficulty</Label>
//                   <select
//                     id="difficulty"
//                     className="h-11 w-full rounded-full border border-gray-200 bg-white px-4 text-sm text-gray-900 shadow-sm"
//                     value={difficulty}
//                     onChange={(event) => setDifficulty(event.target.value)}
//                   >
//                     {difficultyOptions.map((option) => (
//                       <option key={option.value} value={option.value}>
//                         {option.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>

//             <div className="rounded-[24px] border border-gray-200 bg-white p-6">
//               <div className="flex items-center gap-3">
//                 <div className="flex size-12 items-center justify-center rounded-full bg-[#f3f3f3] text-gray-600">
//                   <UploadCloud className="size-5" />
//                 </div>
//                 <div>
//                   <h3 className="text-sm font-semibold text-gray-900">
//                     Choose a PDF file or drag & drop it here
//                   </h3>
//                   <p className="text-xs text-gray-500">PDF only, up to 10MB</p>
//                 </div>
//               </div>
//               <div className="mt-4 flex flex-col items-start gap-3">
//                 <label
//                   htmlFor="pdfFile"
//                   className="inline-flex h-9 cursor-pointer items-center rounded-full border border-orange-400 bg-[#111111] px-5 text-xs font-semibold text-white shadow-sm"
//                 >
//                   Browse Files
//                 </label>
//                 <input
//                   id="pdfFile"
//                   type="file"
//                   accept="application/pdf"
//                   className="hidden"
//                   onChange={(event) => {
//                     const file = event.target.files?.[0] || null
//                     setPdfFile(file)
//                   }}
//                 />
//                 <p className="text-xs text-gray-500">
//                   Upload PDF documents up to 10MB.
//                 </p>
//               </div>

//               {pdfFile ? (
//                 <div className="mt-4 rounded-[18px] border border-gray-200 bg-[#f9f9f9] p-4">
//                   <div className="flex items-center justify-between gap-4">
//                     <div className="flex min-w-0 flex-1 items-center gap-3">
//                       <div className="flex size-12 flex-shrink-0 items-center justify-center rounded-lg border border-red-200 bg-red-50">
//                         <span className="text-xs font-semibold text-red-600">
//                           PDF
//                         </span>
//                       </div>
//                       <div className="min-w-0 flex-1">
//                         <p className="truncate text-sm font-medium text-gray-900">
//                           {pdfFile.name}
//                         </p>
//                         <p className="text-xs text-gray-500">
//                           {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
//                         </p>
//                       </div>
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() => setPdfFile(null)}
//                       className="flex size-8 flex-shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-red-50 hover:text-red-600"
//                     >
//                       <X className="size-4" />
//                     </button>
//                   </div>
//                 </div>
//               ) : null}
//             </div>

//             <div className="rounded-[24px] border border-gray-200 bg-white p-6">
//               <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//                 <div>
//                   <h2 className="text-[18px] font-semibold text-gray-900">
//                     Question Type
//                   </h2>
//                   <p className="text-sm text-gray-500">
//                     Choose the types, number of questions, and marks for each.
//                   </p>
//                 </div>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   className="rounded-full border-gray-900 px-4 text-xs font-semibold text-gray-900"
//                   onClick={handleAddBreakdown}
//                   disabled={!subjectId}
//                 >
//                   <Plus className="mr-2 size-3" />
//                   Add Question Type
//                 </Button>
//               </div>

//               {questionBreakdown.length === 0 ? (
//                 <div className="mt-4 rounded-[18px] border border-dashed border-gray-200 bg-[#f7f7f7] p-6 text-sm text-gray-500">
//                   Select a subject to load available question types.
//                 </div>
//               ) : (
//                 <div className="mt-4 space-y-3">
//                   <div className="grid grid-cols-[1.6fr,1fr,1fr,auto] gap-3 px-3 text-xs font-semibold text-gray-500">
//                     <div>Question Type</div>
//                     <div className="text-center">No. of Questions</div>
//                     <div className="text-center">Marks</div>
//                     <div></div>
//                   </div>
//                   {questionBreakdown.map((item, index) => (
//                     <div
//                       key={`${item.type}-${index}`}
//                       className="grid items-center gap-3 rounded-[18px] border border-gray-200 bg-[#f9f9f9] p-3 md:grid-cols-[1.6fr,1fr,1fr,auto]"
//                     >
//                       <select
//                         className="h-10 w-full rounded-full border border-gray-200 bg-white px-4 text-sm text-gray-900"
//                         value={item.type}
//                         onChange={(event) =>
//                           handleBreakdownChange(
//                             index,
//                             "type",
//                             event.target.value
//                           )
//                         }
//                       >
//                         {subjects
//                           .find((subject) => subject._id === subjectId)
//                           ?.questionTypes.map((type) => (
//                             <option key={type} value={type}>
//                               {type}
//                             </option>
//                           ))}
//                       </select>
//                       <div className="flex items-center justify-center gap-2">
//                         <button
//                           type="button"
//                           className="flex size-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600"
//                           onClick={() => {
//                             const count = Math.max(1, Number(item.count) - 1)
//                             handleBreakdownChange(index, "count", String(count))
//                           }}
//                         >
//                           <Minus className="size-3" />
//                         </button>
//                         <input
//                           type="number"
//                           min={1}
//                           className="h-9 w-12 rounded-full border border-gray-200 text-center text-sm text-gray-900"
//                           value={item.count}
//                           onChange={(event) =>
//                             handleBreakdownChange(
//                               index,
//                               "count",
//                               event.target.value
//                             )
//                           }
//                         />
//                         <button
//                           type="button"
//                           className="flex size-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600"
//                           onClick={() => {
//                             const count = Math.max(1, Number(item.count) + 1)
//                             handleBreakdownChange(index, "count", String(count))
//                           }}
//                         >
//                           <Plus className="size-3" />
//                         </button>
//                       </div>
//                       <div className="flex items-center justify-center gap-2">
//                         <button
//                           type="button"
//                           className="flex size-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600"
//                           onClick={() => {
//                             const marks = Math.max(
//                               0,
//                               Number(item.marksPerQuestion) - 1
//                             )
//                             handleBreakdownChange(
//                               index,
//                               "marksPerQuestion",
//                               String(marks)
//                             )
//                           }}
//                         >
//                           <Minus className="size-3" />
//                         </button>
//                         <input
//                           type="number"
//                           min={0}
//                           className="h-9 w-12 rounded-full border border-gray-200 text-center text-sm text-gray-900"
//                           value={item.marksPerQuestion}
//                           onChange={(event) =>
//                             handleBreakdownChange(
//                               index,
//                               "marksPerQuestion",
//                               event.target.value
//                             )
//                           }
//                         />
//                         <button
//                           type="button"
//                           className="flex size-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600"
//                           onClick={() => {
//                             const marks = Math.max(
//                               0,
//                               Number(item.marksPerQuestion) + 1
//                             )
//                             handleBreakdownChange(
//                               index,
//                               "marksPerQuestion",
//                               String(marks)
//                             )
//                           }}
//                         >
//                           <Plus className="size-3" />
//                         </button>
//                       </div>
//                       <button
//                         type="button"
//                         className="flex size-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500"
//                         onClick={() => handleRemoveBreakdown(index)}
//                         disabled={questionBreakdown.length === 1}
//                       >
//                         <X className="size-4" />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               <div className="mt-4 flex flex-wrap gap-4 rounded-[16px] bg-[#f3f3f3] px-4 py-3 text-sm text-gray-500">
//                 <span>Total questions: {totals.totalQuestions}</span>
//                 <span>Total marks: {totals.totalMarks}</span>
//               </div>
//             </div>

//             <div className="rounded-[24px] border border-gray-200 bg-white p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h2 className="text-[18px] font-semibold text-gray-900">
//                     Additional Information
//                   </h2>
//                   <p className="text-sm text-gray-500">
//                     Provide extra context for better output.
//                   </p>
//                 </div>
//               </div>
//               <div className="relative mt-4">
//                 <Textarea
//                   id="instructions"
//                   rows={4}
//                   className="rounded-[18px] border border-gray-200 bg-[#fafafa] pr-12 text-gray-900 shadow-sm placeholder:text-gray-400"
//                   placeholder="e.g. Generate a question paper for 3 hour exam duration..."
//                   value={additionalInstructions}
//                   onChange={(event) =>
//                     setAdditionalInstructions(event.target.value)
//                   }
//                 />
//                 <button
//                   type="button"
//                   className="absolute right-3 bottom-3 flex size-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500"
//                 >
//                   <Mic className="size-4" />
//                 </button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {error ? (
//           <div className="rounded-[18px] border border-dashed border-gray-200 bg-white p-4 text-sm text-red-600 shadow-sm">
//             {error}
//           </div>
//         ) : null}

//         <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
//           <Button
//             type="button"
//             variant="outline"
//             className="h-11 rounded-full border-gray-300 px-5"
//             onClick={() => router.back()}
//           >
//             Cancel
//           </Button>
//           <Button
//             type="submit"
//             disabled={isSubmitting}
//             className="h-11 rounded-full border border-orange-400 bg-[#111111] px-6 text-white shadow-[0_12px_28px_rgba(0,0,0,0.18)] hover:bg-[#1a1a1a]"
//           >
//             {isSubmitting ? "Creating..." : "Create assignment"}
//           </Button>
//         </div>
//       </form>

//       {subjectModalOpen ? (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
//           <div className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
//             <div className="flex items-start justify-between gap-4">
//               <div>
//                 <h2 className="text-lg font-semibold text-gray-900">
//                   Create a new subject
//                 </h2>
//                 <p className="text-sm text-gray-500">
//                   Add a custom subject and the question types it should offer.
//                 </p>
//               </div>
//               <Button
//                 type="button"
//                 variant="ghost"
//                 onClick={() => setSubjectModalOpen(false)}
//               >
//                 Close
//               </Button>
//             </div>

//             <div className="mt-5 space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="newSubjectName" className="text-gray-700">
//                   Subject name
//                 </Label>
//                 <Input
//                   id="newSubjectName"
//                   className="h-11 rounded-full border-gray-300 bg-white text-gray-900 placeholder:text-gray-500"
//                   placeholder="Mathematics"
//                   value={newSubjectName}
//                   onChange={(event) => setNewSubjectName(event.target.value)}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="newSubjectTypes" className="text-gray-700">
//                   Question types separated by commas
//                 </Label>
//                 <Textarea
//                   id="newSubjectTypes"
//                   rows={4}
//                   className="rounded-[18px] border border-gray-300 bg-white text-gray-900 placeholder:text-gray-500"
//                   placeholder="MCQ, Short Answer, Long Answer"
//                   value={newSubjectTypes}
//                   onChange={(event) => setNewSubjectTypes(event.target.value)}
//                 />
//               </div>

//               <div className="flex justify-end gap-3 pt-2">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   className="rounded-full"
//                   onClick={() => setSubjectModalOpen(false)}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   type="button"
//                   className="rounded-full border border-orange-400 bg-[#111111] text-white hover:bg-[#1a1a1a]"
//                   onClick={handleCreateSubject}
//                   disabled={subjectCreateLoading}
//                 >
//                   {subjectCreateLoading ? "Creating..." : "Create subject"}
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       ) : null}
//     </div>
//   )
// }


"use client"

import { useEffect, useMemo, useState } from "react"
import type { FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Mic, Minus, Plus, UploadCloud, X } from "lucide-react"
import { TopBar } from "@/components/veda/topbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const difficultyOptions = [
  { label: "Easy", value: "easy" },
  { label: "Medium", value: "medium" },
  { label: "Hard", value: "hard" },
  { label: "Mixed", value: "mixed" },
]

type Subject = {
  _id: string
  name: string
  questionTypes: string[]
}

type BreakdownItem = {
  type: string
  count: string
  marksPerQuestion: string
}

export default function CreateAssignmentPage() {
  const router = useRouter()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [subjectsLoading, setSubjectsLoading] = useState(true)
  const [subjectId, setSubjectId] = useState("")
  const [subjectModalOpen, setSubjectModalOpen] = useState(false)
  const [newSubjectName, setNewSubjectName] = useState("")
  const [newSubjectTypes, setNewSubjectTypes] = useState("")
  const [subjectCreateLoading, setSubjectCreateLoading] = useState(false)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [title, setTitle] = useState("")
  const [gradeLevel, setGradeLevel] = useState("")
  const [schoolName, setSchoolName] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [difficulty, setDifficulty] = useState("mixed")
  const [additionalInstructions, setAdditionalInstructions] = useState("")
  const [questionBreakdown, setQuestionBreakdown] = useState<BreakdownItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchSubjects = async () => {
    setSubjectsLoading(true)
    try {
      const response = await fetch("/api/subjects", { credentials: "include" })
      if (response.status === 401) { router.replace("/signin"); return }
      if (!response.ok) throw new Error("Failed to load subjects")
      const data = await response.json()
      setSubjects(data?.data || [])
    } catch (error) {
      console.error(error)
      setSubjects([])
    } finally {
      setSubjectsLoading(false)
    }
  }

  useEffect(() => { fetchSubjects() }, [router])

  useEffect(() => {
    if (!subjectId) { setQuestionBreakdown([]); return }
    const subject = subjects.find((item) => item._id === subjectId)
    if (!subject) return
    setQuestionBreakdown(
      subject.questionTypes.map((type) => ({ type, count: "1", marksPerQuestion: "1" }))
    )
  }, [subjectId, subjects])

  const totals = useMemo(() => {
    return questionBreakdown.reduce(
      (acc, item) => {
        const count = Number(item.count) || 0
        const marks = Number(item.marksPerQuestion) || 0
        return { totalQuestions: acc.totalQuestions + count, totalMarks: acc.totalMarks + count * marks }
      },
      { totalQuestions: 0, totalMarks: 0 }
    )
  }, [questionBreakdown])

  const handleBreakdownChange = (index: number, field: keyof BreakdownItem, value: string) => {
    setQuestionBreakdown((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    )
  }

  const handleAddBreakdown = () => {
    const subject = subjects.find((item) => item._id === subjectId)
    const fallbackType = subject?.questionTypes[0] || ""
    if (!fallbackType) return
    setQuestionBreakdown((prev) => [...prev, { type: fallbackType, count: "1", marksPerQuestion: "1" }])
  }

  const handleRemoveBreakdown = (index: number) => {
    setQuestionBreakdown((prev) => prev.filter((_, i) => i !== index))
  }

  const handleCreateSubject = async () => {
    setError(null)
    const name = newSubjectName.trim()
    const questionTypes = newSubjectTypes.split(",").map((item) => item.trim()).filter(Boolean)
    if (!name) { setError("Subject name is required."); return }
    if (questionTypes.length === 0) { setError("Add at least one question type."); return }
    if (new Set(questionTypes).size !== questionTypes.length) { setError("Question types must be unique."); return }
    setSubjectCreateLoading(true)
    try {
      const response = await fetch("/api/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, questionTypes }),
      })
      if (response.status === 401) { router.replace("/signin"); return }
      const data = await response.json().catch(() => ({}))
      if (!response.ok || !data?.success) { setError(data?.message || "Could not create subject."); return }
      await fetchSubjects()
      if (data?.data?.id) setSubjectId(data.data.id)
      setNewSubjectName(""); setNewSubjectTypes(""); setSubjectModalOpen(false)
    } catch (error) {
      console.error(error); setError("Could not create subject. Please try again.")
    } finally {
      setSubjectCreateLoading(false)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    if (!title.trim()) { setError("Title is required."); return }
    if (!subjectId) { setError("Subject is required."); return }
    if (!gradeLevel.trim()) { setError("Grade level is required."); return }
    if (!dueDate) { setError("Due date is required."); return }
    if (questionBreakdown.length === 0) { setError("Add at least one question type."); return }
    const typeSet = new Set(questionBreakdown.map((item) => item.type))
    if (typeSet.size !== questionBreakdown.length) { setError("Question types must be unique."); return }
    const hasInvalid = questionBreakdown.some((item) => {
      const count = Number(item.count); const marks = Number(item.marksPerQuestion)
      return isNaN(count) || isNaN(marks) || count < 1 || marks < 0
    })
    if (hasInvalid) { setError("Counts must be ≥ 1 and marks cannot be negative."); return }
    setIsSubmitting(true)
    try {
      const payload = {
        title: title.trim(), subjectId, gradeLevel: gradeLevel.trim(),
        schoolName: schoolName.trim() || undefined, dueDate, difficulty,
        additionalInstructions: additionalInstructions.trim() || undefined,
        questionBreakdown: questionBreakdown.map((item) => ({
          type: item.type, count: Number(item.count), marksPerQuestion: Number(item.marksPerQuestion),
        })),
      }
      const formData = new FormData()
      formData.append("payload", JSON.stringify(payload))
      if (pdfFile) formData.append("pdfFile", pdfFile)
      const response = await fetch("/api/assignments", { method: "POST", credentials: "include", body: formData })
      if (response.status === 401) { router.replace("/signin"); return }
      const data = await response.json().catch(() => ({}))
      if (!response.ok || !data?.success) { setError(data?.message || "Could not create assignment."); return }
      router.push("/assignments")
    } catch (error) {
      console.error(error); setError("Could not create assignment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) setPdfFile(file)
  }

  return (
    <div className="space-y-5">
      <TopBar breadcrumbLabel="Create Assignment" />

      <form className="space-y-5" onSubmit={handleSubmit}>
        <Card className="rounded-[30px] border border-gray-200 bg-white shadow-[0_16px_36px_rgba(0,0,0,0.08)]">
          <CardContent className="space-y-6 p-6 md:p-8">

            {/* Progress bar */}
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#e6e6e6]">
              <div className="h-full w-[38%] rounded-full bg-[#111111]" />
            </div>

            {/* Section header */}
            <div>
              <h2 className="text-[18px] font-semibold text-gray-900">Assignment Details</h2>
              <p className="text-sm text-gray-500">Basic information about your assignment</p>
            </div>

            {/* ── File Upload Drop Zone (Figma-exact centered dashed box) ── */}
            <div
              className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition ${
                isDragging ? "border-orange-400 bg-orange-50" : "border-gray-300 bg-[#fafafa]"
              }`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <UploadCloud className="mb-3 size-8 text-gray-400" />
              {pdfFile ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">{pdfFile.name}</span>
                  <button
                    type="button"
                    onClick={() => setPdfFile(null)}
                    className="flex size-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:text-red-600"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-sm font-medium text-gray-700">Choose a file or drag &amp; drop it here</p>
                  <p className="mt-1 text-xs text-gray-400">JPEG, PNG, upto 10MB</p>
                </>
              )}
              <label
                htmlFor="pdfFile"
                className="mt-4 inline-flex h-9 cursor-pointer items-center rounded-lg border border-gray-300 bg-white px-5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Browse Files
              </label>
              <input
                id="pdfFile"
                type="file"
                accept="application/pdf,image/*"
                className="hidden"
                onChange={(e) => { const file = e.target.files?.[0] || null; setPdfFile(file) }}
              />
              {!pdfFile && (
                <p className="mt-2 text-xs text-gray-400">Upload images of your preferred document/image</p>
              )}
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <div className="relative">
                <Input
                  id="dueDate"
                  type="date"
                  className="h-11 rounded-xl border border-gray-200 bg-white text-gray-900 shadow-sm"
                  placeholder="DD-MM-YYYY"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>

            {/* Assignment details fields */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Assignment title</Label>
                <Input
                  id="title"
                  className="h-11 rounded-xl border border-gray-200 bg-white text-gray-900 shadow-sm placeholder:text-gray-400"
                  placeholder="Mid-term Algebra Review"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <select
                  id="subject"
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 shadow-sm"
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  disabled={subjectsLoading}
                >
                  <option value="">Select subject</option>
                  {subjects.map((s) => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gradeLevel">Grade level</Label>
                <Input
                  id="gradeLevel"
                  className="h-11 rounded-xl border border-gray-200 bg-white shadow-sm placeholder:text-gray-400"
                  placeholder="Grade 8"
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="schoolName">School name (optional)</Label>
                <Input
                  id="schoolName"
                  className="h-11 rounded-xl border border-gray-200 bg-white shadow-sm placeholder:text-gray-400"
                  placeholder="Veda Public School"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <select
                  id="difficulty"
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 shadow-sm"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  {difficultyOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Create own subject link */}
            <div>
              <button
                type="button"
                className="text-sm font-medium text-gray-600 underline hover:text-gray-900"
                onClick={() => setSubjectModalOpen(true)}
              >
                + Create your own subject
              </button>
            </div>

            {/* ── Question Type Section (Figma-exact layout) ── */}
            <div>
              <h2 className="text-[17px] font-semibold text-gray-900">Question Type</h2>

              {questionBreakdown.length === 0 ? (
                <div className="mt-3 rounded-xl border border-dashed border-gray-200 bg-[#f7f7f7] p-5 text-sm text-gray-400">
                  Select a subject to load question types.
                </div>
              ) : (
                <div className="mt-3 space-y-2">
                  {/* Column headers */}
                  <div className="grid grid-cols-[1fr,auto,1fr,1fr] items-center gap-3 px-1 text-xs font-semibold text-gray-500">
                    <div>Question Type</div>
                    <div />
                    <div className="text-center">No. of Questions</div>
                    <div className="text-center">Marks</div>
                  </div>

                  {questionBreakdown.map((item, index) => (
                    <div
                      key={`${item.type}-${index}`}
                      className="grid grid-cols-[1fr,auto,1fr,1fr] items-center gap-3 rounded-xl border border-gray-200 bg-white p-3"
                    >
                      {/* Type dropdown */}
                      <select
                        className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900"
                        value={item.type}
                        onChange={(e) => handleBreakdownChange(index, "type", e.target.value)}
                      >
                        {subjects
                          .find((s) => s._id === subjectId)
                          ?.questionTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                      </select>

                      {/* × remove button — right after dropdown */}
                      <button
                        type="button"
                        className="flex size-7 items-center justify-center rounded-full border border-gray-200 bg-[#f5f5f5] text-gray-400 hover:text-red-500"
                        onClick={() => handleRemoveBreakdown(index)}
                      >
                        <X className="size-3.5" />
                      </button>

                      {/* No. of Questions stepper */}
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          className="flex size-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600"
                          onClick={() => handleBreakdownChange(index, "count", String(Math.max(1, Number(item.count) - 1)))}
                        >
                          <Minus className="size-3" />
                        </button>
                        <input
                          type="number"
                          min={1}
                          className="h-8 w-10 rounded-lg border border-gray-200 text-center text-sm text-gray-900"
                          value={item.count}
                          onChange={(e) => handleBreakdownChange(index, "count", e.target.value)}
                        />
                        <button
                          type="button"
                          className="flex size-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600"
                          onClick={() => handleBreakdownChange(index, "count", String(Number(item.count) + 1))}
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>

                      {/* Marks stepper */}
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          className="flex size-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600"
                          onClick={() => handleBreakdownChange(index, "marksPerQuestion", String(Math.max(0, Number(item.marksPerQuestion) - 1)))}
                        >
                          <Minus className="size-3" />
                        </button>
                        <input
                          type="number"
                          min={0}
                          className="h-8 w-10 rounded-lg border border-gray-200 text-center text-sm text-gray-900"
                          value={item.marksPerQuestion}
                          onChange={(e) => handleBreakdownChange(index, "marksPerQuestion", e.target.value)}
                        />
                        <button
                          type="button"
                          className="flex size-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600"
                          onClick={() => handleBreakdownChange(index, "marksPerQuestion", String(Number(item.marksPerQuestion) + 1))}
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ⊕ Add Question Type — text link style matching Figma */}
              <button
                type="button"
                className="mt-3 flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 disabled:opacity-40"
                onClick={handleAddBreakdown}
                disabled={!subjectId}
              >
                <span className="flex size-5 items-center justify-center rounded-full border-2 border-gray-500 text-xs font-bold text-gray-500">+</span>
                Add Question Type
              </button>

              {/* Totals — right-aligned matching Figma */}
              {questionBreakdown.length > 0 && (
                <div className="mt-3 flex justify-end gap-6 text-sm text-gray-600">
                  <span>Total Questions : <strong>{totals.totalQuestions}</strong></span>
                  <span>Total Marks : <strong>{totals.totalMarks}</strong></span>
                </div>
              )}
            </div>

            {/* ── Additional Information ── */}
            <div>
              <h2 className="text-[17px] font-semibold text-gray-900">
                Additional Information <span className="font-normal text-gray-400">(For better output)</span>
              </h2>
              <div className="relative mt-3">
                <Textarea
                  rows={4}
                  className="rounded-xl border border-gray-200 bg-[#fafafa] pr-12 text-gray-900 shadow-sm placeholder:text-gray-400"
                  placeholder="e.g Generate a question paper for 3 hour exam duration..."
                  value={additionalInstructions}
                  onChange={(e) => setAdditionalInstructions(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 bottom-3 flex size-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400"
                >
                  <Mic className="size-4" />
                </button>
              </div>
            </div>

          </CardContent>
        </Card>

        {error && (
          <div className="rounded-xl border border-dashed border-red-200 bg-white p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* ── Previous / Next buttons (Figma-exact) ── */}
        <div className="flex items-center justify-between pb-4">
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-full border-gray-300 px-6 text-sm"
            onClick={() => router.back()}
          >
            ← Previous
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-10 rounded-full border border-orange-400 bg-[#111111] px-6 text-sm text-white shadow-[0_12px_28px_rgba(0,0,0,0.18)] hover:bg-[#1a1a1a]"
          >
            {isSubmitting ? "Creating..." : "Next →"}
          </Button>
        </div>
      </form>

      {/* Create Subject Modal */}
      {subjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Create a new subject</h2>
                <p className="text-sm text-gray-500">Add a custom subject and its question types.</p>
              </div>
              <Button type="button" variant="ghost" onClick={() => setSubjectModalOpen(false)}>Close</Button>
            </div>
            <div className="mt-5 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newSubjectName">Subject name</Label>
                <Input
                  id="newSubjectName"
                  className="h-11 rounded-xl border-gray-300 bg-white"
                  placeholder="Mathematics"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newSubjectTypes">Question types (comma-separated)</Label>
                <Textarea
                  id="newSubjectTypes"
                  rows={4}
                  className="rounded-xl border border-gray-300 bg-white"
                  placeholder="MCQ, Short Answer, Long Answer"
                  value={newSubjectTypes}
                  onChange={(e) => setNewSubjectTypes(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" className="rounded-full" onClick={() => setSubjectModalOpen(false)}>Cancel</Button>
                <Button
                  type="button"
                  className="rounded-full border border-orange-400 bg-[#111111] text-white hover:bg-[#1a1a1a]"
                  onClick={handleCreateSubject}
                  disabled={subjectCreateLoading}
                >
                  {subjectCreateLoading ? "Creating..." : "Create subject"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}