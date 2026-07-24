import { assetUrl } from '@/lib/assets';

export default function Footer() {
  return (
    <footer className="w-full flex-shrink-0 relative overflow-hidden" style={{ background: '#2b4639' }}>
      <div className="absolute inset-0 pointer-events-none opacity-[0.18]">
        <img
          src={assetUrl('/manus-storage/xiangxi-pattern-footer.webp')}
          alt=""
          className="w-full h-full object-cover"
          style={{ mixBlendMode: 'screen' }}
        />
      </div>

      <div className="py-3 text-center space-y-1 relative z-10">
        <div className="flex items-center justify-center mb-1" aria-hidden="true">
          <svg width="40" height="22" viewBox="0 0 40 22" fill="none" className="opacity-60">
            <path d="M0 22 L10 8 L15 14 L20 4 L28 16 L33 10 L40 22 Z" fill="#5a8a7a" opacity="0.5" />
            <path d="M5 22 L15 10 L20 15 L27 6 L35 18 L40 22 Z" fill="#4a7a6a" opacity="0.4" />
            <ellipse cx="20" cy="3" rx="6" ry="2" fill="#7aaa9a" opacity="0.3" />
          </svg>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-[12px] text-white/80">
          <span><strong className="text-white/95">主办单位：</strong>湖南省自然资源厅</span>
          <span><strong className="text-white/95">承办单位：</strong>湖南省第三测绘院</span>
        </div>
        <div className="flex items-center justify-center gap-5 text-[11px] text-white/55">
          <span>甲测资字43100424</span>
          <span>湘ICP备2021016353号-3</span>
        </div>
      </div>
    </footer>
  );
}
