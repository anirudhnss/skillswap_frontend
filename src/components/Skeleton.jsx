import { useTheme } from '../context/ThemeContext';
export default function Skeleton({ width='100%', height=20, borderRadius=8, style={} }) {
  const { t } = useTheme();
  return (
    <div style={{width, height, borderRadius, background:t.bg3, ...style,
      backgroundImage:`linear-gradient(90deg, ${t.bg3} 0%, ${t.bg2} 50%, ${t.bg3} 100%)`,
      backgroundSize:'200% 100%', animation:'shimmer 1.4s infinite'}}>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  );
}

export function CardSkeleton() {
  const { t } = useTheme();
  return (
    <div style={{background:t.card, border:`2px solid ${t.border}`, borderRadius:16, padding:20}}>
      <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:12}}>
        <Skeleton width={48} height={48} borderRadius='50%' />
        <div style={{flex:1}}><Skeleton height={18} style={{marginBottom:6}} /><Skeleton width='60%' height={14} /></div>
      </div>
      <Skeleton height={14} style={{marginBottom:8}} />
      <Skeleton height={14} width='80%' style={{marginBottom:16}} />
      <div style={{display:'flex',gap:6,marginBottom:8}}>{[1,2,3].map(i=><Skeleton key={i} width={70} height={26} borderRadius={20} />)}</div>
      <Skeleton height={40} borderRadius={8} />
    </div>
  );
}
