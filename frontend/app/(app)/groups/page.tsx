"use client"

import Link from "next/link"
import { TopBar } from "@/components/veda/topbar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function GroupsPage() {
  return (
    <div className="space-y-5">
      <TopBar breadcrumbLabel="My Groups" />
      <Card className="rounded-[28px] border border-gray-200 bg-white shadow-[0_14px_32px_rgba(0,0,0,0.08)]">
        <CardContent className="p-8 text-center">
          <div className="mx-auto mb-4 size-12 rounded-full bg-[#111111] text-white shadow-[0_10px_24px_rgba(0,0,0,0.2)]">
            <span className="flex h-full items-center justify-center text-lg font-semibold">
              G
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Coming soon</h1>
          <p className="mt-2 text-sm text-gray-500">
            We are building group spaces for co-teachers and shared classes.
          </p>
          <Button
            asChild
            className="mt-6 rounded-full border border-orange-400 bg-[#111111] px-6 text-white hover:bg-[#1a1a1a]"
          >
            <Link href="/assignments">Back to assignments</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
