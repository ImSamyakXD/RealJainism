import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface ChannelItem {
  name: string;
  handle: string;
  description: string;
  href: string;
  icon: string;
  color: string;
  badge: string;
  isComingSoon?: boolean;
}

const channels: ChannelItem[] = [
  {
    name: 'Instagram',
    handle: '@real__jainism',
    description: 'Daily quotes, kalyanaks, and devotional posts',
    href: 'https://www.instagram.com/real__jainism/',
    icon: 'HeartIcon',
    color: 'from-primary/20 to-accent/10',
    badge: 'Follow',
  },
  {
    name: 'WhatsApp Channel',
    handle: 'Real Jainism',
    description: 'Daily panchang and kalyanak updates direct to WhatsApp',
    href: 'https://whatsapp.com/channel/0029VbCvsGiBqbr62yuPGZ2O',
    icon: 'ChatBubbleLeftRightIcon',
    color: 'from-primary/20 to-accent/10',
    badge: 'Follow',
  },
  {
    name: 'Telegram Channel',
    handle: 't.me/real_jainism',
    description: 'Updates, wallpapers, and community discussions',
    href: 'https://t.me/real_jainism',
    icon: 'PaperAirplaneIcon',
    color: 'from-accent/20 to-primary/10',
    badge: 'Join',
  },
  {
    name: 'Telegram Bot',
    handle: 't.me/real_jainism_bot',
    description: 'Get instant panchang, kalyanak, and wallpapers via bot',
    href: 'https://t.me/real_jainism_bot',
    icon: 'CpuChipIcon',
    color: 'from-primary/15 to-muted/50',
    badge: 'Start',
  },
  {
    name: 'Twitter / X',
    handle: '@real_jainism',
    description: 'Short updates, quotes, and community highlights',
    href: 'https://twitter.com/real_jainism',
    icon: 'GlobeAltIcon',
    color: 'from-muted/50 to-primary/10',
    badge: 'Follow',
  },
  {
    name: 'Real Jainism App',
    handle: 'Coming Soon • Development Under Progress',
    description: 'Get daily panchang notifications,Panchang widget ,offline bhajan and stotras, wallpapers, and JainGPT on mobile.',
    href: '#community',
    icon: 'DevicePhoneMobileIcon',
    color: 'from-primary/30 to-amber-500/20 border-primary/40',
    badge: 'COMING SOON',
    isComingSoon: true,
  },
];

export default function CommunitySection() {
  return (
    <section className="py-16 sm:py-24 px-4" id="community">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 reveal">
          <p className="text-motto text-primary mb-3 opacity-70">Connect</p>
          <h2 className="text-section-xl text-foreground uppercase">
            Join the <br />
            <span className="gold-gradient-text">Movement.</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-sm sm:text-base font-medium max-w-lg leading-relaxed">
            Be part of a growing community of Jain devotees. Get daily panchang, kalyanaks, and inspiration across all platforms.
          </p>
        </div>

        {/* Channel cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {channels.map((ch, i) => (
            <a
              key={ch.name}
              href={ch.href}
              target={ch.isComingSoon ? '_self' : '_blank'}
              rel="noopener noreferrer"
              className={`reveal reveal-delay-${(i % 4) + 1} block bg-gradient-to-br ${ch.color} border rounded-2xl p-6 card-hover group ${
                ch.isComingSoon ? 'border-primary/50 bg-primary/10 shadow-md ring-1 ring-primary/30' : 'border-border'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Icon name={ch.icon as Parameters<typeof Icon>[0]['name']} size={22} className="text-primary" />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                  ch.isComingSoon
                    ? 'bg-primary text-primary-foreground animate-pulse font-extrabold'
                    : 'text-primary bg-primary/10 border border-primary/20'
                }`}>
                  {ch.badge}
                </span>
              </div>
              <h3 className="text-base font-black text-foreground uppercase tracking-tight mb-1">
                {ch.name}
              </h3>
              <p className="text-xs font-bold text-primary mb-2">{ch.handle}</p>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                {ch.description}
              </p>
              <div className="mt-4 flex items-center gap-1 text-xs font-black uppercase tracking-widest text-primary group-hover:text-accent transition-colors">
                {ch.isComingSoon ? 'Development Under Progress !!' : `${ch.badge} →`}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}