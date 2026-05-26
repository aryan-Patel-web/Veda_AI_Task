"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { TopBar } from "@/components/veda/topbar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Assignment = {
  _id: string
  title: string
  subjectId: string
  gradeLevel: string
  schoolName?: string
  dueDate: string
  questionBreakdown: { type: string; count: number; marksPerQuestion: number }[]
  totalQuestions: number
  totalMarks: number
  difficulty: string
  additionalInstructions?: string
  sourcePdfUrl?: string
  sourcePdfName?: string
  status: string
  createdAt: string
}

type Subject = {
  _id: string
  name: string
}

export default function AssignmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id
  const [assignment, setAssignment] = useState<Assignment | null>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [buttonLoading, setButtonLoading] = useState(false)
  const [showNoResultToast, setShowNoResultToast] = useState(false)

  useEffect(() => {
    if (!showNoResultToast) return
    const timeout = setTimeout(() => setShowNoResultToast(false), 3000)
    return () => clearTimeout(timeout)
  }, [showNoResultToast])

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    fetch(`/api/assignments/${id}`, { credentials: "include" })
      .then(async (res) => {
        if (res.status === 401) {
          router.replace("/signin")
          return null
        }
        if (!res.ok) throw new Error("Failed to load assignment")
        const data = await res.json()
        return data?.data
      })
      .then((data) => setAssignment(data))
      .catch((err) => {
        console.error(err)
        setError("Could not load assignment")
      })
      .finally(() => setLoading(false))
  }, [id, router])

  useEffect(() => {
    fetch("/api/subjects", { credentials: "include" })
      .then(async (res) => {
        if (res.status === 401) {
          router.replace("/signin")
          return null
        }
        if (!res.ok) throw new Error("Failed to load subjects")
        const data = await res.json()
        return data?.data || []
      })
      .then((data) => setSubjects(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error(err)
        setSubjects([])
      })
  }, [router])

  const subjectName = useMemo(() => {
    if (!assignment?.subjectId) return "-"
    return (
      subjects.find((subject) => subject._id === assignment.subjectId)?.name ||
      assignment.subjectId
    )
  }, [assignment?.subjectId, subjects])

  return (
    <div className="space-y-5">
      <TopBar breadcrumbLabel={assignment?.title || "Assignment"} />

      {loading ? (
        <div className="rounded-[22px] border border-border bg-card p-6 text-sm text-muted-foreground shadow-sm">
          Loading...
        </div>
      ) : error ? (
        <div className="rounded-[22px] border border-dashed border-border bg-card p-6 text-sm text-red-600 shadow-sm">
          {error}
        </div>
      ) : !assignment ? (
        <div className="rounded-[22px] border border-dashed border-border bg-card p-6 text-sm text-muted-foreground shadow-sm">
          Assignment not found.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-[28px] bg-[#111111] px-6 py-5 text-white shadow-[0_16px_36px_rgba(0,0,0,0.2)]">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <div className="text-xs font-semibold tracking-[0.18em] text-white/60 uppercase">
                  Assignment overview
                </div>
                <h1 className="text-2xl font-semibold tracking-tight md:text-[30px]">
                  {assignment.title}
                </h1>
                <p className="text-sm text-white/70">
                  Created for {assignment.gradeLevel} with{" "}
                  {assignment.totalQuestions} questions and{" "}
                  {assignment.totalMarks} marks.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  disabled={buttonLoading}
                  className="h-10 rounded-full border border-orange-400 bg-white px-5 text-sm font-semibold text-[#111111] shadow-sm hover:bg-white/90"
                  onClick={async () => {
                    if (!id || buttonLoading) return
                    setButtonLoading(true)
                    try {
                      const res = await fetch(`/api/assignments/${id}/result`, {
                        credentials: "include",
                      })
                      if (res.status === 401) {
                        router.replace("/signin")
                        return
                      }
                      if (!res.ok) throw new Error("Failed to fetch result")
                      const json = await res.json()
                      const result = json?.data
                      if (!result || !result._id) {
                        setShowNoResultToast(true)
                        return
                      }
                      router.push(`/assignments/${id}/result/`)
                    } catch (err) {
                      console.error(err)
                    } finally {
                      setButtonLoading(false)
                    }
                  }}
                >
                  {buttonLoading ? "Loading..." : "View Result"}
                </Button>
                <Button
                  variant="outline"
                  className="h-10 rounded-full border-white/30 bg-white/10 px-5 text-white hover:bg-white/20"
                  onClick={() => router.push("/assignments")}
                >
                  Back to list
                </Button>
              </div>
            </div>
          </div>

          <Card className="rounded-[30px] border border-gray-200 bg-white shadow-[0_14px_32px_rgba(0,0,0,0.08)]">
            <CardContent className="p-8 md:p-10">
              <div className="space-y-1 text-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  {assignment.schoolName || "Your School"}
                </h2>
                <p className="text-sm text-gray-500">Subject: {subjectName}</p>
                <p className="text-sm text-gray-500">
                  Class: {assignment.gradeLevel}
                </p>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {[
                  {
                    label: "Assigned on",
                    value: new Date(assignment.createdAt).toLocaleDateString(),
                  },
                  {
                    label: "Due date",
                    value: new Date(assignment.dueDate).toLocaleDateString(),
                  },
                  {
                    label: "Total Questions",
                    value: String(assignment.totalQuestions),
                  },
                  {
                    label: "Total Marks",
                    value: String(assignment.totalMarks),
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-xl border border-gray-200 bg-[#f9f9f9] px-4 py-3 text-sm"
                  >
                    <span className="text-gray-500">{item.label}</span>
                    <span className="font-semibold text-gray-900">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-gray-200 bg-[#f7f7f7] px-4 py-4 text-sm text-gray-700">
                <div className="text-xs font-semibold tracking-[0.16em] text-gray-500 uppercase">
                  Additional instructions
                </div>
                <p className="mt-2">
                  {assignment.additionalInstructions ||
                    "No additional instructions provided."}
                </p>
              </div>

              <div className="mt-4 rounded-2xl border border-gray-200 bg-[#f7f7f7] px-4 py-4 text-sm text-gray-700">
                <div className="text-xs font-semibold tracking-[0.16em] text-gray-500 uppercase">
                  Attached PDF
                </div>
                {assignment.sourcePdfUrl ? (
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-sm text-gray-700">
                      {assignment.sourcePdfName || "Source PDF"}
                    </span>
                    <a
                      href={assignment.sourcePdfUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button
                        variant="outline"
                        className="h-9 rounded-full border-gray-300 px-4 text-sm"
                      >
                        Open PDF
                      </Button>
                    </a>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-gray-500">No PDF attached.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border border-gray-200 bg-white shadow-[0_12px_28px_rgba(0,0,0,0.08)]">
            <CardContent className="p-6">
              <h3 className="text-xs font-semibold tracking-[0.16em] text-gray-500 uppercase">
                Question Breakdown
              </h3>
              <div className="mt-4 space-y-3">
                {assignment.questionBreakdown.map((q, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-[16px] border border-gray-200 bg-[#f9f9f9] px-4 py-3"
                  >
                    <div className="text-sm font-medium text-gray-900">
                      {q.type}
                    </div>
                    <div className="text-sm text-gray-500">
                      {q.count} x {q.marksPerQuestion} marks
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showNoResultToast ? (
        <div className="fixed right-6 bottom-6 z-50 rounded-[18px] border border-border bg-card px-4 py-3 text-sm text-foreground shadow-[0_16px_40px_rgba(17,17,17,0.15)]">
          No result exists yet for this assignment.
        </div>
      ) : null}
    </div>
  )
}
