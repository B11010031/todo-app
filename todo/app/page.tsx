'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Task, TodoList } from '@/types';

// ─── CONSTANTS ───
const PRI_BAR: Record<string, string> = { high: '#E8706A', medium: '#F5C842', low: '#72C48A', none: 'transparent' };
const PRI_LABEL: Record<string, string> = { high: '高優先', medium: '中優先', low: '低優先', none: '未設定' };
const PRI_DOT: Record<string, string> = { high: '#E8706A', medium: '#F5C842', low: '#72C48A', none: '#DDDFE8' };
const ICONS: string[] = ['briefcase','home','folder','heart','star','book','dumbbell','shopping-cart','plane','banknote'];
const COLORS: string[] = ['#F0A8A0','#F5D080','#80D5B8','#B8AEFF','#7B6BE0','#7BB8E8','#E8706A','#C8CCD8'];

// ─── INLINE SVG ICON ───
function Ico({ n, size=20, color='currentColor', className='' }: { n:string; size?:number; color?:string; className?:string }) {
  const p: Record<string,string> = {
    'sun':'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z',
    'list':'M4 6h16M4 10h16M4 14h16M4 18h16',
    'grid':'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
    'calendar':'M3 9h18M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM8 3v2M16 3v2',
    'plus':'M12 5v14M5 12h14',
    'check':'M5 13l4 4L19 7',
    'x':'M6 6l12 12M6 18L18 6',
    'arrow-left':'M19 12H5m7-7l-7 7 7 7',
    'chevron-right':'M9 18l6-6-6-6',
    'chevron-left':'M15 18l-6-6 6-6',
    'pin':'M12 17v5M8.5 4.5l7 7M5 15l7-7 3 3-7 7-3-3z',
    'pin-off':'M15 4l5 5-3 3-5-5 3-3zM9 9l-6 6 3 3 4-4M3 21l4-4',
    'trash':'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6',
    'flag':'M4 15V5l8 2 4-2v10l-4 2-8-2z',
    'clock':'M12 8v4l3 3M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z',
    'bell':'M15 17H9m3 4a3 3 0 003-3H9a3 3 0 003 3zM5 9a7 7 0 0114 0v3l2 4H3l2-4V9z',
    'star':'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    'checklist':'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    'briefcase':'M3 7a2 2 0 012-2h14a2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2V7zM8 5V3h8v2',
    'home':'M3 10l9-7 9 7v10a1 1 0 01-1 1h-5v-4h-6v4H4a1 1 0 01-1-1V10z',
    'folder':'M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z',
    'heart':'M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z',
    'book':'M4 19.5A2.5 2.5 0 016.5 17H20M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15z',
    'dumbbell':'M6.5 6.5h11M6.5 17.5h11M3 9h3v6H3zM18 9h3v6h-3zM6.5 9.5v5M17.5 9.5v5',
    'shopping-cart':'M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0',
    'plane':'M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z',
    'banknote':'M2 7a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7zM12 12a3 3 0 100-6 3 3 0 000 6zM6 12h.01M18 12h.01',
    'pencil':'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z',
    'rotate-ccw':'M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15',
    'check-circle':'M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3',
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d={p[n]||p['star']} />
    </svg>
  );
}

// ─── TASK CARD ───
function TaskCard({ task, lists, onToggle, onOpen, onDelete, onTogglePin, onToggleSub }: {
  task: Task; lists: TodoList[];
  onToggle:(id:string,subs:string[])=>void;
  onOpen:(id:string)=>void;
  onDelete:(id:string)=>void;
  onTogglePin:(id:string)=>void;
  onToggleSub:(taskId:string,subId:string)=>void;
}) {
  const [swipeX, setSwipeX] = useState(0);
  const startX = useRef(0);
  const isDone = task.status === 'done';
  const list = lists.find(l=>l.id===task.listId);
  const subDone = task.subTasks.filter(s=>s.done).length;

  const onTS = (e: React.TouchEvent) => { startX.current = e.touches[0].clientX; };
  const onTM = (e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - startX.current;
    if (dx < 0) setSwipeX(Math.max(dx,-96));
    else if (dx > 10 && swipeX < 0) setSwipeX(0);
  };
  const onTE = () => { if (swipeX > -44) setSwipeX(0); };

  if (isDone) return (
    <div className="mx-4 mb-2">
      <div className="flex rounded-[10px] cursor-pointer" style={{ background:'#EAEBF0' }} onClick={() => onOpen(task.id)}>
        <div className="w-1 flex-shrink-0 rounded-l-[10px]" style={{ background:'#D4D6E0' }} />
        <div className="flex-1 px-3 py-3">
          <div className="flex items-center gap-2">
            <button className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background:'#C0BCCF', border:'1.5px solid #C0BCCF' }}
              onClick={e=>{ e.stopPropagation(); onToggle(task.id,[]); }}>
              <Ico n="check" size={9} color="#E8EAF0" />
            </button>
            <span className="text-sm flex-1" style={{ color:'#A8AEBB', textDecoration:'line-through', fontWeight:400 }}>{task.name}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mx-4 mb-2 rounded-[10px] overflow-hidden relative" style={{ background: swipeX < 0 ? 'transparent' : 'transparent' }}>
      {swipeX < -10 && (
        <div className="absolute inset-0 flex rounded-[10px]">
          <div className="flex-1 flex items-center justify-center cursor-pointer rounded-l-[10px]"
            style={{ background:'#7B6BE0' }}
            onClick={() => { onTogglePin(task.id); setSwipeX(0); }}>
            <Ico n={task.pinned?'pin-off':'pin'} size={20} color="white" />
          </div>
          <div className="w-20 flex items-center justify-center cursor-pointer rounded-r-[10px]"
            style={{ background:'#E87070' }}
            onClick={() => { onDelete(task.id); }}>
            <Ico n="trash" size={20} color="white" />
          </div>
        </div>
      )}
      <div className="relative flex rounded-[10px] cursor-pointer select-none"
        style={{ background:'white', boxShadow:'0 1px 6px rgba(26,29,46,0.07)', transform:`translateX(${swipeX}px)`, transition: swipeX===0?'transform .18s ease':'none' }}
        onTouchStart={onTS} onTouchMove={onTM} onTouchEnd={onTE}
        onClick={() => { if (swipeX < -44) { setSwipeX(0); } else if (swipeX === 0) onOpen(task.id); }}>
        <div className="w-1 flex-shrink-0 rounded-l-[10px]" style={{ background: PRI_BAR[task.priority] || 'transparent' }} />
        {task.pinned && <div className="absolute top-2 right-2"><Ico n="pin" size={12} color="#C0B4FF" /></div>}
        <div className="flex-1 px-3 py-3">
          <div className="flex items-center gap-2">
            <button className="w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center flex-shrink-0 transition-all"
              style={{ background:'white', borderColor:'#D0C8FF' }}
              onClick={e=>{ e.stopPropagation(); onToggle(task.id, task.subTasks.map(s=>s.id)); }}>
            </button>
            <span className="text-sm font-medium flex-1 leading-snug" style={{ color:'#1A1D2E' }}>{task.name}</span>
          </div>
          {(list || task.dueDate) && (
            <div className="flex items-center gap-2 mt-1 pl-7">
              {list && <span className="text-[10px] font-semibold px-2 py-[1px] rounded-full" style={{ background:'rgba(123,107,224,.10)', color:'#6B5EE0' }}>{list.name}</span>}
              {task.dueDate && <span className="flex items-center gap-1 text-[10px]" style={{ color:'#B0B8CC' }}><Ico n="clock" size={10} color="#B0B8CC" />{task.dueDate.startsWith(new Date().toISOString().slice(0,10))?'今天':task.dueDate.slice(5,10).replace('-','/')}</span>}
            </div>
          )}
          {task.subTasks.length > 0 && (
            <div className="mt-2 border-t pt-2" style={{ borderColor:'#F0F2F8' }}>
              <div className="flex items-center justify-end mb-1">
                <span className="text-[10px] font-semibold" style={{ color:'#B0B8CC' }}>{subDone}/{task.subTasks.length}</span>
              </div>
              {task.subTasks.map(s => (
                <div key={s.id} className="flex items-center gap-2 mb-1 pl-7">
                  <button className="w-3 h-3 rounded-full border-[1.5px] flex items-center justify-center flex-shrink-0"
                    style={{ background:s.done?'#C0BCCF':'white', borderColor:s.done?'#C0BCCF':'#D0C8FF' }}
                    onClick={e=>{ e.stopPropagation(); onToggleSub(task.id,s.id); }}>
                    {s.done && <Ico n="check" size={6} color="#E8EAF0" />}
                  </button>
                  <span className="text-[11px]" style={{ color:s.done?'#B0B8CC':'#3A3D52', textDecoration:s.done?'line-through':'none' }}>{s.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type Tab = 'today'|'all'|'lists'|'cal';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [lists, setLists] = useState<TodoList[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('today');
  const [detailId, setDetailId] = useState<string|null>(null);
  const [prevTab, setPrevTab] = useState<Tab>('today');
  const [ldId, setLdId] = useState<string|null>(null);
  const [ldFilter, setLdFilter] = useState<'all'|'today'|'hi'|'done'>('all');
  // add task
  const [addOpen, setAddOpen] = useState(false);
  const [addName, setAddName] = useState('');
  const [addDue, setAddDue] = useState('');
  const [addLid, setAddLid] = useState('');
  const [addPri, setAddPri] = useState<Task['priority']>('none');
  // picker
  const [pickerField, setPickerField] = useState<'date'|'list'|'pri'|null>(null);
  const [pickerTaskId, setPickerTaskId] = useState<string|null>(null); // null = add sheet
  // calendar
  const [calSel, setCalSel] = useState(new Date().getDate());
  const [calMo, setCalMo] = useState(new Date().getMonth());
  const [calYr, setCalYr] = useState(new Date().getFullYear());
  // list editor
  const [listSheetOpen, setListSheetOpen] = useState(false);
  const [editListId, setEditListId] = useState<string|null>(null);
  const [newListName, setNewListName] = useState('');
  const [newListIcon, setNewListIcon] = useState('folder');
  const [newListColor, setNewListColor] = useState('#80D5B8');
  // detail editing
  const [detNotes, setDetNotes] = useState('');
  const [newSubName, setNewSubName] = useState('');
  // toast
  const [toast, setToast] = useState('');
  const [lastUndo, setLastUndo] = useState<any>(null);
  const toastRef = useRef<NodeJS.Timeout|null>(null);
  const addInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      const [t,l] = await Promise.all([fetch('/api/tasks').then(r=>r.json()), fetch('/api/lists').then(r=>r.json())]);
      setTasks(Array.isArray(t)?t:[]);
      setLists(Array.isArray(l)?l:[]);
    } catch { setTasks([]); setLists([]); }
    finally { setLoading(false); }
  }, []);
  useEffect(()=>{ load(); },[load]);

  const showToast = (msg:string) => {
    setToast(msg);
    if(toastRef.current) clearTimeout(toastRef.current);
    toastRef.current = setTimeout(()=>setToast(''), 2800);
  };

  const todayStr = new Date().toISOString().slice(0,10);
  const fmtDue = (d:string|null) => { if(!d) return ''; if(d==='today'||d===todayStr) return '今天'; return d.slice(5,10).replace('-','/'); };

  // ── ACTIONS ──
  const toggleDone = async (id:string, subIds:string[]) => {
    const t = tasks.find(x=>x.id===id); if(!t) return;
    const newS = t.status==='done'?'todo':'done';
    setTasks(prev=>prev.map(x=>x.id===id?{...x,status:newS,subTasks:newS==='done'?x.subTasks.map(s=>({...s,done:true})):x.subTasks}:x));
    setLastUndo({type:'toggle',id,prev:t.status,psubs:t.subTasks});
    showToast(newS==='done'?'任務已完成 ✓':'任務已復原');
    await fetch(`/api/tasks/${id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status:newS,subTaskIds:newS==='done'?subIds:[]})});
  };
  const toggleSub = async (tid:string,sid:string) => {
    const t=tasks.find(x=>x.id===tid); const s=t?.subTasks.find(x=>x.id===sid); if(!s) return;
    setTasks(prev=>prev.map(x=>x.id===tid?{...x,subTasks:x.subTasks.map(ss=>ss.id===sid?{...ss,done:!ss.done}:ss)}:x));
    await fetch(`/api/tasks/${sid}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status:s.done?'todo':'done'})});
  };
  const deleteTask = async (id:string) => {
    const t=tasks.find(x=>x.id===id); if(!t) return;
    setLastUndo({type:'delete',task:t});
    setTasks(prev=>prev.filter(x=>x.id!==id));
    showToast(`「${t.name}」已刪除`);
    await fetch(`/api/tasks/${id}`,{method:'DELETE'});
  };
  const togglePin = async (id:string) => {
    const t=tasks.find(x=>x.id===id); if(!t) return;
    setTasks(prev=>prev.map(x=>x.id===id?{...x,pinned:!x.pinned}:x));
    await fetch(`/api/tasks/${id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({pinned:!t.pinned})});
    showToast(t.pinned?'已取消置頂':'已置頂');
  };
  const undoLast = () => {
    if(!lastUndo) return;
    if(lastUndo.type==='toggle'){setTasks(prev=>prev.map(x=>x.id===lastUndo.id?{...x,status:lastUndo.prev,subTasks:lastUndo.psubs}:x));}
    else if(lastUndo.type==='delete'){setTasks(prev=>[...prev,lastUndo.task]);}
    setLastUndo(null); setToast('');
  };
  const updateTaskField = async (id:string, data:Record<string,any>) => {
    setTasks(prev=>prev.map(x=>x.id===id?{...x,...data}:x));
    await fetch(`/api/tasks/${id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
  };
  const submitTask = async () => {
    if(!addName.trim()) return;
    const due = addDue===todayStr?'today':addDue||null;
    const body = {name:addName.trim(),listId:addLid||lists[0]?.id,priority:addPri,dueDate:due};
    setAddOpen(false); setAddName(''); setAddDue(''); setAddLid(''); setAddPri('none');
    const res = await fetch('/api/tasks',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    const created = await res.json();
    const l=lists.find(x=>x.id===created.listId);
    setTasks(prev=>[{...created,listName:l?.name||'',listColor:l?.color||'',listIcon:l?.icon||'',subTasks:[],...created},...prev]);
    showToast(`「${addName.trim()}」已新增`);
  };
  const addSub = async () => {
    if(!newSubName.trim()||!detailId) return;
    const body={name:newSubName.trim(),parentTaskId:detailId,listId:tasks.find(t=>t.id===detailId)?.listId};
    const res=await fetch('/api/tasks',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    const sub=await res.json();
    setTasks(prev=>prev.map(t=>t.id===detailId?{...t,subTasks:[...t.subTasks,{id:sub.id,name:sub.name,done:false}]}:t));
    setNewSubName('');
  };

  const openDetail = (id:string) => { setPrevTab(tab); setDetailId(id); const t=tasks.find(x=>x.id===id); setDetNotes(t?.notes||''); };
  const detTask = tasks.find(t=>t.id===detailId);

  // ── picker ──
  const openPicker = (field:'date'|'list'|'pri', taskId:string|null=null) => {
    setPickerField(field); setPickerTaskId(taskId);
  };
  const closePicker = () => { setPickerField(null); setPickerTaskId(null); };
  const setPDate = (v:string) => {
    if(pickerTaskId) updateTaskField(pickerTaskId,{dueDate:v||null});
    else setAddDue(v);
    closePicker();
  };
  const setPList = (lid:string) => {
    if(pickerTaskId) updateTaskField(pickerTaskId,{listId:lid});
    else setAddLid(lid);
    closePicker();
  };
  const setPPri = (p:Task['priority']) => {
    if(pickerTaskId) updateTaskField(pickerTaskId,{priority:p});
    else setAddPri(p);
    closePicker();
  };

  // Calendar helpers
  const getTasksForDay = (yr:number,mo:number,day:number) => {
    const ds=`${yr}-${String(mo).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    return tasks.filter(t=>{
      if(!t.dueDate) return false;
      const due=t.dueDate==='today'?todayStr:t.dueDate;
      return due===ds;
    });
  };

  // List editor
  const saveList = async () => {
    if(!newListName.trim()) return;
    const body={name:newListName,icon:newListIcon,color:newListColor};
    if(editListId){
      await fetch(`/api/lists/${editListId}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
      setLists(prev=>prev.map(l=>l.id===editListId?{...l,...body}:l));
      showToast('清單已更新');
    } else {
      const res=await fetch('/api/lists',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
      const created=await res.json();
      setLists(prev=>[...prev,created]);
      showToast('清單已建立');
    }
    setListSheetOpen(false);
  };

  const today = new Date();
  const todayTasks = tasks.filter(t=>{const due=t.dueDate==='today'?todayStr:t.dueDate; return due===todayStr;});
  const pinnedTasks = tasks.filter(t=>t.pinned&&t.status!=='done');
  const activeTodayTasks = todayTasks.filter(t=>!t.pinned&&t.status!=='done');
  const doneTodayTasks = todayTasks.filter(t=>t.status==='done');

  const calDm = new Date(calYr,calMo+1,0).getDate();
  const calFd = new Date(calYr,calMo,1).getDay();

  // Shared components
  const Header = ({title,subtitle,extra}:{title:string;subtitle?:string;extra?:React.ReactNode}) => (
    <div style={{background:'#7B6BE0',paddingTop:'env(safe-area-inset-top,44px)'}} className="flex-shrink-0">
      <div className="px-5 pb-4 flex items-end justify-between">
        <div>{subtitle&&<div className="text-xs mb-1" style={{color:'rgba(255,255,255,.65)'}}>{subtitle}</div>}<div className="text-[28px] font-bold text-white" style={{letterSpacing:'-.5px'}}>{title}</div></div>
        {extra}
      </div>
    </div>
  );

  const NavBar = () => (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto flex" style={{background:'rgba(255,255,255,.92)',backdropFilter:'blur(20px)',borderTop:'.5px solid #E8EAF0',zIndex:50,paddingBottom:'env(safe-area-inset-bottom,0px)'}}>
      {(['today','all','lists','cal'] as Tab[]).map((t,i)=>(
        <button key={t} className="flex-1 flex flex-col items-center py-2 gap-1" onClick={()=>setTab(t)}>
          <Ico n={['sun','list','grid','calendar'][i]} size={22} color={tab===t?'#7B6BE0':'#B0B8CC'} />
          <span className="text-[9px] font-medium" style={{color:tab===t?'#7B6BE0':'#B0B8CC'}}>{['今日','所有','清單','行事曆'][i]}</span>
        </button>
      ))}
    </div>
  );

  const Fab = ({onClick}:{onClick:()=>void}) => (
    <button className="fixed right-5 w-14 h-14 rounded-full flex items-center justify-center" style={{bottom:'calc(env(safe-area-inset-bottom,0px) + 82px)',background:'#7B6BE0',boxShadow:'0 6px 20px rgba(123,107,224,.38)',zIndex:40}} onClick={onClick}>
      <Ico n="plus" size={26} color="white" />
    </button>
  );

  if(loading) return <div className="min-h-screen flex items-center justify-center" style={{background:'#F2F3F9'}}><div className="text-center"><div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{background:'#7B6BE0'}}><Ico n="check" size={24} color="white" /></div><p className="text-sm" style={{color:'#B0B8CC'}}>載入中…</p></div></div>;

  return (
    <div className="min-h-screen max-w-md mx-auto relative" style={{background:'#F2F3F9'}}>

      {/* ── DETAIL ── */}
      {detailId && detTask && (
        <div className="min-h-screen flex flex-col" style={{background:'#F2F3F9'}}>
          <div style={{background:'white',paddingTop:'env(safe-area-inset-top,44px)'}}>
            <div className="px-5 pb-4">
              <button className="flex items-center gap-1 mb-3" onClick={()=>setDetailId(null)}>
                <Ico n="arrow-left" size={18} color="#7B6BE0" /><span className="text-sm font-medium" style={{color:'#7B6BE0'}}>{prevTab==='today'?'今日':prevTab==='all'?'所有':'清單'}</span>
              </button>
              <div className="flex items-center gap-3">
                <button className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                  style={{background:detTask.status==='done'?'#C0BCCF':'white',borderColor:detTask.status==='done'?'#C0BCCF':'#D0C8FF'}}
                  onClick={()=>toggleDone(detTask.id,detTask.subTasks.map(s=>s.id))}>
                  {detTask.status==='done'&&<Ico n="check" size={11} color="#E8EAF0" />}
                </button>
                <h1 className="text-xl font-bold leading-snug" style={{color:detTask.status==='done'?'#A8AEBB':'#1A1D2E',textDecoration:detTask.status==='done'?'line-through':'none'}}>{detTask.name}</h1>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto pb-32 pt-3" style={{scrollbarWidth:'none'}}>
            {/* Info */}
            <div className="mx-4 mb-3 rounded-xl overflow-hidden" style={{background:'white',boxShadow:'0 1px 6px rgba(26,29,46,.07)'}}>
              {[
                {field:'pri' as const,icon:'flag',bg:'#FFF3DC',ic:'#F5C842',label:'優先',val:<><div className="w-2 h-2 rounded-full mr-2" style={{background:PRI_DOT[detTask.priority]}} />{PRI_LABEL[detTask.priority]}</>},
                {field:'date' as const,icon:'clock',bg:'#EBF3FF',ic:'#6B9EE0',label:'時間',val:detTask.dueDate?fmtDue(detTask.dueDate):<span style={{color:'#C8CCE0'}}>未設定</span>},
                {field:'list' as const,icon:'folder',bg:'rgba(123,107,224,.10)',ic:'#7B6BE0',label:'清單',val:lists.find(l=>l.id===detTask.listId)?.name||<span style={{color:'#C8CCE0'}}>未分類</span>},
              ].map((row,i)=>(
                <button key={i} className="w-full flex items-center gap-3 px-4 py-3 border-b last:border-0 text-left hover:bg-gray-50" style={{borderColor:'#F0F2F8'}} onClick={()=>openPicker(row.field,detTask.id)}>
                  <div className="w-6 h-6 rounded-[7px] flex items-center justify-center flex-shrink-0" style={{background:row.bg}}>
                    <Ico n={row.icon} size={13} color={row.ic} />
                  </div>
                  <span className="text-[11px] min-w-[28px]" style={{color:'#B0B8CC'}}>{row.label}</span>
                  <div className="flex items-center flex-1 text-[13px]" style={{color:'#1A1D2E'}}>{row.val}</div>
                  <Ico n="chevron-right" size={13} color="#D0D4E0" />
                </button>
              ))}
            </div>
            {/* Notes */}
            <div className="mx-4 mb-3 rounded-xl overflow-hidden" style={{background:'white',boxShadow:'0 1px 6px rgba(26,29,46,.07)'}}>
              <div className="px-4 py-2 border-b text-[9px] font-bold tracking-widest uppercase" style={{color:'#B0B8CC',borderColor:'#F0F2F8'}}>備忘錄</div>
              <textarea className="w-full px-4 py-3 text-sm leading-relaxed outline-none resize-none" style={{color:'#6B6F85',fontFamily:'inherit',background:'transparent',caretColor:'#7B6BE0',minHeight:72}}
                placeholder="新增備忘錄…" value={detNotes}
                onChange={e=>setDetNotes(e.target.value)}
                onBlur={()=>updateTaskField(detTask.id,{notes:detNotes})} />
            </div>
            {/* Subtasks */}
            <div className="mx-4 mb-3 rounded-xl overflow-hidden" style={{background:'white',boxShadow:'0 1px 6px rgba(26,29,46,.07)'}}>
              <div className="flex items-center justify-between px-4 py-2 border-b" style={{borderColor:'#F0F2F8'}}>
                <span className="text-[9px] font-bold tracking-widest uppercase" style={{color:'#B0B8CC'}}>子任務</span>
                <span className="text-[10px] font-semibold" style={{color:'#7B6BE0'}}>{detTask.subTasks.filter(s=>s.done).length}/{detTask.subTasks.length}</span>
              </div>
              {detTask.subTasks.map(s=>(
                <div key={s.id} className="flex items-center gap-3 px-4 py-3 border-b cursor-pointer" style={{borderColor:'#F0F2F8'}} onClick={()=>toggleSub(detTask.id,s.id)}>
                  <div className="w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center flex-shrink-0"
                    style={{background:s.done?'#C0BCCF':'white',borderColor:s.done?'#C0BCCF':'#D0C8FF'}}>
                    {s.done&&<Ico n="check" size={8} color="#E8EAF0" />}
                  </div>
                  <span className="text-[13px] flex-1" style={{color:s.done?'#A8AEBB':'#1A1D2E',textDecoration:s.done?'line-through':'none'}}>{s.name}</span>
                </div>
              ))}
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center flex-shrink-0" style={{borderColor:'#C8CCE0'}}><Ico n="plus" size={10} color="#B0B8CC" /></div>
                <input className="flex-1 text-[13px] outline-none" style={{color:'#1A1D2E',fontFamily:'inherit',background:'transparent',caretColor:'#7B6BE0'}}
                  placeholder="新增子任務…" value={newSubName} onChange={e=>setNewSubName(e.target.value)}
                  onKeyDown={e=>{if(e.key==='Enter')addSub();}} />
                {newSubName&&<button className="text-[11px] font-semibold" style={{color:'#7B6BE0'}} onClick={addSub}>新增</button>}
              </div>
            </div>
          </div>
          {/* Bottom btns */}
          <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-4 flex gap-3" style={{paddingBottom:'calc(env(safe-area-inset-bottom,16px)+12px)',background:'rgba(242,243,249,.92)',backdropFilter:'blur(12px)',paddingTop:12}}>
            <button className="flex-1 h-11 rounded-xl flex items-center justify-center gap-2 border" style={{background:'#F0F2F8',borderColor:'#E0E2EC'}} onClick={()=>setDetailId(null)}>
              <Ico n="arrow-left" size={15} color="#7B6BE0" /><span className="text-sm font-medium" style={{color:'#7B6BE0'}}>返回</span>
            </button>
            <button className="flex-[2] h-11 rounded-xl flex items-center justify-center gap-2"
              style={{background:detTask.status==='done'?'#C0BCCF':'#7B6BE0',boxShadow:detTask.status==='done'?'none':'0 4px 14px rgba(123,107,224,.32)'}}
              onClick={()=>toggleDone(detTask.id,detTask.subTasks.map(s=>s.id))}>
              <Ico n={detTask.status==='done'?'rotate-ccw':'check'} size={15} color="white" />
              <span className="text-sm font-semibold text-white">{detTask.status==='done'?'復原':'標記完成'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ── LIST DETAIL ── */}
      {ldId && !detailId && (()=>{
        const sp:{[k:string]:{name:string;icon:string}} = {__all__:{name:'所有任務',icon:'checklist'},__imp__:{name:'重要',icon:'star'},__done__:{name:'已完成',icon:'check'}};
        const isSpecial = ldId.startsWith('__');
        const info = isSpecial ? sp[ldId] : {name:lists.find(l=>l.id===ldId)?.name||'',icon:lists.find(l=>l.id===ldId)?.icon?.replace('ti-','')||'folder'};
        let lt = isSpecial ? (ldId==='__all__'?tasks:ldId==='__imp__'?tasks.filter(t=>t.priority==='high'):tasks.filter(t=>t.status==='done')) : tasks.filter(t=>t.listId===ldId);
        if(ldFilter==='today')lt=lt.filter(t=>{ const d=t.dueDate==='today'?todayStr:t.dueDate; return d===todayStr; });
        else if(ldFilter==='hi')lt=lt.filter(t=>t.priority==='high');
        else if(ldFilter==='done')lt=lt.filter(t=>t.status==='done');
        return (
          <div className="min-h-screen flex flex-col" style={{background:'#F2F3F9'}}>
            <div style={{background:'#7B6BE0',paddingTop:'env(safe-area-inset-top,44px)'}}>
              <div className="px-5 pb-3 flex items-center gap-3">
                <button onClick={()=>setLdId(null)}><Ico n="arrow-left" size={20} color="white" /></button>
                <div className="w-8 h-8 rounded-[10px] flex items-center justify-center" style={{background:'rgba(255,255,255,.22)'}}><Ico n={info.icon} size={16} color="white" /></div>
                <div className="flex-1"><div className="text-xs opacity-65 text-white">{lt.filter(t=>t.status!=='done').length} 項任務</div><div className="text-xl font-bold text-white">{info.name}</div></div>
              </div>
              <div className="flex gap-2 px-5 pb-3 overflow-x-auto" style={{scrollbarWidth:'none'}}>
                {(['all','today','hi','done'] as const).map((f,i)=>(
                  <button key={f} className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{background:ldFilter===f?'white':'rgba(255,255,255,.2)',color:ldFilter===f?'#7B6BE0':'rgba(255,255,255,.85)'}}
                    onClick={()=>setLdFilter(f)}>{['全部','今日','重要','完成'][i]}</button>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto pt-3 pb-28" style={{scrollbarWidth:'none'}}>
              {lt.filter(t=>t.status!=='done').map(t=><TaskCard key={t.id} task={t} lists={lists} onToggle={toggleDone} onOpen={id=>{setPrevTab('lists');openDetail(id);}} onDelete={deleteTask} onTogglePin={togglePin} onToggleSub={toggleSub} />)}
              {lt.filter(t=>t.status==='done').map(t=><TaskCard key={t.id} task={t} lists={lists} onToggle={toggleDone} onOpen={id=>{setPrevTab('lists');openDetail(id);}} onDelete={deleteTask} onTogglePin={togglePin} onToggleSub={toggleSub} />)}
              {lt.length===0&&<div className="flex flex-col items-center py-20 gap-3"><Ico n="check-circle" size={48} color="#D0C8FF" /><p className="text-sm" style={{color:'#B0B8CC'}}>此清單沒有任務</p></div>}
            </div>
            <Fab onClick={()=>setAddOpen(true)} />
          </div>
        );
      })()}

      {/* ── MAIN TABS ── */}
      {!detailId && !ldId && (
        <>
          {/* TODAY */}
          {tab==='today'&&(
            <div className="min-h-screen flex flex-col">
              <Header title="今日" subtitle={today.toLocaleDateString('zh-TW',{weekday:'long',month:'long',day:'numeric'})} />
              <div className="flex-1 overflow-y-auto pt-3 pb-28" style={{scrollbarWidth:'none'}}>
                {pinnedTasks.length>0&&(<><div className="flex items-center gap-2 px-4 pb-1 pt-1"><Ico n="pin" size={10} color="#C0B4FF" /><span className="text-[10px] font-bold tracking-widest uppercase" style={{color:'#B0B8CC'}}>置頂</span><div className="flex-1 h-px" style={{background:'#DCDEE8'}} /></div>{pinnedTasks.map(t=><TaskCard key={t.id} task={t} lists={lists} onToggle={toggleDone} onOpen={openDetail} onDelete={deleteTask} onTogglePin={togglePin} onToggleSub={toggleSub} />)}</>)}
                <div className="flex items-center gap-2 px-4 mb-2 mt-1"><div className="flex-1 h-px" style={{background:'#D4D6E4'}} /><span className="flex items-center gap-1 text-[10px]" style={{color:'#B0B8CC'}}><Ico n="list" size={10} color="#B0B8CC" />今日任務</span><div className="flex-1 h-px" style={{background:'#D4D6E4'}} /></div>
                {activeTodayTasks.map(t=><TaskCard key={t.id} task={t} lists={lists} onToggle={toggleDone} onOpen={openDetail} onDelete={deleteTask} onTogglePin={togglePin} onToggleSub={toggleSub} />)}
                {doneTodayTasks.map(t=><TaskCard key={t.id} task={t} lists={lists} onToggle={toggleDone} onOpen={openDetail} onDelete={deleteTask} onTogglePin={togglePin} onToggleSub={toggleSub} />)}
                {todayTasks.length===0&&pinnedTasks.length===0&&<div className="flex flex-col items-center py-16 gap-3"><Ico n="sun" size={48} color="#D0C8FF" /><p className="text-sm" style={{color:'#B0B8CC'}}>今天沒有任務，點 + 新增</p></div>}
              </div>
            </div>
          )}
          {/* ALL */}
          {tab==='all'&&(
            <div className="min-h-screen flex flex-col">
              <Header title="全部" subtitle="所有任務" />
              <div className="flex-1 overflow-y-auto pt-3 pb-28" style={{scrollbarWidth:'none'}}>
                {pinnedTasks.length>0&&(<><div className="flex items-center gap-2 px-4 pb-1 pt-1"><Ico n="pin" size={10} color="#C0B4FF" /><span className="text-[10px] font-bold tracking-widest uppercase" style={{color:'#B0B8CC'}}>置頂</span><div className="flex-1 h-px" style={{background:'#DCDEE8'}} /></div>{pinnedTasks.map(t=><TaskCard key={t.id} task={t} lists={lists} onToggle={toggleDone} onOpen={openDetail} onDelete={deleteTask} onTogglePin={togglePin} onToggleSub={toggleSub} />)}</>)}
                {lists.map(l=>{const lt=tasks.filter(t=>t.listId===l.id&&!t.pinned);if(!lt.length)return null;return(<div key={l.id}><div className="flex items-center gap-2 px-4 pb-1 pt-2"><div className="w-2 h-2 rounded-full" style={{background:l.color}} /><span className="text-[10px] font-bold tracking-widest uppercase" style={{color:'#B0B8CC'}}>{l.name}</span><div className="flex-1 h-px" style={{background:'#DCDEE8'}} /></div>{lt.filter(t=>t.status!=='done').map(t=><TaskCard key={t.id} task={t} lists={lists} onToggle={toggleDone} onOpen={openDetail} onDelete={deleteTask} onTogglePin={togglePin} onToggleSub={toggleSub} />)}{lt.filter(t=>t.status==='done').map(t=><TaskCard key={t.id} task={t} lists={lists} onToggle={toggleDone} onOpen={openDetail} onDelete={deleteTask} onTogglePin={togglePin} onToggleSub={toggleSub} />)}</div>);})}
                {tasks.length===0&&<div className="flex flex-col items-center py-16 gap-3"><Ico n="list" size={48} color="#D0C8FF" /><p className="text-sm" style={{color:'#B0B8CC'}}>目前沒有任何任務</p></div>}
              </div>
            </div>
          )}
          {/* LISTS */}
          {tab==='lists'&&(
            <div className="min-h-screen flex flex-col">
              <Header title="清單" subtitle="管理清單" extra={<button className="w-9 h-9 rounded-full flex items-center justify-center pb-1" style={{background:'rgba(255,255,255,.18)',border:'1px solid rgba(255,255,255,.3)'}} onClick={()=>{setEditListId(null);setNewListName('');setNewListIcon('folder');setNewListColor('#80D5B8');setListSheetOpen(true);}}><Ico n="plus" size={17} color="white" /></button>} />
              <div className="flex-1 overflow-y-auto pt-3 pb-28" style={{scrollbarWidth:'none'}}>
                <div className="mx-4 mb-3 rounded-xl overflow-hidden" style={{background:'white',boxShadow:'0 1px 6px rgba(26,29,46,.07)'}}>
                  {[{id:'__all__',icon:'checklist',bg:'rgba(123,107,224,.10)',ic:'#7B6BE0',name:'所有任務',cnt:tasks.filter(t=>t.status!=='done').length},{id:'__imp__',icon:'star',bg:'#FEE2E2',ic:'#E24B4A',name:'重要',cnt:tasks.filter(t=>t.priority==='high'&&t.status!=='done').length},{id:'__done__',icon:'check',bg:'#DCFCE7',ic:'#22C55E',name:'已完成',cnt:tasks.filter(t=>t.status==='done').length}].map(item=>(
                    <button key={item.id} className="w-full flex items-center gap-3 px-4 py-3 border-b last:border-0 text-left hover:bg-gray-50" style={{borderColor:'#F0F2F8'}} onClick={()=>{setLdId(item.id);setLdFilter('all');}}>
                      <div className="w-7 h-7 rounded-[9px] flex items-center justify-center" style={{background:item.bg}}><Ico n={item.icon} size={14} color={item.ic} /></div>
                      <span className="flex-1 text-sm font-medium" style={{color:'#1A1D2E'}}>{item.name}</span>
                      <span className="text-xs px-2 py-[2px] rounded-lg" style={{color:'#B0B8CC',background:'#F1F3F9'}}>{item.cnt}</span>
                      <Ico n="chevron-right" size={14} color="#C8CAD8" />
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between px-4 mb-3 mt-1">
                  <span className="text-[10px] font-bold tracking-widest uppercase" style={{color:'#B0B8CC'}}>我的清單</span>
                  <button className="w-6 h-6 rounded-[7px] flex items-center justify-center" style={{background:'rgba(123,107,224,.12)'}} onClick={()=>{setEditListId(null);setNewListName('');setNewListIcon('folder');setNewListColor('#80D5B8');setListSheetOpen(true);}}>
                    <Ico n="plus" size={13} color="#7B6BE0" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 px-4">
                  {lists.map(l=><button key={l.id} className="rounded-2xl p-4 text-left" style={{background:'white',boxShadow:'0 1px 6px rgba(26,29,46,.07)'}} onClick={()=>{setLdId(l.id);setLdFilter('all');}} onContextMenu={e=>{e.preventDefault();setEditListId(l.id);setNewListName(l.name);setNewListIcon(l.icon?.replace('ti-','')||'folder');setNewListColor(l.color);setListSheetOpen(true);}}>
                    <div className="w-8 h-8 rounded-[10px] flex items-center justify-center mb-2" style={{background:l.color}}><Ico n={l.icon?.replace('ti-','')||'folder'} size={16} color="white" /></div>
                    <div className="text-sm font-bold" style={{color:'#1A1D2E'}}>{l.name}</div>
                    <div className="text-xs mt-1" style={{color:'#B0B8CC'}}>{tasks.filter(t=>t.listId===l.id&&t.status!=='done').length} 項任務</div>
                  </button>)}
                  <button className="col-span-2 rounded-2xl flex items-center gap-3 px-4 py-3" style={{background:'#EAEBF0'}} onClick={()=>{setLdId('__done__');setLdFilter('all');}}>
                    <div className="w-8 h-8 rounded-[10px] flex items-center justify-center" style={{background:'#C8CCD8'}}><Ico n="check" size={16} color="white" /></div>
                    <div><div className="text-sm font-bold" style={{color:'#8890A0'}}>已完成</div><div className="text-xs" style={{color:'#B0B8CC'}}>{tasks.filter(t=>t.status==='done').length} 項</div></div>
                    <Ico n="chevron-right" size={14} color="#C8CAD8" className="ml-auto" />
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* CALENDAR */}
          {tab==='cal'&&(
            <div className="min-h-screen flex flex-col">
              <Header title="行事曆" subtitle="行事曆視圖" />
              <div className="flex-1 overflow-y-auto pt-3 pb-28" style={{scrollbarWidth:'none'}}>
                <div className="mx-4 mb-3 rounded-2xl overflow-hidden" style={{background:'white',boxShadow:'0 1px 6px rgba(26,29,46,.07)'}}>
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-base font-bold" style={{color:'#1A1D2E'}}>{calYr}年 {calMo+1}月</span>
                    <div className="flex gap-1">
                      <button className="w-7 h-7 rounded-[8px] flex items-center justify-center" style={{background:'#F1F3F9'}} onClick={()=>{let m=calMo-1,y=calYr;if(m<0){m=11;y--;}setCalMo(m);setCalYr(y);}}><Ico n="chevron-left" size={14} color="#9CA4BC" /></button>
                      <button className="w-7 h-7 rounded-[8px] flex items-center justify-center" style={{background:'#F1F3F9'}} onClick={()=>{let m=calMo+1,y=calYr;if(m>11){m=0;y++;}setCalMo(m);setCalYr(y);}}><Ico n="chevron-right" size={14} color="#9CA4BC" /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 px-2 pb-1">{['日','一','二','三','四','五','六'].map(d=><div key={d} className="text-center text-[9px] font-bold py-1" style={{color:'#B0B8CC'}}>{d}</div>)}</div>
                  <div className="grid grid-cols-7 gap-[2px] px-2 pb-3">
                    {Array.from({length:calFd}).map((_,i)=>{const d=new Date(calYr,calMo,0).getDate()-calFd+i+1;return<div key={`p${i}`} className="flex flex-col items-center py-1"><span className="text-xs" style={{color:'#C4C8DC'}}>{d}</span></div>;})}
                    {Array.from({length:calDm}).map((_,i)=>{
                      const d=i+1,isT=(d===today.getDate()&&calMo===today.getMonth()&&calYr===today.getFullYear()),isSel=d===calSel&&!isT;
                      const dt=getTasksForDay(calYr,calMo+1,d);
                      const dots=Array.from(new Set(dt.slice(0,3).map(t=>{const l=lists.find(x=>x.id===t.listId);return l?.color||'#C8CCD8';}))).slice(0,3);
                      return<button key={d} className="flex flex-col items-center py-1 rounded-lg min-h-8 transition-colors" style={{background:isT?'#7B6BE0':isSel?'rgba(123,107,224,.12)':'transparent'}} onClick={()=>setCalSel(d)}>
                        <span className="text-xs" style={{color:isT?'white':isSel?'#6B5EE0':'#1A1D2E',fontWeight:isT||isSel?700:400}}>{d}</span>
                        {dots.length>0&&<div className="flex gap-[2px] mt-[2px]">{dots.map((c,ci)=><div key={ci} className="w-1 h-1 rounded-full" style={{background:isT?'rgba(255,255,255,.8)':c}} />)}</div>}
                      </button>;
                    })}
                  </div>
                </div>
                <div className="flex items-center justify-between px-4 mb-2">
                  <span className="text-xs font-bold px-3 py-1 rounded-lg" style={{color:'#6B5EE0',background:'rgba(123,107,224,.10)'}}>{calMo+1}月 {calSel}日</span>
                  <button className="w-7 h-7 rounded-lg flex items-center justify-center" style={{background:'rgba(123,107,224,.10)'}} onClick={()=>{const ds=`${calYr}-${String(calMo+1).padStart(2,'0')}-${String(calSel).padStart(2,'0')}`;setAddDue(ds===todayStr?'today':ds);setAddLid('');setAddPri('none');setAddOpen(true);}}>
                    <Ico n="plus" size={14} color="#7B6BE0" />
                  </button>
                </div>
                {getTasksForDay(calYr,calMo+1,calSel).map(t=><TaskCard key={t.id} task={t} lists={lists} onToggle={toggleDone} onOpen={openDetail} onDelete={deleteTask} onTogglePin={togglePin} onToggleSub={toggleSub} />)}
                {getTasksForDay(calYr,calMo+1,calSel).length===0&&<div className="text-center py-8 text-sm" style={{color:'#B0B8CC'}}>這天沒有任務</div>}
              </div>
            </div>
          )}
          <Fab onClick={()=>setAddOpen(true)} />
          <NavBar />
        </>
      )}

      {/* ── ADD TASK ── */}
      {addOpen&&(
        <div className="fixed inset-0 z-50 flex flex-col justify-end max-w-md mx-auto" style={{background:'rgba(26,29,46,.3)'}} onClick={e=>{if(e.target===e.currentTarget){setAddOpen(false);setAddName('');}}}>
          <div className="rounded-t-2xl overflow-hidden" style={{background:'white'}} onClick={e=>e.stopPropagation()}>
            <div className="px-4 pt-4 pb-0">
              <input ref={addInputRef} autoFocus className="w-full text-[15px] font-medium outline-none" style={{color:'#1A1D2E',caretColor:'#7B6BE0',fontFamily:'inherit'}}
                placeholder="新增任務…" value={addName} onChange={e=>setAddName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submitTask()} />
            </div>
            <div className="flex items-center px-3 py-2">
              <button className={`flex items-center gap-1 px-2 h-7 rounded-lg ${addDue?'bg-purple-50':''}`} onClick={()=>openPicker('date',null)}>
                <Ico n="clock" size={16} color={addDue?'#7B6BE0':'#9CA4BC'} />
                {addDue&&<span className="text-[10px] font-semibold px-1 py-[1px] rounded" style={{background:'rgba(123,107,224,.10)',color:'#6B5EE0'}}>{fmtDue(addDue)}</span>}
              </button>
              <button className="flex items-center gap-1 px-2 h-7 rounded-lg" onClick={()=>openPicker('list',null)}>
                <Ico n="grid" size={16} color={addLid?'#7B6BE0':'#9CA4BC'} />
                {addLid&&<span className="text-[10px] font-semibold px-1 py-[1px] rounded" style={{background:'rgba(123,107,224,.10)',color:'#6B5EE0'}}>{lists.find(l=>l.id===addLid)?.name}</span>}
              </button>
              <button className="flex items-center gap-1 px-2 h-7 rounded-lg" onClick={()=>openPicker('pri',null)}>
                <Ico n="flag" size={16} color={addPri!=='none'?PRI_BAR[addPri]:'#9CA4BC'} />
                {addPri!=='none'&&<div className="w-2 h-2 rounded-full" style={{background:PRI_BAR[addPri]}} />}
              </button>
              <div className="flex-1" />
              <button className="h-7 px-4 rounded-lg text-xs font-bold text-white" style={{background:'#7B6BE0'}} onClick={submitTask}>新增</button>
            </div>
            <div style={{height:'env(safe-area-inset-bottom,0px)'}} />
          </div>
        </div>
      )}

      {/* ── PICKER SHEET (date/list/priority) ── */}
      {pickerField&&(
        <div className="fixed inset-0 z-[60] flex flex-col justify-end max-w-md mx-auto" style={{background:'rgba(26,29,46,.3)'}} onClick={e=>{if(e.target===e.currentTarget)closePicker();}}>
          <div className="rounded-t-2xl overflow-hidden max-h-[75%] overflow-y-auto" style={{background:'white',scrollbarWidth:'none'}} onClick={e=>e.stopPropagation()}>
            <div className="w-8 h-1 rounded-full mx-auto mt-3 mb-3" style={{background:'#D8DAE8'}} />
            {pickerField==='date'&&(()=>{
              const curDue = pickerTaskId ? tasks.find(t=>t.id===pickerTaskId)?.dueDate||'' : addDue;
              const now=new Date();
              return(<>
                <div className="text-sm font-bold px-4 pb-3 border-b" style={{color:'#1A1D2E',borderColor:'#ECEEF5'}}>選取時間</div>
                <div className="p-4">
                  <div className="flex gap-2 flex-wrap mb-4">
                    {[['today','今天'],['tomorrow','明天'],['next-week','下週一'],['','清除']].map(([v,l])=>(
                      <button key={v} className="px-4 py-2 rounded-full text-xs font-semibold border" style={{background:curDue===v?'#7B6BE0':'white',color:curDue===v?'white':'#6B6F85',borderColor:curDue===v?'#7B6BE0':'#E8EAF0'}} onClick={()=>setPDate(v)}>{l}</button>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    {[{id:'yr',label:'年',opts:[now.getFullYear(),now.getFullYear()+1]},{id:'mo',label:'月',opts:Array.from({length:12},(_,i)=>i+1)},{id:'day',label:'日',opts:Array.from({length:31},(_,i)=>i+1)}].map(col=>(
                      <div key={col.id} className="flex flex-col gap-1 flex-1">
                        <label className="text-[10px] font-semibold text-center" style={{color:'#B0B8CC'}}>{col.label}</label>
                        <select id={`pk-${col.id}`} className="rounded-xl border text-center font-semibold text-sm py-2 outline-none" style={{border:'.5px solid #D0C8FF',color:'#1A1D2E',fontFamily:'inherit'}} defaultValue={col.id==='yr'?now.getFullYear():col.id==='mo'?now.getMonth()+1:now.getDate()}>
                          {col.opts.map(o=><option key={o} value={o}>{o}{col.id==='mo'?'月':''}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 h-10 rounded-xl text-sm font-bold text-white" style={{background:'#7B6BE0'}}
                    onClick={()=>{const yr=(document.getElementById('pk-yr') as HTMLSelectElement).value;const mo=String((document.getElementById('pk-mo') as HTMLSelectElement).value).padStart(2,'0');const day=String((document.getElementById('pk-day') as HTMLSelectElement).value).padStart(2,'0');const ds=`${yr}-${mo}-${day}`;setPDate(ds===todayStr?'today':ds);}}>確定</button>
                </div>
              </>);
            })()}
            {pickerField==='list'&&(<>
              <div className="text-sm font-bold px-4 pb-3 border-b" style={{color:'#1A1D2E',borderColor:'#ECEEF5'}}>選取清單</div>
              {lists.map(l=>{
                const curLid=pickerTaskId?tasks.find(t=>t.id===pickerTaskId)?.listId:addLid;
                return<button key={l.id} className="w-full flex items-center gap-3 px-4 py-3 border-b text-left hover:bg-gray-50" style={{borderColor:'#F2F3F9'}} onClick={()=>setPList(l.id)}>
                  <div className="w-6 h-6 rounded-[7px] flex items-center justify-center" style={{background:l.color}}><Ico n={l.icon?.replace('ti-','')||'folder'} size={13} color="white" /></div>
                  <span className="flex-1 text-sm font-medium" style={{color:'#1A1D2E'}}>{l.name}</span>
                  {curLid===l.id&&<div className="w-4 h-4 rounded-full flex items-center justify-center" style={{background:'#7B6BE0'}}><Ico n="check" size={8} color="white" /></div>}
                </button>;
              })}
              <div style={{height:'env(safe-area-inset-bottom,10px)'}} />
            </>)}
            {pickerField==='pri'&&(<>
              <div className="text-sm font-bold px-4 pb-3 border-b" style={{color:'#1A1D2E',borderColor:'#ECEEF5'}}>選取優先級</div>
              <div className="p-4 flex flex-col gap-3">
                {([['high','高優先',PRI_BAR.high],['medium','中優先',PRI_BAR.medium],['low','低優先',PRI_BAR.low],['none','無','#DDDFE8']] as [Task['priority'],string,string][]).map(([v,n,c])=>{
                  const cur=pickerTaskId?tasks.find(t=>t.id===pickerTaskId)?.priority:addPri;
                  return<button key={v} className="flex items-center gap-3 p-3 rounded-xl border" style={{borderColor:cur===v?'#7B6BE0':'#F0F2F8',background:cur===v?'rgba(123,107,224,.04)':'white'}} onClick={()=>setPPri(v)}>
                    <div className="w-5 h-5 rounded-full" style={{background:c,border:v==='none'?'1.5px solid #C8CCE0':'none'}} />
                    <span className="flex-1 text-sm font-medium" style={{color:'#1A1D2E'}}>{n}</span>
                    {cur===v&&<div className="w-4 h-4 rounded-full flex items-center justify-center" style={{background:'#7B6BE0'}}><Ico n="check" size={8} color="white" /></div>}
                  </button>;
                })}
              </div>
              <div style={{height:'env(safe-area-inset-bottom,10px)'}} />
            </>)}
          </div>
        </div>
      )}

      {/* ── LIST EDITOR ── */}
      {listSheetOpen&&(
        <div className="fixed inset-0 z-[70] flex flex-col justify-end max-w-md mx-auto" style={{background:'rgba(26,29,46,.3)'}} onClick={e=>{if(e.target===e.currentTarget)setListSheetOpen(false);}}>
          <div className="rounded-t-2xl overflow-hidden" style={{background:'white'}} onClick={e=>e.stopPropagation()}>
            <div className="w-8 h-1 rounded-full mx-auto mt-3 mb-3" style={{background:'#D8DAE8'}} />
            <div className="flex items-center gap-3 px-4 pb-3 border-b" style={{borderColor:'#F2F3F9'}}>
              <div className="w-9 h-9 rounded-[11px] flex items-center justify-center" style={{background:newListColor}}><Ico n={newListIcon} size={17} color="white" /></div>
              <input autoFocus className="flex-1 text-sm font-bold outline-none" style={{color:'#1A1D2E',caretColor:'#7B6BE0',fontFamily:'inherit'}}
                placeholder="清單名稱…" value={newListName} onChange={e=>setNewListName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&saveList()} />
              <Ico n="pencil" size={14} color="#B0B8CC" />
            </div>
            <div className="px-4 pt-3 pb-1 text-[8px] font-bold tracking-widest uppercase" style={{color:'#B0B8CC'}}>圖示</div>
            <div className="grid grid-cols-5 gap-2 px-4 pb-3">
              {ICONS.map(ic=><button key={ic} className="h-10 rounded-[8px] flex items-center justify-center border-[1.5px]"
                style={{background:newListIcon===ic?newListColor:'#F1F3F9',borderColor:newListIcon===ic?'#1A1D2E':'transparent'}} onClick={()=>setNewListIcon(ic)}>
                <Ico n={ic} size={16} color={newListIcon===ic?'white':'#8890A8'} />
              </button>)}
            </div>
            <div className="px-4 pt-1 pb-1 text-[8px] font-bold tracking-widest uppercase" style={{color:'#B0B8CC'}}>顏色</div>
            <div className="flex gap-3 px-4 pb-4 overflow-x-auto" style={{scrollbarWidth:'none'}}>
              {COLORS.map(c=><button key={c} className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border-[2.5px]"
                style={{background:c,borderColor:newListColor===c?'#1A1D2E':'transparent'}} onClick={()=>setNewListColor(c)}>
                {newListColor===c&&<Ico n="check" size={12} color="white" />}
              </button>)}
            </div>
            <div className="flex items-center justify-between px-4 pb-6 border-t pt-3" style={{borderColor:'#F2F3F9'}}>
              <button className="text-sm" style={{color:'#B0B8CC'}} onClick={()=>setListSheetOpen(false)}>取消</button>
              <button className="flex items-center gap-1 text-sm font-bold" style={{color:'#7B6BE0'}} onClick={saveList}><Ico n="check" size={14} color="#7B6BE0" />儲存</button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast&&(
        <div className="fixed left-4 right-4 max-w-md mx-auto rounded-xl px-4 py-3 flex items-center gap-3 z-[200]" style={{bottom:80,background:'rgba(26,29,46,.88)',backdropFilter:'blur(8px)'}}>
          <Ico n="check-circle" size={16} color="#C4B8FF" />
          <span className="text-sm text-white flex-1">{toast}</span>
          <button className="text-xs font-semibold" style={{color:'#C4B8FF'}} onClick={undoLast}>復原</button>
        </div>
      )}
    </div>
  );
}
