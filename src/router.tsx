import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { QueryClient } from '@tanstack/react-query'
import type { SupabaseClient, Session } from '@supabase/supabase-js'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 1 },
  },
})

export interface RouterContext {
  queryClient: QueryClient
  supabase: SupabaseClient
  session: Session | null
}

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  context: {
    queryClient,
    supabase: undefined!,
    session: null,
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
