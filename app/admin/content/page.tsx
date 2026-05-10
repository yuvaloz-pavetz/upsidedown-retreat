import { createClient } from '@/lib/supabase/server'
import AdminShell from '@/components/admin/AdminShell'
import ContentEditor from '@/components/admin/ContentEditor'

export default async function ContentPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('site_content')
    .select('key, locale, value')

  return (
    <AdminShell>
      <ContentEditor initialRows={data ?? []} />
    </AdminShell>
  )
}
