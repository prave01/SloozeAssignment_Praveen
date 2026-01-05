'use client'

import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { GetPaymentMethods, TogglePaymentMethod } from '@/server/serverFn'
import { useEffect, useState } from 'react'
import { CreatePaymentDialog } from './CreatePaymentMethod'
import { toast } from 'sonner'
import { CreditCard, CheckCircle2, XCircle } from 'lucide-react'

type PaymentMethod = {
  id: string
  name: string
  isEnabled: boolean
  image?: string | null
}

export function PaymentMethods() {
  const [methods, setMethods] = useState<PaymentMethod[]>([])
  const [loadingId, setLoadingId] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      const data = await GetPaymentMethods()
      setMethods(data)
    })()
  }, [])

  const handleToggle = async (id: string, next: boolean) => {
    // optimistic update
    setMethods((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isEnabled: next } : m))
    )

    setLoadingId(id)

    try {
      await TogglePaymentMethod(id, next)
      toast.success('Updated')
    } catch {
      // rollback
      setMethods((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isEnabled: !next } : m))
      )
      toast.error('Failed to update')
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="p-5 w-full">
      <Card
        className="rounded-none border border-myborder bg-transparent
          backdrop-blur-md w-full p-0 gap-0"
      >
        <CardTitle
          className="w-full flex items-center justify-between py-2 px-3 border-b
            border-myborder text-md"
        >
          Payment Methods
          <CreatePaymentDialog />
        </CardTitle>

        <CardContent
          className="flex flex-row flex-wrap gap-4 py-4 px-4 bg-accent/80
            min-h-48"
        >
          {methods.length === 0 ? (
            <div
              className="flex w-full h-48 flex-col items-center justify-center
                gap-2 text-center"
            >
              <div
                className="h-12 w-12 rounded-full bg-muted flex items-center
                  justify-center text-muted-foreground"
              >
                <CreditCard className="size-6" />
              </div>

              <p className="text-sm font-medium text-muted-foreground">
                No payment methods found
              </p>

              <p className="text-xs text-muted-foreground">
                Add a payment method to get started
              </p>
            </div>
          ) : (
            methods.map((item) => (
              <Card
                key={item.id}
                className={`rounded-md border border-myborder bg-background/50
                  p-4 min-w-64 w-64 flex-shrink-0 transition-all
                  hover:bg-accent/40
                  ${item.isEnabled ? 'ring-1 ring-primary/20' : 'opacity-75'}`}
              >
                <div className="flex flex-col gap-3">
                  {/* Header with image and name */}
                  <div className="flex items-center gap-3">
                    {item.image ? (
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-12 w-12 rounded-lg object-cover border
                            border-myborder"
                        />
                        {item.isEnabled && (
                          <div
                            className="absolute -top-1 -right-1 h-4 w-4
                              rounded-full bg-green-500 border-2
                              border-background flex items-center
                              justify-center"
                          >
                            <CheckCircle2 className="size-2.5 text-white" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        className={`h-12 w-12 rounded-lg bg-muted flex
                          items-center justify-center text-lg font-semibold
                          border border-myborder
                          ${item.isEnabled ? 'text-primary' : 'text-muted-foreground'}`}
                      >
                        {item.name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold truncate">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {item.isEnabled ? (
                          <>
                            <CheckCircle2
                              className="size-3 text-green-600
                                dark:text-green-500"
                            />
                            <span
                              className="text-xs text-green-600
                                dark:text-green-500 font-medium"
                            >
                              Enabled
                            </span>
                          </>
                        ) : (
                          <>
                            <XCircle className="size-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              Disabled
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Toggle switch */}
                  <div
                    className="flex items-center justify-between pt-2 border-t
                      border-myborder"
                  >
                    <span className="text-xs text-muted-foreground">
                      Status
                    </span>
                    <Switch
                      checked={item.isEnabled}
                      disabled={loadingId === item.id}
                      onCheckedChange={(val) => handleToggle(item.id, val)}
                    />
                  </div>
                </div>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
