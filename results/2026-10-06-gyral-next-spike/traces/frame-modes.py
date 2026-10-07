# Classifies saved select-row traces (scripts/trace-timeline.mjs --out=DIR): was a main frame
# already requested when the click started ("pending"), or did the frame wait for the next
# BeginFrame ("new")? Usage: python3 frame-modes.py DIR
import json,sys,glob,os,statistics,collections
sys.path.insert(0,'.')
res=collections.defaultdict(list)
for f in sorted(glob.glob(sys.argv[1]+'/*.json')):
    fw=os.path.basename(f).rsplit('-',2)[0]
    ev=json.load(open(f))['traceEvents']
    X=[e for e in ev if e.get('ph')=='X']
    click=[e for e in X if e['name']=='EventDispatch' and e.get('args',{}).get('data',{}).get('type')=='click'][0]
    pid,tid,t0=click['pid'],click['tid'],click['ts']
    main=[e for e in ev if e.get('pid')==pid and e.get('tid')==tid]
    # script end: end of last script-ish event after click before first BeginMainThreadFrame
    bmf=sorted(e['ts'] for e in main if e['name']=='BeginMainThreadFrame' and e['ts']>t0)
    req=sorted(e['ts'] for e in ev if e.get('pid')==pid and e['name']=='RequestMainThreadFrame')
    bfs=sorted(e['ts'] for e in ev if e.get('pid')==pid and e['name']=='BeginFrame')
    tasks=[e for e in main if e['name']=='ThreadControllerImpl::RunTask' and e['ts']<=t0<=e['ts']+e['dur']]
    tend=tasks[0]['ts']+tasks[0]['dur'] if tasks else t0+click['dur']
    first=bmf[0] if bmf else None
    # Was a main frame requested before the click started and not yet begun?
    prev_bmf=[e['ts'] for e in main if e['name']=='BeginMainThreadFrame' and e['ts']<t0]
    last_prev=max(prev_bmf) if prev_bmf else -1e18
    pending=any(last_prev < r < t0 for r in req)
    # vsync phase: the next BeginFrame after task end
    nxt=[b for b in bfs if b>=tend-100]
    commit=[e for e in main if e['name']=='Commit' and e['ts']>(first or t0)]
    res[fw].append(dict(pending=pending, wait=(first-tend)/1000 if first else None, total=(commit[0]['ts']+commit[0]['dur']-t0)/1000 if commit else None, script=(tend-t0)/1000))
for fw,l in res.items():
    p=[x for x in l if x['pending']]; n=[x for x in l if not x['pending']]
    med=lambda xs,k: round(statistics.median([x[k] for x in xs]),2) if xs else '-'
    print(f"{fw:11} n={len(l)} pending={len(p)} | wait(pending)={med(p,'wait')} wait(new)={med(n,'wait')} | total all={med(l,'total')} pend={med(p,'total')} new={med(n,'total')} | clicktask={med(l,'script')}")
