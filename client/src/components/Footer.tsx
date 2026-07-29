export default function Footer() {
  return (
    <footer className="hidden lg:block w-full flex-shrink-0 relative overflow-hidden footer-seamless">
      {/* Subtle gold divider that separates modules from filing info without breaking the flow */}
      <div className="footer-divider mx-auto" />

      <div className="py-2.5 text-center relative z-10">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-1 text-[13px]" style={{ color: 'rgba(61, 46, 10, 0.78)' }}>
          <span><strong style={{ color: 'rgba(61, 46, 10, 0.92)' }}>主办单位：</strong>湖南省自然资源厅</span>
          <span><strong style={{ color: 'rgba(61, 46, 10, 0.92)' }}>承办单位：</strong>湖南省第三测绘院</span>
          <span className="text-[12px]" style={{ color: 'rgba(61, 46, 10, 0.55)' }}>甲测资字43100424</span>
          <span className="text-[12px]" style={{ color: 'rgba(61, 46, 10, 0.55)' }}>湘ICP备2021016353号-3</span>
        </div>
      </div>
    </footer>
  );
}
