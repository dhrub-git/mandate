/**
 * In-memory policy store
 * 
 * In production, this would be replaced with a database
 */

import { GeneratedPolicy } from '@/lib/generation/types'

interface PolicyStore {
  policies: Map<string, GeneratedPolicy>
}

// Singleton store
const store: PolicyStore = {
  policies: new Map()
}

export function savePolicy(policy: GeneratedPolicy): void {
  store.policies.set(policy.id, policy)
}

export function getPolicy(id: string): GeneratedPolicy | undefined {
  return store.policies.get(id)
}

export function deletePolicy(id: string): boolean {
  return store.policies.delete(id)
}

export function listPolicies(): GeneratedPolicy[] {
  return Array.from(store.policies.values())
}
