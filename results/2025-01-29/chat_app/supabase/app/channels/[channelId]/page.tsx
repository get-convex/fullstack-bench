import { Channel } from './Channel';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function ChannelPage({
  params,
}: {
  params: Promise<{ channelId: string }>;
}) {
  const resolvedParams = await params;
  const channelId = resolvedParams.channelId;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Verify the channel exists and get its name
  const { data: channel } = await supabase
    .from('channels')
    .select('name')
    .eq('id', channelId)
    .single();

  if (!channel) {
    redirect('/channels/1'); // Redirect to first channel if not found
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="px-6 py-4 border-b border-[#26262b]">
        <div className="flex items-center">
          <span className="text-[#A1A1A3] mr-2">#</span>
          <h2 className="text-lg font-medium text-white">{channel.name}</h2>
        </div>
      </div>
      <Channel channelId={channelId} userId={user.id} />
    </div>
  );
}
