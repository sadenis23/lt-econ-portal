import ProfilePageClient from './ProfilePageClient';

export default async function ProfilePage() {
  // This is a server component - no hooks or client-side logic here
  // If you need server-side data fetching, it would go here
  // const { data: profile } = await supabaseServerClient().from('profiles').select('*').single();

  return <ProfilePageClient />;
} 