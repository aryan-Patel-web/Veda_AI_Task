"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TopBar } from "@/components/veda/topbar"

type Question = {
  number: number
  text: string
  type: string
  difficulty: string
  marks: number
  options?: string[]
  answer?: string
  solution?: string
}

type Section = {
  title: string
  instruction: string
  questions: Question[]
}

type Result = {
  _id: string
  assignmentId: string
  sections: Section[]
  answerKey?: { number: number; answer: string; solution?: string }[]
  pdfUrl?: string
}

type Assignment = {
  _id: string
  subjectId: string
  gradeLevel: string
  schoolName?: string
}

type Subject = {
  _id: string
  name: string
}

export default function AssignmentResultPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id
  const [result, setResult] = useState<Result | null>(null)
  const [assignment, setAssignment] = useState<Assignment | null>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const totals = useMemo(() => {
    if (!result) {
      return { totalQuestions: 0, totalMarks: 0 }
    }
    return result.sections.reduce(
      (acc, section) => {
        section.questions.forEach((question) => {
          acc.totalQuestions += 1
          acc.totalMarks += question.marks
        })
        return acc
      },
      { totalQuestions: 0, totalMarks: 0 }
    )
  }, [result])

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    fetch(`/api/assignments/${id}/result`, { credentials: "include" })
      .then(async (res) => {
        if (res.status === 401) {
          router.replace("/signin")
          return null
        }
        if (!res.ok) throw new Error("Failed to load result")
        const data = await res.json()
        return data?.data
      })
      .then((data) => setResult(data))
      .catch((err) => {
        console.error(err)
        setError("Could not load result")
      })
      .finally(() => setLoading(false))
  }, [id, router])

  useEffect(() => {
    if (!id) return
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
        setAssignment(null)
      })
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
      <TopBar breadcrumbLabel="Result" />

      {loading ? (
        <div className="rounded-[22px] border border-border bg-card p-6 text-sm text-muted-foreground shadow-sm">
          Loading result...
        </div>
      ) : error ? (
        <div className="rounded-[22px] border border-dashed border-border bg-card p-6 text-sm text-red-600 shadow-sm">
          {error}
        </div>
      ) : !result ? (
        <div className="rounded-[22px] border border-dashed border-border bg-card p-6 text-sm text-muted-foreground shadow-sm">
          Result not found.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-[28px] bg-[#111111] px-6 py-5 text-white shadow-[0_16px_36px_rgba(0,0,0,0.2)]">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <div className="text-xs font-semibold tracking-[0.18em] text-white/60 uppercase">
                  Generated Result
                </div>
                <h1 className="text-2xl font-semibold tracking-tight md:text-[30px]">
                  Question Paper
                </h1>
                <p className="text-sm text-white/70">Result ID: {result._id}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {result.pdfUrl ? (
                  <a href={result.pdfUrl} target="_blank" rel="noreferrer">
                    <Button className="h-10 rounded-full border border-orange-400 bg-white px-5 text-sm font-semibold text-[#111111] hover:bg-white/90">
                      Download as PDF
                    </Button>
                  </a>
                ) : null}
                <Button
                  variant="outline"
                  className="h-10 rounded-full border-white/30 bg-white/10 px-5 text-white hover:bg-white/20"
                  onClick={() => router.back()}
                >
                  Back
                </Button>
              </div>
            </div>
          </div>

          <Card className="rounded-[30px] border border-gray-200 bg-white shadow-[0_16px_36px_rgba(0,0,0,0.08)]">
            <CardContent className="p-8 md:p-10">
              <div className="space-y-1 text-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  {assignment?.schoolName || "Veda Public School"}
                </h2>
                <p className="text-sm text-gray-500">Subject: {subjectName}</p>
                <p className="text-sm text-gray-500">
                  Class: {assignment?.gradeLevel || "-"}
                </p>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-[#f9f9f9] px-4 py-3 text-sm">
                  <span className="text-gray-500">Total Questions</span>
                  <span className="font-semibold text-gray-900">
                    {totals.totalQuestions}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-[#f9f9f9] px-4 py-3 text-sm">
                  <span className="text-gray-500">Total Marks</span>
                  <span className="font-semibold text-gray-900">
                    {totals.totalMarks}
                  </span>
                </div>
              </div>

              <div className="mt-8 space-y-8">
                {result.sections.map((section, sIndex) => (
                  <div key={sIndex} className="space-y-3">
                    <div className="text-center">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {section.title}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {section.instruction}
                      </p>
                    </div>
                    <div className="space-y-4">
                      {section.questions.map((q) => (
                        <div key={q.number} className="text-sm text-gray-900">
                          <div className="font-medium">
                            {q.number}. {q.text}
                          </div>
                          {q.options?.length ? (
                            <ul className="mt-2 list-disc pl-5 text-sm text-gray-700">
                              {q.options.map((opt, i) => (
                                <li key={i}>{opt}</li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[26px] border border-gray-200 bg-white shadow-[0_12px_28px_rgba(0,0,0,0.08)]">
            <CardContent className="p-6">
              <h3 className="text-xs font-semibold tracking-[0.16em] text-gray-500 uppercase">
                Answer Key
              </h3>
              {result.answerKey?.length ? (
                <div className="mt-4 space-y-3 text-sm text-gray-900">
                  {result.answerKey.map((a) => (
                    <div
                      key={a.number}
                      className="rounded-[16px] border border-gray-200 bg-[#f9f9f9] px-4 py-3"
                    >
                      <span className="font-semibold">{a.number}.</span>{" "}
                      {a.answer}
                      {a.solution ? (
                        <span className="text-gray-500"> - {a.solution}</span>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-3 text-sm text-gray-500">
                  No answer key available.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
