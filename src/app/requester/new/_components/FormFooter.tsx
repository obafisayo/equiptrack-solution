'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export function FormFooter() {
  return (
    <div className="flex items-center justify-between py-2">
      <Link href="/requester" className="text-sm text-gray-500 hover:text-gray-700 font-medium">
        Cancel
      </Link>
      <Button
        type="submit"
        variant="brand"
        size="lg"
        icon={<ArrowRight size={15} />}
        iconPosition="right"
      >
        Submit Request
      </Button>
    </div>
  )
}
