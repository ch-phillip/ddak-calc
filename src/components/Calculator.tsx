import React, { useMemo, useState } from 'react';
import { addDays, daysBetween, discount, hourlyPay, percentChange, percentOf, pyeongToSqm, sqmToPyeong, vatFromSupply, vatFromTotal } from '../lib/calculations';

export type Kind = 'percent'|'discount'|'date'|'hourly'|'vat'|'area';
const money = (n:number) => `${new Intl.NumberFormat('ko-KR',{maximumFractionDigits:2}).format(n)}원`;
const number = (n:number) => new Intl.NumberFormat('ko-KR',{maximumFractionDigits:2}).format(n);
const today = () => new Date().toISOString().slice(0,10);
export default function Calculator({kind}:{kind:Kind}) {
 const [v,setV]=useState<Record<string,string>>({a:'10000',b:'10',c:'',d:'',date:today(),date2:today(),mode:'supply'}); const [copied,setCopied]=useState(false);
 const set=(key:string,value:string)=>setV(p=>({...p,[key]:value}));
 const n=(key:string)=>Number(v[key]||0);
 const results=useMemo(()=>{
  if(kind==='percent') return [{label:'계산 결과',value:money(percentOf(n('a'),n('b')))}, {label:'두 값의 변화율',value:percentChange(n('a'),n('c'))===null?'기준값이 0이면 변화율을 계산할 수 없어요':`${number(percentChange(n('a'),n('c'))!)}%`}];
  if(kind==='discount'){const r=discount(n('a'),n('b'));return [{label:'할인 후 가격',value:money(r.final)},{label:'절약 금액',value:money(r.savings)}]}
  if(kind==='date'){const diff=daysBetween(new Date(`${v.date}T00:00:00`),new Date(`${v.date2||v.date}T00:00:00`));return [{label:'두 날짜 차이',value:`${Math.abs(diff)}일${diff<0?' (종료일이 더 이전)':''}`},{label:'시작일 기준 날짜',value:addDays(new Date(`${v.date}T00:00:00`),n('b')).toLocaleDateString('ko-KR')}];}
  if(kind==='hourly') return [{label:'예상 급여',value:money(hourlyPay(n('a'),n('b')))}];
  if(kind==='vat'){if(v.mode==='total'){const r=vatFromTotal(n('a'),n('b')||10);return [{label:'공급가액',value:money(r.supply)},{label:'부가세액',value:money(r.vat)},{label:'합계 금액',value:money(r.total)}]}const r=vatFromSupply(n('a'),n('b')||10);return [{label:'공급가액',value:money(n('a'))},{label:'부가세액',value:money(r.vat)},{label:'합계 금액',value:money(r.total)}]}
  const sqm=v.mode==='pyeong'?pyeongToSqm(n('a')):n('a');const p=v.mode==='sqm'?sqmToPyeong(n('a')):n('a');return [{label:'제곱미터',value:`${number(sqm)}㎡`},{label:'평',value:`${number(p)}평`}];
 },[v,kind]);
 const fields:Record<Kind,Array<{key:string;label:string;type?:string;placeholder?:string}>>={
 percent:[{key:'a',label:'기준값'},{key:'b',label:'비율 (%)'},{key:'c',label:'비교할 값'}],discount:[{key:'a',label:'할인 전 가격 (원)'},{key:'b',label:'할인율 (%)'}],date:[{key:'date',label:'시작 날짜',type:'date'},{key:'date2',label:'종료 날짜',type:'date'},{key:'b',label:'더하거나 뺄 일수'}],hourly:[{key:'a',label:'시급 (원)'},{key:'b',label:'근무 시간'}],vat:[{key:'a',label:'금액 (원)'},{key:'b',label:'부가세율 (%)'}],area:[{key:'a',label:'면적'}]};
 const copy=async()=>{await navigator.clipboard.writeText(results.map(r=>`${r.label}: ${r.value}`).join('\n'));setCopied(true);setTimeout(()=>setCopied(false),1600)};
 const reset=()=>setV({a:'10000',b:kind==='date'?'0':'10',c:'',d:'',date:today(),date2:today(),mode:kind==='vat'?'supply':kind==='area'?'sqm':''});
 return <div className="grid gap-5 lg:grid-cols-[1.05fr_.95fr]">
  <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-soft sm:p-8"><div className="mb-7 flex items-center justify-between"><h2 className="text-lg font-bold">값을 입력해 주세요</h2><button onClick={reset} className="text-sm font-semibold text-muted hover:text-ink">초기화 ↺</button></div>
   {(kind==='vat'||kind==='area')&&<div className="mb-6 flex rounded-xl bg-paper p-1">{(kind==='vat'?[['supply','별도 금액'],['total','포함 금액']]:[['sqm','㎡ → 평'],['pyeong','평 → ㎡']]).map(([key,label])=><button key={key} onClick={()=>set('mode',key)} className={`flex-1 rounded-lg px-3 py-2.5 text-sm font-bold transition ${v.mode===key?'bg-white text-forest shadow-sm':'text-muted'}`}>{label}</button>)}</div>}
   <div className="space-y-5">{fields[kind].map(f=>{if(kind==='percent'&&f.key==='c')return <label key={f.key} className="block"><span className="mb-2 block text-sm font-semibold text-ink">비교할 값 <span className="font-normal text-muted">(변화율 계산용)</span></span><input type="number" inputMode="decimal" value={v[f.key]} onChange={e=>set(f.key,e.target.value)} placeholder="선택 입력" className="calc-input"/></label>;return <label key={f.key} className="block"><span className="mb-2 block text-sm font-semibold text-ink">{f.label}</span><div className="relative"><input type={f.type||'number'} inputMode={f.type?'text':'decimal'} min={f.type?undefined:'0'} value={v[f.key]} onChange={e=>set(f.key,e.target.value)} className="calc-input" placeholder={f.placeholder}/>{!f.type&&<span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted">{kind==='hourly'&&f.key==='b'?'시간':kind==='area'?v.mode==='sqm'?'㎡':'평':''}</span>}</div></label>})}</div>
   {kind==='percent'&&<p className="mt-4 text-xs leading-5 text-muted">기준값 × 비율로 첫 결과를 계산해요. 비교할 값을 입력하면 변화율도 함께 보여요.</p>}
   {kind==='date'&&<p className="mt-4 text-xs leading-5 text-muted">두 날짜 차이는 시작일을 제외한 날짜 수예요. 일수 입력으로 날짜를 더하거나 뺄 수도 있어요.</p>}
   {kind==='hourly'&&<p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900">세금 및 주휴수당 등 각종 수당은 별도입니다. 실제 급여와 다를 수 있어요.</p>}
  </section>
  <section className="rounded-3xl bg-forest p-6 text-white shadow-soft sm:p-8"><div className="mb-8 flex items-center justify-between"><div><p className="text-sm font-semibold text-white/65">계산 결과</p><h2 className="mt-1 text-xl font-bold">바로 확인해 보세요</h2></div><span className="grid size-11 place-items-center rounded-full bg-white/10 text-lg">✳</span></div><div className="space-y-3">{results.map((r,i)=><div key={r.label} className={`rounded-2xl px-5 py-4 ${i===0?'bg-white text-ink':'bg-white/10 text-white'}`}><p className={`text-xs font-semibold ${i===0?'text-muted':'text-white/65'}`}>{r.label}</p><p className="mt-1 text-xl font-extrabold tracking-tight sm:text-2xl">{r.value}</p></div>)}</div><div className="mt-6 grid grid-cols-2 gap-3"><button onClick={copy} className="rounded-xl bg-white px-4 py-3 text-sm font-bold text-forest hover:bg-mint">{copied?'복사 완료 ✓':'결과 복사'}</button><button onClick={reset} className="rounded-xl border border-white/25 px-4 py-3 text-sm font-bold text-white hover:bg-white/10">다시 계산</button></div></section>
 </div>
}
