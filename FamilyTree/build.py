#!/usr/bin/env python3
"""Refresh the offline webpage from the vault: python3 Web/build.py."""
from pathlib import Path
import hashlib, json, re, shlex, shutil, subprocess
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'Web'
people={p.stem:json.loads(p.read_text()) for p in sorted((ROOT/'Data/People').glob('*.json'))}
sources=json.loads((ROOT/'Data/sources.json').read_text())
relations=[dict(parent=x['b'],child=x['a'],role=x['role'],status=x['status'],sources=x['sources'],detail=x.get('detail','')) for x in json.loads((ROOT/'Data/relationships.json').read_text()) if x['role'] in ('father','mother','adoptive mother')]
paternal=next(x['relationships'] for x in json.loads((ROOT/'Data/graph-views.json').read_text()) if x['file']=='Paternal Hadley line.canvas')
pairs={(x['parent'],x['child']) for x in paternal}
def layout(edges):
 ids=sorted({x[k] for x in edges for k in ('parent','child')})
 dot=['digraph G { graph [rankdir=TB,nodesep=0.5,ranksep=0.85]; node [shape=box,fixedsize=true,width=3.333333,height=1.333333,label=""];']
 dot.extend(json.dumps(pid)+';' for pid in ids)
 dot.extend(json.dumps(x['parent'])+' -> '+json.dumps(x['child'])+';' for x in edges)
 dot.append('}')
 result=subprocess.run(['dot','-Tplain'],input='\n'.join(dot),text=True,capture_output=True,check=True).stdout
 nodes={};paths=[];height=0;width=0
 for line in result.splitlines():
  p=shlex.split(line)
  if p[0]=='graph':width=float(p[2])*72;height=float(p[3])*72
  elif p[0]=='node':nodes[p[1]]=dict(x=float(p[2])*72-120+40,y=height-float(p[3])*72-48+40)
  elif p[0]=='edge':
   points=[(float(p[4+2*i])*72+40,height-float(p[5+2*i])*72+40) for i in range(int(p[3]))]
   paths.append(dict(parent=p[1],child=p[2],points=points))
 assert len(paths)==len(edges)
 for x in edges:assert nodes[x['parent']]['y']<nodes[x['child']]['y']
 return dict(nodes=nodes,paths=paths,width=width+80,height=height+80)
def clean(text):return re.sub(r'\[\[([^\]|]+)(?:\|([^\]]+))?\]\]',lambda m:m[2] or m[1].split('/')[-1],text)
for p in people.values():
 for field in ('notes','events','excerpts'):
  if field=='notes':p[field]=[clean(x) for x in p.get(field,[])]
  else:p[field]=p.get(field,[])
 images=[]
 for image in p.get('images',[]):
  src=ROOT/image
  if src.is_file():
   dst=OUT/'assets'/src.name;dst.parent.mkdir(exist_ok=True);shutil.copyfile(src,dst)
   assert hashlib.sha256(src.read_bytes()).digest()==hashlib.sha256(dst.read_bytes()).digest()
   images.append('assets/'+src.name)
 p['images']=images
 p.pop('relationships',None)
data=dict(people=people,sources=sources,relationships=relations,paternal=[list(x) for x in sorted(pairs)],layouts=dict(all=layout(relations),paternal=layout([x for x in relations if (x['parent'],x['child']) in pairs])))
(OUT/'data.js').write_text('window.FAMILY_DATA = '+json.dumps(data,ensure_ascii=False).replace('</','<\\/')+';\n')
print(f'Built {len(people)} profiles, {len(relations)} parent-child arrows, {len(sources)} sources. Offline data and images saved in Web/.')
