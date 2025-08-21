import { deleteSession } from '@/_lib/server/session'
import { redirect } from 'next/navigation'

export default async function AdminLogout() {
  await deleteSession()
  redirect('/admin/login')
}