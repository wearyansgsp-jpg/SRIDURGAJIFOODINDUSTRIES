import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { supabase } from './integrations/supabase/client'
import { queryClient, router } from './router'
import './styles.css'

async function main() {
  // Get initial session ONCE before mounting
  const { data: { session } } = await supabase.auth.getSession()

  // Pass supabase + session into router context
  router.update({
    context: {
      queryClient,
      supabase,
      session,
    },
  })

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </React.StrictMode>
  )
}

main()
