(function(){
"use strict";
var DATA = OSC_DATA;
var MAIN = document.getElementById('main');
var TOTAL = DATA.length;

function H(){ return Array.prototype.slice.call(arguments).join(''); }

/* ---------- derived facts ---------- */
var MUNI_TOTAL = 51;
var muniSet = {}, ejeCount = {}, muniCount = {}, TIPOS = {};
DATA.forEach(function(o){
  muniSet[o.m] = 1;
  ejeCount[o.e] = (ejeCount[o.e]||0) + 1;
  muniCount[o.m] = (muniCount[o.m]||0) + 1;
  TIPOS[o.t] = (TIPOS[o.t]||0) + 1;
});
var MUNIS = Object.keys(muniSet).sort(function(a,b){ return a.localeCompare(b,'es'); });
var EJES  = Object.keys(ejeCount).sort(function(a,b){ return ejeCount[b]-ejeCount[a]; });
var TIPOL = Object.keys(TIPOS).sort(function(a,b){ return TIPOS[b]-TIPOS[a]; });
var AMM = DATA.filter(function(o){ return o.z === 1; }).length;
var SIN_MUNI = MUNI_TOTAL - MUNIS.length;
var CON_WEB = DATA.filter(function(o){ return o.w === 1; }).length;

/* ---------- helpers ---------- */
var ENT = {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'};
function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g, function(c){ return ENT[c]; }); }
function norm(s){ return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''); }
function nf(n){ return Number(n).toLocaleString('es-MX'); }
function pct(a,b){ return (a/b*100).toFixed(1); }
function seeded(i,mod){ var x=(i*9301+49297)%233280; return Math.floor(x/233280*mod); }
function pad3(n){ n=String(n); while(n.length<3) n='0'+n; return n; }

/* ---------- small components ---------- */
function route(kick,title,desc,href){
  return H('<a class="route" href="',href,'">',
    '<div class="rimg" role="img" aria-label="Fotografía ilustrativa de la sección"></div>',
    '<div class="rbody"><span class="rk">',esc(kick),'</span>',
    '<h2>',esc(title),'</h2><p>',esc(desc),'</p>',
    '<span class="go">Entrar &rarr;</span></div></a>');
}
function stat(n,l,href){
  return H('<div class="stat"><span class="n">',n,'</span><span class="l">',esc(l),'</span>',
    href ? H('<a href="',href,'">Ver fuente</a>') : '', '</div>');
}
function story(st){
  return H('<a class="story ph',st.ph,'" href="#/historia/',st.s,'"><div class="ph" aria-hidden="true">',
    '<span class="vd">Ver historia</span></div>',
    '<div class="sb"><h3>',esc(st.n),'</h3><p>',esc(st.r),'</p></div></a>');
}
function row(k,v){ return H('<div><dt>',k,'</dt><dd>',v,'</dd></div>'); }
function kpi(n,l,f,warn){
  return H('<div class="kpi',(warn?' warn':''),'"><span class="kl">',esc(l),'</span>',
    '<span class="kn">',n,'</span><span class="kf">',esc(f),'</span></div>');
}
function bar(label,val,w,zero){
  return H('<div class="brow',(zero?' z':''),'"><span class="bl">',esc(label),'</span>',
    '<span class="btr"><span class="bfl" style="--w:',w.toFixed(1),'%"></span></span>',
    '<span class="bv">',val,'</span></div>');
}
function doc(n,meta,cur,href){
  var ext = !!href;
  return H('<a class="doc" href="',(href||'#/transparencia'),'"',
    (ext?' target="_blank" rel="noopener"':''),'><span class="dn">',esc(n),
    (ext?' <span class="ext" aria-label="se abre en una pestaña nueva">&#8599;</span>':''),'</span>',
    (cur?'<span class="cur">Vigente</span>':''),'<span class="dm">',esc(meta),'</span></a>');
}
function box(t,d,items,href,cta){
  return H('<div class="box"><h2>',esc(t),'</h2><p>',esc(d),'</p><ul>',
    items.map(function(i){ return H('<li>',esc(i),'</li>'); }).join(''),
    '</ul>',
    href ? H('<div><a class="btn sm" href="',href,'">',esc(cta),'</a></div>') : '',
    '</div>');
}
function step(cls,t,d,why){
  return H('<div class="step ',cls,'"><div><h3>',esc(t),'</h3><p>',esc(d),'</p>',
    (why ? H('<div class="why">',why,'</div>') : ''), '</div></div>');
}

/* ---------- historias en video ---------- */
var STORIES = [
 {s:'una-promesa-senectud', v:'18yxHuTDAQUcUvHwJyKFucta08ZZDPw3n', vsz:'153 MB', org:741, ph:1,
  n:'Una Promesa para la Senectud, A.C.',
  r:'Casa de retiro para personas mayores en situación de vulnerabilidad.',
  p:['Opera una casa de retiro en Guadalupe para personas mayores que llegan sin red familiar ni recursos para sostener su cuidado.',
     'Su trabajo se centra en el envejecimiento activo: mantener a las personas aprendiendo y participando, no solo asistidas. Acompañan también la protección de sus derechos y las condiciones de una vida digna.']},
 {s:'lobos-mg-infancia-plena', v:'1-fFrHcX_pidS7PWlhs7mgc6vhht4KDV1', vsz:'176 MB', org:77, ph:2,
  n:'Asociación Lobos MG, A.C. — Infancia Plena',
  r:'Derechos de las mujeres durante el embarazo, la lactancia y la crianza.',
  p:['Desde Santa Catarina acompañan a mujeres en embarazo, lactancia y crianza para que conozcan y ejerzan sus derechos en esas etapas.',
     'Su programa Infancia Plena trabaja contra la violencia hacia las mujeres en el periodo perinatal y promueve la parentalidad positiva como forma de crianza.']},
 {s:'centro-pedagogico-cometa', v:'1Ha_4Tgf-vHv5sq6f9P0aauuhHMZLa9v2', vsz:'200 MB', org:213, ph:3,
  n:'Centro Pedagógico Cometa, A.C.',
  r:'Atención a niñas y niños con condiciones del neurodesarrollo.',
  p:['Atienden en Guadalupe a niñas y niños con condiciones del neurodesarrollo, con un plan pedagógico ajustado a cada caso.',
     'Buscan que cada integrante alcance su máximo potencial de aprendizaje y el mayor grado posible de funcionalidad e independencia, según su punto de partida.']},
 {s:'comun-a-ti', v:'1sjJkkRAbwyv_PA31pCuXtno772bSD9mE', vsz:'484 MB', org:631, ph:1,
  n:'Patronato para la Comunidad Terapéutica, A.B.P.',
  r:'Rehabilitación y reintegración psicosocial en salud mental.',
  p:['Brindan atención terapéutica en Monterrey a juventudes y personas adultas con diagnósticos de salud mental.',
     'Trabajan con un modelo integral de rehabilitación y reintegración psicosocial: no solo tratamiento clínico, sino el regreso de la persona a su vida social y productiva.']},
 {s:'guerreros-vida-cancha', v:'1KVXpxKWgGYKDSaJtUZe0uobFY9tKs-Us', vsz:'209 MB', org:474, ph:3,
  n:'Guerreros en la Vida y en la Cancha, A.C.',
  r:'Formación integral de juventudes a través del deporte.',
  p:['Desde San Pedro Garza García usan el deporte como vía de formación para las juventudes de Nuevo León.',
     'Más allá de la disciplina deportiva, buscan abrir alternativas de vida y fortalecer la autodeterminación, el espíritu de superación y el compromiso con la comunidad.']}
];
function storyBySlug(x){ for(var i=0;i<STORIES.length;i++){ if(STORIES[i].s===x) return STORIES[i]; } return null; }
function orgById(i){ for(var k=0;k<DATA.length;k++){ if(DATA[k].i===i) return DATA[k]; } return null; }

/* ---------- monograma de organización ---------- */
function hashStr(s){ var h=2166136261; s=String(s);
  for(var i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,16777619); }
  return h>>>0; }
/* Los tres colores del sitio actual: naranja, azul profundo y tinta. */
var MONO = ['#FF8613','#8AC9FE','#FA6FB5','#9092FF'];
function initials(n){
  var w = String(n).replace(/[^A-Za-zÁÉÍÓÚÑÜáéíóúñü ]/g,' ').split(/\s+/)
    .filter(function(x){ return x.length>2 && !/^(las|los|del|para|con|una|por|que|sus|asociacion|asociación|fundacion|fundación|centro|instituto)$/i.test(x); });
  var a = (w[0]||String(n)||'?')[0] || '?';
  var b = w[1] ? w[1][0] : '';
  return (a+b).toUpperCase();
}
function monoBg(i){ return MONO[hashStr('m'+i) % MONO.length]; }
function monoFg(i){ return '#2B2B2B'; }

/* ---------- router ---------- */
var ROUTES = {};
function parseHash(){
  var h = location.hash.replace(/^#/,'') || '/';
  var qi = h.indexOf('?');
  var path = qi < 0 ? h : h.slice(0,qi);
  var qs   = qi < 0 ? '' : h.slice(qi+1);
  var params = {};
  qs.split('&').forEach(function(p){
    if(!p) return;
    var kv = p.split('=');
    params[decodeURIComponent(kv[0])] = decodeURIComponent((kv[1]||'').replace(/\+/g,' '));
  });
  return { path: path.replace(/\/+$/,'') || '/', params: params };
}
function render(){
  var r = parseHash();
  var seg = r.path.split('/').filter(Boolean);
  var key = seg[0] || 'inicio';
  var fn = ROUTES[key] || ROUTES['404'];
  MAIN.innerHTML = fn(r.params, seg);
  Array.prototype.forEach.call(document.querySelectorAll('nav.main a'), function(a){
    a.classList.toggle('on', a.getAttribute('data-r') === key);
  });
  window.scrollTo(0,0);
  bind();
  document.title = (key==='inicio' ? 'OSC NL' : 'OSC NL — ' + key.charAt(0).toUpperCase() + key.slice(1)) + ' · Prototipo';
}
window.addEventListener('hashchange', render);

/* ============ INICIO ============ */
ROUTES.inicio = function(){
  var top = EJES.slice(0,6);
  return H(
  '<section class="hero"><div class="wrap"><div class="hero-in">',
    '<div class="hero-txt">',
      '<p class="kicker-h">Bienvenidos al portal de la</p>',
      '<h1>Sociedad Civil Organizada</h1>',
      '<p class="h">', nf(TOTAL), ' organizaciones, redes y agrupaciones trabajando en Nuevo León. ',
        'Consulta el directorio, revisa las convocatorias o registra la tuya.</p>',
      '<form class="hsearch" data-go="search">',
        '<input type="search" name="q" placeholder="Busca por causa, nombre o municipio…" aria-label="Buscar organizaciones">',
        '<button class="btn" type="submit">Buscar</button>',
      '</form>',
      '<div class="quick"><span>Consultas frecuentes:</span>',
        top.map(function(e){ return H('<a href="#/directorio?e=',encodeURIComponent(e),'">',esc(e),'</a>'); }).join(''),
      '</div>',
    '</div>',
  '</div></div></section>',

  '<section class="strip"><div class="wrap">',
    '<span class="chip closed"><span class="dot"></span>Sin convocatoria abierta</span>',
    '<span class="txt">La última convocatoria cerró el <b>31 de enero de 2026</b>. La siguiente suele publicarse en <b>noviembre</b>. ',
    '<a href="#/convocatorias">Ver calendario y resultados</a></span>',
    '<a class="btn ghost sm" href="#/registro">Avísame cuando abra</a>',
  '</div></section>',

  '<div class="page"><div class="wrap">',
    '<section class="sec"><div class="routes">',
      route('Soy una organización','Registro','Registra tu organización y forma parte del padrón estatal, donde podrás acceder a información, oportunidades de colaboración, recursos y herramientas de apoyo.','#/registro'),
      route('Busco ayuda o quiero apoyar','Directorio','Consulta las 779 organizaciones inscritas en el Registro Estatal. Busca por causa y por municipio, conoce su misión y encuentra a quién acudir o a quién apoyar.','#/directorio'),
      route('Represento una empresa o fundación','Inversión social','Conoce cómo coinvertir con el Estado, sumarte al Clúster de Inversión Social, aliarte con organizaciones y obtener tu constancia de contribución.','#/inversion'),
    '</div></section>',

    '<section class="sec">',
      '<h2 class="st">El sector social de Nuevo León, en números</h2>',
      '<p class="mut" style="font-size:14px;margin-bottom:16px">Cifras calculadas en vivo sobre el padrón. Cada dato enlaza a su fuente.</p>',
      '<div class="stats">',
        stat(nf(TOTAL),'Organizaciones en el registro estatal','#/directorio'),
        stat(H(MUNIS.length,'<small>/',MUNI_TOTAL,'</small>'),'Municipios con al menos una organización','#/transparencia'),
        stat(EJES.length,'Ejes temáticos de atención','#/directorio'),
        stat('$229<small> mdp</small>','Inversión social pública 2025','#/transparencia'),
        stat('12<small> años</small>','De convocatorias y resultados publicados','#/convocatorias'),
      '</div>',
    '</section>',

    '<section class="sec">',
      '<h2 class="st">Historias de organizaciones</h2>',
      '<p class="mut" style="font-size:14px;margin-bottom:18px">Organizaciones del padrón contando su propio trabajo. ',
      '<a href="#/historias">Ver las ',STORIES.length,' historias</a></p>',
      '<div class="stories">',
        STORIES.slice(0,3).map(story).join(''),
      '</div>',
    '</section>',
  '</div></div>');
};

/* ============ DIRECTORIO ============ */
var PER = 24;
function filterData(q,ejes,mun,tipo,web){
  var nq = norm(q).trim();
  var terms = nq ? nq.split(/\s+/) : [];
  return DATA.filter(function(o){
    if(ejes.length && ejes.indexOf(o.e) < 0) return false;
    if(mun && o.m !== mun) return false;
    if(tipo && o.t !== tipo) return false;
    if(web && o.w !== 1) return false;
    if(terms.length){
      var hay = norm(o.n+' '+o.a+' '+o.e+' '+o.r+' '+o.m+' '+o.s+' '+o.p);
      for(var i=0;i<terms.length;i++){ if(hay.indexOf(terms[i]) < 0) return false; }
    }
    return true;
  });
}
function cardHtml(o){
  var stale = seeded(o.i,10) < 4;
  return H('<a class="card" href="#/organizacion/',o.i,'">',
    '<div class="ctop"><span class="mono" aria-hidden="true" style="background:',monoBg(o.i),';color:',monoFg(o.i),'">',
      initials(o.n),'</span><h3>',esc(o.n),'</h3></div>',
    '<div class="meta"><span class="chip eje">',esc(o.e),'</span><span>',esc(o.m),'</span><span>·</span><span>',esc(o.t),'</span></div>',
    o.s ? H('<p class="mis">',esc(o.s),'</p>') : '<p class="mis mut">Sin misión capturada.</p>',
    '<div class="vig',(stale?' stale':''),'">',
      (stale ? 'Sin actualizar desde <b>2021</b>' : 'Registro vigente · actualizado <b>2026</b>'),
    '</div></a>');
}
function tagHtml(label,k,v){
  return H('<span class="tag">',label,
    '<button type="button" data-rm="',k,'" data-v="',esc(v),'" aria-label="Quitar filtro">&times;</button></span>');
}
function pagerHtml(page,pages){
  if(pages < 2) return '';
  function lk(n,label,dis){
    return H('<button type="button" data-page="',n,'"',(dis?' disabled':''),'>',label,'</button>');
  }
  return H('<div class="pager">', lk(page-1,'&larr; Anteriores', page<=1),
    '<span class="pp">Página ',page,' de ',pages,'</span>',
    lk(page+1,'Siguientes &rarr;', page>=pages), '</div>');
}
ROUTES.directorio = function(p){
  var q = p.q || '';
  var ejes = p.e ? p.e.split('|').filter(Boolean) : [];
  var mun = p.m || '', tipo = p.t || '', web = p.w === '1';
  var page = parseInt(p.p || '1', 10) || 1;

  var res = filterData(q,ejes,mun,tipo,web);
  var pages = Math.max(1, Math.ceil(res.length/PER));
  if(page > pages) page = pages;
  var slice = res.slice((page-1)*PER, page*PER);

  var chips = [];
  if(q) chips.push(tagHtml('Búsqueda: “'+esc(q)+'”','q',''));
  ejes.forEach(function(e){ chips.push(tagHtml(esc(e),'e',e)); });
  if(mun)  chips.push(tagHtml('Municipio: '+esc(mun),'m',''));
  if(tipo) chips.push(tagHtml('Figura: '+esc(tipo),'t',''));
  if(web)  chips.push(tagHtml('Con sitio web','w',''));

  var ejeBoxes = EJES.map(function(e,i){
    return H('<label',(i>=8?' class="xtra" hidden':''),'><input type="checkbox" name="e" value="',esc(e),'"',
      (ejes.indexOf(e)>=0?' checked':''),'> <span>',esc(e),'</span><span class="ct">',ejeCount[e],'</span></label>');
  }).join('');

  var munOpts = MUNIS.map(function(m){
    return H('<option value="',esc(m),'"',(mun===m?' selected':''),'>',esc(m),' (',muniCount[m],')</option>');
  }).join('');

  var tipoOpts = TIPOL.map(function(t){
    return H('<option value="',esc(t),'"',(tipo===t?' selected':''),'>',esc(t),' (',TIPOS[t],')</option>');
  }).join('');

  var results = slice.length
    ? H('<div class="cards">', slice.map(cardHtml).join(''), '</div>', pagerHtml(page,pages))
    : H('<div class="empty"><b>No encontramos organizaciones con esos filtros.</b>',
        'Prueba con menos filtros, o busca por la causa que te interesa en lugar del nombre exacto.</div>');

  return H('<div class="page"><div class="wrap">',
    '<p class="crumbs"><a href="#/">Inicio</a> › Directorio</p>',
    '<h1 class="pt">Directorio de organizaciones</h1>',
    '<p class="psub">',nf(TOTAL),' organizaciones, redes y agrupaciones inscritas en el Registro Estatal. ',
      'Cada ficha muestra únicamente información institucional pública.</p>',
    '<div class="dir">',
      '<form class="filters" id="ff" aria-labelledby="fh">',
        '<h2 class="vh" id="fh">Filtrar organizaciones</h2>',
        '<div class="fg"><h3>Buscar</h3>',
          '<input type="search" name="q" value="',esc(q),'" placeholder="Nombre, causa, misión…" aria-label="Buscar">',
        '</div>',
        '<div class="fg"><h3>Eje temático</h3>', ejeBoxes,
          '<button type="button" class="fmore" id="more">Ver los ',(EJES.length-8),' ejes restantes</button>',
        '</div>',
        '<div class="fg"><h3>Municipio</h3>',
          '<select name="m" aria-label="Municipio"><option value="">Todos los municipios</option>', munOpts, '</select>',
          '<p class="mut" style="font-size:12px;margin:6px 0 0">',SIN_MUNI,' de los ',MUNI_TOTAL,
          ' municipios del estado no tienen ninguna organización registrada.</p>',
        '</div>',
        '<div class="fg"><h3>Figura jurídica</h3>',
          '<select name="t" aria-label="Figura jurídica"><option value="">Cualquiera</option>', tipoOpts, '</select>',
        '</div>',
        '<div class="fg"><h3>Otros</h3>',
          '<label><input type="checkbox" name="w" value="1"',(web?' checked':''),
            '> <span>Con sitio web propio</span><span class="ct">',CON_WEB,'</span></label>',
          '<label><input type="checkbox" disabled> <span class="mut">Donataria autorizada</span><span class="ct">—</span></label>',
          '<label><input type="checkbox" disabled> <span class="mut">Recibe voluntariado</span><span class="ct">—</span></label>',
        '</div>',
        '<p class="mut" style="font-size:12px">Los filtros en gris requieren campos que hoy no existen en el padrón ',
        'y que propongo capturar en el nuevo registro.</p>',
      '</form>',
      '<div>',
        '<h2 class="vh">Resultados</h2>',
        '<div class="dbar" role="status" aria-live="polite"><span class="cnt"><b>',nf(res.length),'</b> organizaciones</span>',
          (chips.length ? '<button class="clr" id="clr">Limpiar filtros</button>' : ''), '</div>',
        (chips.length ? H('<div class="active-f">',chips.join(''),'</div>') : ''),
        results,
      '</div>',
    '</div></div></div>');
};

/* ============ FICHA ============ */
var ODS_N = {1:'Fin de la pobreza',2:'Hambre cero',3:'Salud y bienestar',4:'Educación de calidad',
  5:'Igualdad de género',10:'Reducción de desigualdades',16:'Paz y justicia',17:'Alianzas'};
ROUTES.organizacion = function(p,seg){
  var id = parseInt(seg[1],10);
  var o = null;
  for(var i=0;i<DATA.length;i++){ if(DATA[i].i===id){ o = DATA[i]; break; } }
  if(!o) return ROUTES['404']();
  var stale = seeded(o.i,10) < 4;

  var odsChips = o.o.map(function(n){
    return H('<span class="chip ods">ODS ',n,' · ',esc(ODS_N[n]||''),'</span>');
  }).join('');

  var seal = stale
    ? H('<div class="seal" style="background:var(--soon-soft);border-color:var(--soon)">',
        '<span class="st" style="color:var(--soon)">&#9888; Datos sin confirmar</span>',
        '<span class="sd">Esta organización no ha confirmado su información desde 2021. Si es tu organización, ',
        '<a href="#/registro">actualízala aquí</a>.</span></div>')
    : H('<div class="seal"><span class="st">&#10003; Registro vigente</span>',
        '<span class="sd">Confirmado por la propia organización en agosto de 2026.</span></div>');

  return H('<div class="page"><div class="wrap">',
    '<p class="crumbs"><a href="#/">Inicio</a> › <a href="#/directorio">Directorio</a> › ',esc(o.n),'</p>',
    '<div class="ficha"><div>',
      '<div class="fhead c',(hashStr('f'+o.i)%4)+1,'">',
        '<h1>',esc(o.n),'</h1>',
        '<p class="sub">',esc(o.t),
          (o.a && norm(o.a).replace(/[^a-z0-9]/g,'') !== norm(o.n).replace(/[^a-z0-9]/g,'')
            ? ' · también conocida como '+esc(o.a) : ''), '</p>',
        '<div style="display:flex;gap:7px;flex-wrap:wrap">',
          '<span class="chip eje">',esc(o.e),'</span>',
          '<span class="chip eje">',esc(o.r),'</span>', odsChips,
        '</div>',
      '</div>',
      '<div class="fbox"><h2>Misión</h2><p style="margin:0">',
        (o.s ? esc(o.s) : '<span class="mut">No capturada.</span>'), '</p></div>',
      (o.p ? H('<div class="fbox"><h2>Actividad principal</h2><p style="margin:0">',esc(o.p),'</p></div>') : ''),
      '<div class="fbox"><h2>Datos del registro</h2><dl class="dl">',
        row('Figura jurídica', esc(o.t)),
        row('Municipio sede', H(esc(o.m), o.c ? H(' <span class="mut" style="font-family:var(--mono);font-size:12px">· clave INEGI ',pad3(o.c),'</span>') : '')),
        (o.col ? row('Colonia', esc(o.col)) : ''),
        row('Eje temático', esc(o.e)),
        row('Sitio web propio', o.w ? '<span style="color:var(--open)">Sí</span>' : '<span class="mut">No registra</span>'),
        row('Zona', o.z ? 'Área Metropolitana de Monterrey' : 'Fuera del Área Metropolitana'),
      '</dl></div>',
    '</div><aside>', seal,
      '<div class="fbox"><h2>Cómo apoyar</h2>',
        '<p style="font-size:14px;margin:0 0 12px;color:var(--ink-2)">La organización decide qué medios de contacto hacer públicos.</p>',
        '<div class="acts"><a class="btn sm" href="#/contacto">Contactar</a>',
        '<a class="btn ghost sm" href="#/directorio">Ver organizaciones similares</a></div>',
      '</div>',
      '<div class="reserved"><b>Expediente reservado</b>',
        'Representante legal, RFC, documentos constitutivos y datos de contacto personales no se publican. ',
        'Sólo son visibles para personal autorizado de la Secretaría, con bitácora de consulta.',
        '<div class="lock" style="margin-top:9px">■■■■■■ ■■■■■■■■ ■■■■</div>',
      '</div>',
    '</aside></div></div></div>');
};

/* ============ CONVOCATORIAS ============ */
var CONV = [
 {y:2026, items:['Apoyo para la inversión social anual 2026','Apoyo para la inversión social estratégica 2026'], c:'31 de enero de 2026'},
 {y:2025, items:['Inversión Social Anual 2025','Ayudamos a Garantizar el Cuidado 2025','Ayudamos a Garantizar la Inclusión 2025','Ayudamos a Garantizar la Protección Social 2025'], c:'2025'},
 {y:2024, items:['Inversión Social Anual 2024','Primera Infancia 2024','Inclusión Prioritaria 2024','Protección Social 2024'], c:'2024'},
 {y:2023, items:['Inversión Social Anual 2023','Primera Infancia 2023','Inclusión Prioritaria 2023','Protección Social 2023'], c:'2023'},
 {y:2022, items:['Apoyo Mensual 2022','Fortalecimiento 2022','Protección Social 2022','Primera Infancia 2022','Prevención Social 2022','Desarrollo Comunitario Integral 2022','Inclusión Social y no Discriminación 2022'], c:'2022'},
 {y:2021, items:['Apoyo Mensual 2021','Desarrollo Integral de Niñas, Niños y Jóvenes 2021','Personas con Discapacidad 2021','Insumos COVID-19 2021','Adultos Mayores 2021','Violencia Contra las Mujeres 2021','Reconstrucción del Tejido Social 2021'], c:'2021'}
];
ROUTES.convocatorias = function(){
  var demo = H('<h2 class="yr">Abierta ahora</h2>','<div class="conv is-open">',
    '<div class="ct"><span class="chip open"><span class="dot"></span>Abierta</span>',
      '<h3>Apoyo para la inversión social anual 2027</h3></div>',
    '<div class="cm"><span>Cierra el <b>31 de enero de 2027</b></span><span><b>Quedan 24 días</b></span>',
      '<span>Dirigido a <b>OSC con registro vigente</b></span></div>',
    '<div class="cl"><a class="btn sm" href="#/registro">Postular</a>',
      '<a class="btn ghost sm" target="_blank" rel="noopener" href="https://drive.google.com/uc?export=download&id=1zYxOqZDHL8v18R1_btbhVtuJgUveT6AQ">Manual E2P (PDF) &#8599;</a>',
      '<a class="btn ghost sm" href="#/convocatorias">Preguntas frecuentes</a></div>',
    '<p class="mut" style="font-size:12.5px;margin:4px 0 0">Ejemplo del estado «abierta», para mostrar el diseño. ',
    'Las convocatorias siguientes son las reales del portal actual.</p></div>');

  var hist = CONV.map(function(g){
    var items = g.items.map(function(n){
      return H('<div class="conv">',
        '<div class="ct"><span class="chip closed"><span class="dot"></span>Cerrada</span>',
          '<h3>',esc(n),'</h3></div>',
        '<div class="cm"><span>Cerró en <b>',esc(g.c),'</b></span>',
          '<span style="color:var(--open)"><b>Resultados publicados</b></span></div>',
        '<div class="cl">',
          (g.y===2026
            ? H('<a class="btn ghost sm" target="_blank" rel="noopener" href="',
                (n.indexOf('estratégica')>=0?'https://drive.google.com/uc?export=download&id=1V8_bVvpiE7MX1n6IhfrNXtKM_p78tpQo':'https://drive.google.com/uc?export=download&id=1sYcAOkTi8E_yYR_OSKHfhUqctVP6i2Cl'),
                '">Convocatoria (PDF) &#8599;</a>',
                '<a class="btn ghost sm" target="_blank" rel="noopener" href="',
                (n.indexOf('estratégica')>=0?'https://drive.google.com/uc?export=download&id=1hZBsOgCLtA7Fg9meAUkd7ZS3fQp9BZzy':'https://drive.google.com/uc?export=download&id=195hcKFGXqtsisEcSDYAPRTe10kkFSTHN'),
                '">Resultados (PDF) &#8599;</a>')
            : '<span class="pend">Archivos por vincular en la migración</span>'),
        '</div>',
        '</div>');
    }).join('');
    return H('<h2 class="yr">',g.y,'</h2>', items);
  }).join('');

  return H('<div class="page"><div class="wrap">',
    '<p class="crumbs"><a href="#/">Inicio</a> › Convocatorias</p>',
    '<h1 class="pt">Convocatorias y resultados</h1>',
    '<p class="psub">Doce años de convocatorias del Programa de Fomento, con su estado y sus resultados. ',
      'En el sitio actual esta información existe, pero se presenta como una lista plana sin estados ni fechas visibles.</p>',
    '<div class="callout"><p class="ck">Qué cambia</p>',
      '<p>Cada convocatoria pasa a ser un objeto con <b>estado, fecha de cierre, eje temático, población objetivo y documentos asociados</b>. ',
      'Eso permite filtrar, avisar y —sobre todo— que cualquiera sepa de un vistazo si hay algo abierto hoy.</p></div>',
    demo, hist,
    '<p class="mut" style="margin-top:26px;font-size:14px">El histórico continúa hasta 2015. ',
    'En la implementación real se carga por año, con filtros y paginación.</p>',
  '</div></div>');
};

/* ============ REGISTRO ============ */
ROUTES.registro = function(){
  return H('<div class="page"><div class="wrap">',
    '<p class="crumbs"><a href="#/">Inicio</a> › Registro y trámites</p>',
    '<h1 class="pt">Registro y trámites</h1>',
    '<p class="psub">Una sola ruta, de principio a fin: confirmo si aplico, junto lo que necesito, lleno, y sigo mi folio. ',
      'El objetivo de diseño es que una organización pequeña lo complete desde un celular en menos de 20 minutos, sin llamar a nadie.</p>',

    '<div class="grid2" style="margin-bottom:34px">',
      '<div id="quiz"></div>',
      '<div class="box"><h2>¿Por qué empezar con esto?</h2>',
        '<p>El costo más alto de un trámite de gobierno no es llenar el formulario: es <b>averiguar si aplico y qué me van a pedir</b>.</p>',
        '<p>Hoy ese costo lo paga íntegro la organización, leyendo doce documentos normativos. Resolverlo en tres preguntas elimina la mayoría de las llamadas de aclaración.</p>',
        '<p style="margin:0"><b>Y bifurca temprano:</b> un grupo sin figura jurídica nunca debe ver un campo que le pida acta constitutiva.</p>',
      '</div>',
    '</div>',

    '<h2 class="st">El flujo completo</h2>',
    '<p class="mut" style="margin-bottom:18px;font-size:14px">Cada paso resuelve un punto concreto de abandono del proceso actual.</p>',
    '<div class="steps">',
      step('zero','¿Aplico?','Tres a cinco preguntas que resuelven elegibilidad y eligen la ruta: organización constituida, o grupo y red sin figura jurídica. Termina con la lista exacta de documentos, descargable e imprimible.','Ataca el <b>costo de aprendizaje</b>: saber si esto es para mí antes de invertir tiempo.'),
      step('','Identificación de la organización','Si ya estás en el padrón, te buscamos por nombre o RFC y prellenamos lo que ya tenemos. Sólo confirmas o corriges.','Nunca volver a pedir lo que la institución ya tiene. Es la queja número uno de las OSC.'),
      step('','Datos del expediente','Bloques cortos, uno por pantalla de celular, con guardado automático y avance visible («Paso 3 de 7»).','El <b>efecto de progreso</b>: un avance ya iniciado se termina; una pared de 60 campos se abandona.'),
      step('','Documentos','Carga por fotografía desde el celular, con recorte, compresión y validación de legibilidad al instante. Te decimos qué falta antes de enviar, nunca después.','27% de las organizaciones registradas no tienen ni sitio web. El celular no es el caso excepcional: es el caso normal.'),
      step('','Revisión y firma','Resumen completo en una pantalla, consentimientos campo por campo, y confirmación explícita de quien autoriza.','Separa a <b>quien captura</b> de <b>quien autoriza</b>. En la práctica casi nunca son la misma persona.'),
      step('','Folio, constancia y ficha pública','Acuse inmediato con folio, constancia descargable y tu ficha publicada en el Directorio.','Aquí la organización <b>recibe algo a cambio</b> de lo que dio. Sin este paso, el padrón se vuelve a desactualizar.'),
      step('','Mi expediente','Estatus con etapas nombradas, qué falta, quién lo revisa, notificación en cada cambio, y refrendo anual de un clic cuando nada cambió.','Elimina el <b>silencio administrativo</b>, que es el mayor generador de llamadas de seguimiento.'),
    '</div>',

    '<div class="callout" style="margin-top:30px"><p class="ck">Nota de alcance</p>',
      '<p>El formulario funcional corresponde a la Fase 2 y depende de definir el stack y la herramienta de captura. ',
      'Lo que sí hay que decidir <b>ahora</b> es el modelo de datos: los campos que este formulario capture determinan para siempre ',
      'lo que el tablero de la Fase 3 podrá mostrar.</p></div>',
  '</div></div>');
};

var QUIZ = [
 {q:'¿Tu organización está legalmente constituida?',
  o:[{t:'Sí, tenemos acta constitutiva',v:'osc'},{t:'No, somos un grupo o red',v:'grupo'}]},
 {q:'¿Dónde opera principalmente?',
  o:[{t:'Área Metropolitana',v:'amm'},{t:'Fuera del Área Metropolitana',v:'for'}]},
 {q:'¿Qué buscas hacer hoy?',
  o:[{t:'Inscribirme al registro',v:'alta'},{t:'Actualizar mis datos',v:'upd'},{t:'Postular a una convocatoria',v:'conv'}]}
];
function quizHtml(state){
  var done = state.filter(function(x){ return x != null; }).length;
  var prog = QUIZ.map(function(_,i){ return H('<i class="',(state[i]!=null?'done':''),'"></i>'); }).join('');
  var qs = QUIZ.map(function(Q,i){
    if(i > done) return '';
    var opts = Q.o.map(function(op){
      return H('<button type="button" class="opt',(state[i]===op.v?' sel':''),
        '" data-q="',i,'" data-v="',op.v,'">',esc(op.t),'</button>');
    }).join('');
    return H('<div class="qq"><p>',esc(Q.q),'</p><div class="opts">',opts,'</div></div>');
  }).join('');

  var res = '';
  if(done === QUIZ.length){
    var esGrupo = state[0] === 'grupo';
    var fuera = state[1] === 'for';
    var reqs = esGrupo
      ? ['Identificación oficial de la persona encargada o líder',
         'Descripción de la actividad y de la comunidad que atienden',
         'Carta de dos personas de la comunidad que respalden al grupo',
         'Domicilio y municipio donde operan']
      : ['Acta constitutiva y última modificación',
         'RFC de la organización',
         'Identificación del representante legal',
         'Comprobante de domicilio',
         'Descripción de misión, actividades y población atendida'];
    res = H('<div class="qres"><h4>',
      (esGrupo ? 'Sí puedes registrarte, por la ruta de grupos y redes'
               : 'Sí puedes registrarte como organización constituida'), '</h4>',
      '<p style="font-size:14px;color:var(--ink-2);max-width:none">Esto es lo que vas a necesitar:</p><ul>',
      reqs.map(function(r){ return H('<li>',esc(r),'</li>'); }).join(''), '</ul>',
      (fuera ? H('<p style="font-size:13.5px;background:var(--open-soft);border:1px solid var(--open);border-radius:4px;padding:11px 13px;color:var(--ink-2);max-width:none">',
        '<b>Tu municipio es prioritario.</b> ',SIN_MUNI,' de los 51 municipios del estado no tienen ninguna organización registrada. ',
        'El equipo de fomento puede acompañarte — pídelo en el paso 1.</p>') : ''),
      '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">',
        '<a class="btn" href="#/registro">Descargar mi lista de requisitos</a>',
        '<button class="btn ghost" type="button" id="qreset">Empezar de nuevo</button>',
      '</div></div>');
  }
  return H('<div class="quiz"><h2>¿Aplico? Verificador rápido</h2>',
    '<p class="qp">Tres preguntas. No guardamos nada todavía.</p>',
    '<div class="prog">',prog,'</div>', qs, res, '</div>');
}

/* ============ TRANSPARENCIA ============ */
ROUTES.transparencia = function(){
  var muniTop = MUNIS.slice().sort(function(a,b){ return muniCount[b]-muniCount[a]; }).slice(0,10);
  var maxM = muniCount[muniTop[0]];
  var maxE = ejeCount[EJES[0]];

  var muniBars = muniTop.map(function(m){
    return bar(m, muniCount[m], muniCount[m]/maxM*100, false);
  }).join('') + bar(SIN_MUNI + ' municipios sin ninguna', 0, 0, true);

  var ejeBars = EJES.map(function(e){
    return bar(e, ejeCount[e], ejeCount[e]/maxE*100, false);
  }).join('');

  return H('<div class="page"><div class="wrap">',
    '<p class="crumbs"><a href="#/">Inicio</a> › Transparencia y datos</p>',
    '<h1 class="pt">Transparencia y datos abiertos</h1>',
    '<p class="psub">Tablero público del sector social de Nuevo León. Calculado en vivo sobre los ',nf(TOTAL),
      ' registros del padrón, con la taxonomía ya normalizada. Es el equivalente público del tablero interno de la Fase 3.</p>',

    '<div class="kpis">',
      kpi(nf(TOTAL),'Organizaciones registradas','Registro Estatal'),
      kpi(MUNIS.length+' / '+MUNI_TOTAL,'Municipios con presencia','Clave INEGI'),
      kpi(pct(AMM,TOTAL)+'%','Concentradas en el Área Metropolitana','Cobertura',true),
      kpi(SIN_MUNI,'Municipios sin ninguna organización','Brecha territorial',true),
      kpi(EJES.length,'Ejes temáticos (antes 27 valores mezclados)','Taxonomía normalizada'),
    '</div>',

    '<div class="chart"><h2>Distribución territorial</h2>',
      '<p class="cs">Organizaciones registradas por municipio. Se muestran los diez primeros.</p>',
      '<div class="bars">', muniBars, '</div>',
      '<p class="note">La concentración es el hallazgo más accionable del padrón: define dónde la política de fomento no tiene con quién trabajar. ',
      'Municipios como Aramberri, Mier y Noriega, Iturbide o Rayones —entre los de mayor rezago social del estado— no registran ninguna organización.</p>',
    '</div>',

    '<div class="chart"><h2>Distribución por eje temático</h2>',
      '<p class="cs">Con la taxonomía normalizada. En el padrón actual este campo mezcla nomenclatura propia con nombres de ODS ',
      'y contiene categorías duplicadas: «Salud» (69) y «Salud y bienestar» (46) son el mismo concepto contado dos veces.</p>',
      '<div class="bars">', ejeBars, '</div>',
      '<p class="note">Corregirlo es prerrequisito de la Fase 3: cualquier gráfica construida hoy sobre el campo original es incorrecta.</p>',
    '</div>',

    '<h2 class="st" style="margin-top:38px">Marco normativo</h2>',
    '<p class="mut" style="font-size:14px;margin-bottom:14px">Una sola versión marcada como vigente. ',
    'El histórico queda accesible pero deja de competir por la atención.</p>',
    '<div class="docs">',
      doc('Reglas de Operación — reforma del 31 de octubre de 2025','PDF · 2.8 MB',true,'https://drive.google.com/uc?export=download&id=1rt2jnQPimtZSbFfjwfyaHx07as7dfGx0'),
      doc('Ley de Fomento de la Sociedad Civil Organizada para el Estado de Nuevo León','PDF · 282 KB',false,'https://drive.google.com/uc?export=download&id=1p2oTJGjjHJ4fbHQTuzrKTyohOIJ9ycez'),
      doc('Reglamento de la Ley de Fomento','PDF · servidor SISTEC',false,'https://sistec.nl.gob.mx/Transparencia_2015/Archivos/AC_0001_0004_0171356-0000001.pdf'),
      doc('Acuerdo de creación del Registro Estatal de OSC','PDF · 99 KB',false,'https://drive.google.com/uc?export=download&id=12DkYLaGaIAU0Tjr2KaH5i4Csi8Dxh0vO'),
      doc('Aviso de privacidad integral del Registro','PDF · 272 KB',false,'https://drive.google.com/uc?export=download&id=1287tG3nAO3RMWfZbBi29yOhyfE1MWO9k'),
      doc('Guía para el llenado de transparencia del SAT','PDF · 2.9 MB',false,'https://drive.google.com/uc?export=download&id=1CNu4yHktYnFE2VwTxj6sAbAlvy-lkJDA'),
      doc('Criterios de apoyo a OSC · 2015','PDF · 655 KB',false,'https://drive.google.com/uc?export=download&id=1ua1wZqtWsaW-Wruqyj19GZGb36Kd4KVq'),
      doc('Criterios de apoyo a OSC · 2009','PDF · 264 KB',false,'https://drive.google.com/uc?export=download&id=12mgGnh7jX1hx-_mLC8iOl1TTP_4w-Fzr'),
    '</div>',
    '<details class="hist-rop"><summary>Reglas de Operación anteriores · 3 archivos, 10.9 MB</summary>',
      '<div class="docs">',
        doc('Reglas de Operación · 8 de septiembre de 2025','PDF · 2.3 MB',false,'https://drive.google.com/uc?export=download&id=1ku6XOCwiBm9ONfkCbk1ZSUHxRvXjxvMc'),
        doc('Reglas de Operación · 11 de septiembre de 2024','PDF · 6.0 MB',false,'https://drive.google.com/uc?export=download&id=1nSOgRML7kyfMQSc6yQpC5vz2a0T3m0Tv'),
        doc('Reglas de Operación · 20 de marzo de 2020','PDF · 2.6 MB',false,'https://drive.google.com/uc?export=download&id=1bz8EGy_dm1wO7E4y6cOnMeVneEB1wPFw'),
      '</div>',
    '</details>',
    '<div class="callout" style="border-left-color:var(--p1);background:var(--p1-soft)">',
      '<p class="ck" style="color:var(--naranja-text)">Nota de migración</p>',
      '<p>El portal actual enlaza <b>172 archivos alojados en Google Drive</b>, con un peso conjunto de <b>416 MB</b>. ',
      'Varios son escaneos sin optimizar: el más pesado ocupa <b>78 MB para 15 páginas</b>. ',
      'Al migrar conviene comprimirlos y darles URL propia y estable en el servidor institucional.</p>',
    '</div>',

    '<div class="callout" style="margin-top:26px"><p class="ck">Datos abiertos</p>',
      '<p>El padrón se publica en formato abierto <b>únicamente con campos institucionales</b>: organización, figura jurídica, ',
      'municipio con clave INEGI, eje temático, ODS y estatus del registro. ',
      'Nombres de personas, RFC, teléfonos y correos personales quedan fuera de la publicación — hoy se publican todos.</p></div>',
  '</div></div>');
};

/* ============ INVERSIÓN ============ */
ROUTES.inversion = function(){
  return H('<div class="page"><div class="wrap">',
    '<p class="crumbs"><a href="#/">Inicio</a> › Inversión social y alianzas</p>',
    '<h1 class="pt">Inversión social y alianzas estratégicas</h1>',
    '<p class="psub">Para empresas, fundaciones y organismos internacionales que quieren invertir en Nuevo León. ',
      'Esta sección no existe en el sitio actual, pese a ser el eje de la Subsecretaría.</p>',

    '<div class="callout"><p class="ck">Por qué importa</p>',
      '<p>El modelo de la Subsecretaría se sostiene en <b>coinversión</b>: inversión pública más inversión privada, ',
      'articuladas por el Clúster de Inversión Social. Ese público necesita <b>encontrar y verificar</b> organizaciones ',
      '— y hoy no tiene dónde hacerlo. Con esta sección, el Directorio deja de ser un requisito administrativo ',
      'y se convierte en la capa que apalanca capital privado.</p></div>',

    '<div class="grid2" style="margin-bottom:30px">',
      box('Encuentra dónde invertir','Filtra el directorio por eje temático, municipio y población atendida. Comparte el resultado filtrado por enlace.',
        ['Búsqueda por causa y territorio','Organizaciones con registro vigente','Brechas territoriales identificadas'],'#/directorio','Explorar el directorio'),
      box('Verifica antes de donar','Los tres datos que toda empresa revisa antes de transferir un peso.',
        ['CLUNI','Donataria autorizada y su vigencia','Registro estatal vigente, con fecha'],null,null),
      box('Coinvierte con el Estado','Modalidades alineadas a la Política Social de Nuevo León.',
        ['Inversión anual (VCO)','Inversión focalizada en red (VNI)','Codiseño estratégico'],null,null),
      box('Reconocimiento y reporte','Instrumentos para tu reporte de sostenibilidad.',
        ['Constancia de contribución','Premio IeI','Foro ESG','Manual de convergencia'],null,null),
    '</div>',

    '<div class="box">',
      '<h2>Los tres campos que hay que empezar a capturar</h2>',
      '<p>Nada de lo anterior funciona sin ellos, y ninguno existe hoy en el padrón: ',
      '<b>CLUNI</b>, <b>condición de donataria autorizada</b> y <b>vigencia del registro</b>. ',
      'Son tres columnas nuevas en el formulario de la Fase 2 que desbloquean un público completo.</p>',
    '</div>',
  '</div></div>');
};

/* ============ FORTALECIMIENTO ============ */
ROUTES.fortalecimiento = function(){
  var normas = [
    ['Plan Estatal de Desarrollo 2022–2027','Marco de planeación'],
    ['Ley de Desarrollo Social para el Estado de Nuevo León','Ley estatal'],
    ['Ley General de Desarrollo Social','Ley federal'],
    ['Ley de la Beneficencia Privada para el Estado de Nuevo León','Ley estatal'],
    ['Ley de Protección de Datos Personales en Posesión de Sujetos Obligados','Ley estatal'],
    ['Reglamento de la Ley de Desarrollo Social del Estado','Reglamento'],
    ['Reglamento Interior de la Secretaría de Igualdad e Inclusión','Reglamento'],
    ['Reglamento Interior del Comité Técnico para el Fomento de las Actividades de las OSC','Reglamento'],
    ['Manual de Operaciones de la Secretaría de Igualdad e Inclusión','Manual'],
    ['Ley de Egresos del Estado de Nuevo León','Presupuesto']
  ];
  return H('<div class="page"><div class="wrap">',
    '<p class="crumbs"><a href="#/">Inicio</a> › Fortalecimiento</p>',
    '<h1 class="pt">Fortalecimiento de organizaciones</h1>',
    '<p class="psub">Guías, marco normativo y el boletín del sector. En el portal actual esto vive ',
      'repartido entre «Material de Apoyo» y «Eventos Externos», sin orden ni descripción.</p>',

    '<h2 class="st">Boletín vOSCes</h2>',
    '<p class="mut" style="font-size:14px;margin-bottom:16px">18 volúmenes publicados entre septiembre y febrero. ',
    'Hoy son PDFs sueltos; aquí van como una colección con su periodo.</p>',
    '<div class="vosces">',
      [[18,'FEB'],[17,'FEB'],[16,'FEB'],[15,'ENE'],[14,'ENE'],[13,'ENE'],[12,'ENE'],[11,'ENE'],[10,'DIC'],
       [9,'NOV'],[8,'NOV'],[7,'NOV'],[6,'NOV'],[5,'OCT · NOV'],[4,'OCT'],[3,'OCT'],[2,'OCT'],[1,'SEP · OCT']]
        .map(function(v){ return H('<a class="vol" href="#/fortalecimiento"><span class="n">',v[0],
          '</span><span class="m">',v[1],'</span></a>'); }).join(''),
    '</div>',

    '<h2 class="st" style="margin-top:44px">Marco normativo del sector</h2>',
    '<p class="mut" style="font-size:14px;margin-bottom:16px">Los diez documentos que hoy están en ',
    '«Material de Apoyo», ahora con su tipo y agrupados.</p>',
    '<div class="docs">',
      normas.map(function(d){ return doc(d[0], d[1], false); }).join(''),
    '</div>',

    '<h2 class="st" style="margin-top:44px">Acompañamiento</h2>',
    '<div class="grid2">',
      box('Guías prácticas','Contenido que ya existe pero está enterrado en la sección de multimedia.',
        ['Guía para el llenado de transparencia ante el SAT','Cómo obtener tu CLUNI','Cómo preparar tu informe anual'],'#/transparencia','Ver la guía del SAT'),
      box('Capacitación y asesoría','Calendario de sesiones y acompañamiento del equipo de fomento.',
        ['Sesiones presenciales y en línea','Acompañamiento en municipios sin presencia','Asesoría para grupos sin figura jurídica'],null,null),
      box('Eventos del sector','Agenda propia y de organizaciones aliadas.',
        ['Filtro por mes y por eje','Recordatorio por correo'],null,null),
    '</div>',

    '<div class="callout" style="margin-top:26px"><p class="ck">Por qué sacar el boletín de los PDFs</p>',
      '<p>Un boletín en PDF no aparece en buscadores, no se lee bien en celular y no se puede citar. ',
      'Publicarlo en HTML multiplica su alcance sin producir contenido nuevo — es el cambio de mayor ',
      'retorno por menor esfuerzo de todo el portal.</p></div>',
  '</div></div>');
};

/* ============ ÓRGANOS ============ */
ROUTES.organos = function(){
  return H('<div class="page"><div class="wrap">',
    '<p class="crumbs"><a href="#/">Inicio</a> › Órganos de representación</p>',
    '<h1 class="pt">Órganos de representación</h1>',
    '<p class="psub">El Consejo Consultivo de Fomento a la Sociedad Civil Organizada y el Comité Técnico ',
      'para el Fomento de las Actividades de la Sociedad Civil de Nuevo León son las dos instancias donde ',
      'las organizaciones participan en las decisiones del Estado.</p>',

    '<div class="organo"><div class="o-cab c-ccfsc"><span class="o-sig">CCFSC</span>',
      '<h2>Consejo Consultivo de Fomento a la Sociedad Civil</h2></div>',
      '<div class="o-cuerpo">',
        '<p>Órgano consultivo y propositivo. Reúne a organizaciones de la sociedad civil con la ',
        'administración estatal para opinar sobre políticas públicas y proponer líneas de trabajo ',
        'que fortalezcan al sector.</p>',
        '<dl class="dl">',
          row('Naturaleza','Consultivo y propositivo'),
          row('Quién lo integra','Organizaciones de la sociedad civil y dependencias del Gobierno del Estado'),
          row('Qué produce','Opiniones, propuestas y acuerdos de colaboración'),
          row('Documentos','<span class="mut">Integrantes vigentes, calendario y actas — pendientes de publicar</span>'),
        '</dl>',
      '</div></div>',

    '<div class="organo"><div class="o-cab c-ctfa"><span class="o-sig">CTFA</span>',
      '<h2>Comité Técnico para el Fomento de las Actividades de las OSC</h2></div>',
      '<div class="o-cuerpo">',
        '<p>Órgano de seguimiento de la inversión social destinada al fomento. Revisa y da seguimiento ',
        'a los apoyos otorgados a las organizaciones y rinde informe anual.</p>',
        '<dl class="dl">',
          row('Naturaleza','Seguimiento y evaluación'),
          row('Qué revisa','La inversión social pública dirigida a organizaciones'),
          row('Marco','Reglamento Interior del Comité Técnico'),
          row('Informes','Anuales 2023, 2024 y 2025'),
        '</dl>',
        '<div class="acts" style="margin-top:6px">',
          '<a class="btn ghost sm" href="#/transparencia">Ver informes anuales</a>',
        '</div>',
      '</div></div>',

    '<div class="callout"><p class="ck">Qué falta publicar</p>',
      '<p>De ambos órganos hace falta lo mismo: <b>quiénes los integran hoy, con qué periodo, ',
      'cuándo sesionan y qué acordaron</b>. Es la información que vuelve creíble a un órgano de ',
      'representación, y hoy no está en ninguna de las dos páginas del portal.</p></div>',
  '</div></div>');
};

/* ============ CONTACTO ============ */
ROUTES.contacto = function(){
  return H('<div class="page"><div class="wrap">',
    '<p class="crumbs"><a href="#/">Inicio</a> › Contacto y ayuda</p>',
    '<h1 class="pt">Contacto y ayuda</h1>',
    '<p class="psub">En el sitio actual esta página está vacía. El dato de contacto real vive en otro dominio.</p>',
    '<div class="grid2">',
      '<div class="box"><h2>Dirección de Fomento a OSC</h2><dl class="dl">',
        row('Teléfono','+52 (81) 2033 2834'),
        row('Correo','inversion.social@nuevoleon.gob.mx'),
        row('Domicilio','Torre Administrativa, Piso 2 · Washington 2000 Ote., Col. Obrera, C.P. 64010, Monterrey'),
        row('Horario','Lunes a viernes, 9:00 a 16:00 h'),
        row('Respuesta','Hasta 3 días hábiles por correo'),
      '</dl></div>',
      '<div class="box"><h2>Canal asistido</h2>',
        '<p>Visible a propósito, no escondido. Muchas organizaciones pequeñas no pueden completar el trámite solas, ',
        'y ocultar el teléfono no reduce llamadas: las convierte en quejas.</p>',
        '<ul><li>WhatsApp institucional</li><li>Acompañamiento presencial en municipios prioritarios</li>',
        '<li>Asesoría para grupos sin figura jurídica</li></ul>',
        '<div><a class="btn sm" href="#/registro">Ir al registro</a></div></div>',
    '</div>',
  '</div></div>');
};

/* ============ ACCESIBILIDAD ============ */
ROUTES.accesibilidad = function(){
  return H('<div class="page"><div class="wrap">',
    '<p class="crumbs"><a href="#/">Inicio</a> › Accesibilidad</p>',
    '<h1 class="pt">Declaración de accesibilidad</h1>',
    '<p class="psub">Compromiso público y canal para reportar barreras. En una Secretaría de Igualdad e Inclusión, ',
      'con 52 organizaciones de discapacidad en su propio padrón, esto no es opcional.</p>',
    '<div class="grid2">',
      box('Compromiso','Objetivo de conformidad y su verificación.',
        ['WCAG 2.1 nivel AA','Auditoría de tercero, publicada','Revisión anual'],null,null),
      box('Qué se corrigió al migrar','Defectos del sitio anterior que la nueva plataforma resuelve.',
        ['El sitio declaraba lang="en-US" en contenido en español','Sin títulos ni descripciones por página','Contraste insuficiente del color de marca sobre blanco'],null,null),
      box('Cómo reportar una barrera','Canal directo, con compromiso de respuesta.',
        ['Formulario de reporte','Teléfono y WhatsApp','Respuesta en 5 días hábiles'],null,null),
      box('Criterios verificables','Fijados como condición de aceptación, no como intención.',
        ['Navegación completa con teclado','Objetivos táctiles de 44 px o más','Texto al 200% sin pérdida de contenido','Usable en conexión 3G'],null,null),
    '</div>',
  '</div></div>');
};

ROUTES.historias = function(){
  return H('<div class="page"><div class="wrap">',
    '<p class="crumbs"><a href="#/">Inicio</a> › Historias</p>',
    '<h1 class="pt">Historias de organizaciones</h1>',
    '<p class="psub">Organizaciones inscritas en el Registro Estatal contando su trabajo en primera persona. ',
      'Cada historia enlaza a su ficha en el directorio.</p>',
    '<h2 class="vh">Todas las historias</h2>',
    '<div class="stories">', STORIES.map(story).join(''), '</div>',
  '</div></div>');
};

ROUTES.historia = function(p,seg){
  var st = storyBySlug(seg[1]);
  if(!st) return ROUTES['404']();
  var o = orgById(st.org);
  var otras = STORIES.filter(function(x){ return x.s !== st.s; }).slice(0,3);
  return H('<div class="page"><div class="wrap">',
    '<p class="crumbs"><a href="#/">Inicio</a> › <a href="#/historias">Historias</a> › ',esc(st.n),'</p>',
    '<div class="hist">',
      '<div>',
        '<video class="hvid" controls preload="none" playsinline poster="',VIDEOS[st.s].p,'" ',
          'src="',VIDEOS[st.s].v,'">',
          'Tu navegador no puede reproducir video. ',
          '<a href="https://drive.google.com/file/d/',st.v,'/view">Ver el video en Drive</a>.',
        '</video>',
        '<p class="vnote">Reproducción en la propia página. Original de <b>',st.vsz,
          '</b> comprimido a <b>',VIDEOS[st.s].ahora,'</b> a perfil web.</p>',
        '<h1 class="pt">',esc(st.n),'</h1>',
        o ? H('<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:22px">',
              '<span class="chip eje">',esc(o.e),'</span>',
              '<span class="chip eje">',esc(o.m),'</span>',
              '<span class="chip eje">',esc(o.t),'</span></div>') : '',
        st.p.map(function(x){ return H('<p style="font-size:1.06rem">',esc(x),'</p>'); }).join(''),
        '<div class="callout" style="border-left-color:var(--p1);background:var(--p1-soft)">',
          '<p class="ck" style="color:var(--naranja-text)">Nota de migración</p>',
          '<p>En el portal actual este video pesa <b>',st.vsz,'</b> y vive en Google Drive, ',
          'detrás de una advertencia de virus que hace abandonar a mucha gente. ',
          'Aquí se reproduce en la página a <b>',VIDEOS[st.s].ahora,'</b>. ',
          'Los cinco suman <b>1.2 GB</b> en el original y <b>9.5 MB</b> comprimidos. Falta añadir subtítulos.</p>',
        '</div>',
      '</div>',
      '<aside>',
        o ? H('<div class="fbox"><h2>Esta organización</h2>',
            '<p style="font-size:.94rem;margin:0 0 14px;color:var(--ink-2)">',
              esc(o.s ? (o.s.length>150 ? o.s.slice(0,147)+'…' : o.s) : 'Sin misión capturada.'),'</p>',
            '<div class="acts"><a class="btn sm" href="#/organizacion/',o.i,'">Ver su ficha completa</a>',
            '<a class="btn ghost sm" href="#/directorio?e=',encodeURIComponent(o.e),'">Otras de ',esc(o.e),'</a></div>',
          '</div>')
          : '<div class="fbox"><h2>Esta organización</h2><p style="font-size:.94rem;margin:0;color:var(--muted)">No localizada en el padrón.</p></div>',
        '<div class="fbox"><h2>Otras historias</h2>',
          '<ul style="list-style:none;margin:0;padding:0;display:grid;gap:12px">',
          otras.map(function(x){ return H('<li><a href="#/historia/',x.s,'" style="font-weight:600;font-size:.95rem">',esc(x.n),'</a>',
            '<div style="font-size:.85rem;color:var(--muted);line-height:1.45">',esc(x.r),'</div></li>'); }).join(''),
          '</ul></div>',
      '</aside>',
    '</div>',
  '</div></div>');
};

ROUTES['404'] = function(){
  return H('<div class="page"><div class="wrap"><h1 class="pt">Esta página no existe</h1>',
    '<p class="psub">Quizá el enlace cambió con la nueva plataforma.</p>',
    '<a class="btn" href="#/">Ir al inicio</a> <a class="btn ghost" href="#/directorio">Buscar en el directorio</a>',
    '</div></div>');
};

/* ============ BINDINGS ============ */
var quizState = [null,null,null];

function setParams(patch){
  var r = parseHash();
  var p = r.params;
  Object.keys(patch).forEach(function(k){
    if(patch[k] === null || patch[k] === '') delete p[k]; else p[k] = patch[k];
  });
  var qs = Object.keys(p).map(function(k){
    return encodeURIComponent(k) + '=' + encodeURIComponent(p[k]);
  }).join('&');
  location.hash = '#/directorio' + (qs ? '?' + qs : '');
}

function bind(){
  var f = MAIN.querySelector('[data-go="search"]');
  if(f){
    f.addEventListener('submit', function(e){
      e.preventDefault();
      var v = f.querySelector('input[name=q]').value.trim();
      location.hash = '#/directorio' + (v ? '?q=' + encodeURIComponent(v) : '');
    });
  }

  var ff = MAIN.querySelector('#ff');
  if(ff){
    ff.addEventListener('submit', function(e){ e.preventDefault(); });
    var t;
    ff.querySelector('input[name=q]').addEventListener('input', function(e){
      clearTimeout(t);
      var v = e.target.value;
      t = setTimeout(function(){ setParams({q:v, p:null}); }, 280);
    });
    Array.prototype.forEach.call(ff.querySelectorAll('input[name=e]'), function(cb){
      cb.addEventListener('change', function(){
        var on = [];
        Array.prototype.forEach.call(ff.querySelectorAll('input[name=e]:checked'), function(c){ on.push(c.value); });
        setParams({e: on.join('|') || null, p:null});
      });
    });
    ff.querySelector('select[name=m]').addEventListener('change', function(e){ setParams({m:e.target.value||null, p:null}); });
    ff.querySelector('select[name=t]').addEventListener('change', function(e){ setParams({t:e.target.value||null, p:null}); });
    var w = ff.querySelector('input[name=w]');
    if(w) w.addEventListener('change', function(e){ setParams({w: e.target.checked?'1':null, p:null}); });
    var more = ff.querySelector('#more');
    if(more){
      more.addEventListener('click', function(){
        Array.prototype.forEach.call(ff.querySelectorAll('.xtra'), function(l){ l.hidden = false; });
        more.parentNode.removeChild(more);
      });
    }
  }

  var clr = MAIN.querySelector('#clr');
  if(clr) clr.addEventListener('click', function(){ location.hash = '#/directorio'; });

  Array.prototype.forEach.call(MAIN.querySelectorAll('[data-rm]'), function(b){
    b.addEventListener('click', function(){
      var k = b.getAttribute('data-rm');
      if(k === 'e'){
        var r = parseHash();
        var cur = (r.params.e || '').split('|').filter(Boolean).filter(function(x){
          return x !== b.getAttribute('data-v');
        });
        setParams({e: cur.join('|') || null, p:null});
      } else {
        var patch = {p:null};
        patch[k] = null;
        setParams(patch);
      }
    });
  });

  Array.prototype.forEach.call(MAIN.querySelectorAll('[data-page]'), function(b){
    b.addEventListener('click', function(){ setParams({p: b.getAttribute('data-page')}); });
  });

  var qh = MAIN.querySelector('#quiz');
  if(qh){
    qh.innerHTML = quizHtml(quizState);
    qh.addEventListener('click', function(e){
      var o = e.target.closest ? e.target.closest('.opt') : null;
      if(o){
        var i = parseInt(o.getAttribute('data-q'), 10);
        quizState[i] = o.getAttribute('data-v');
        for(var j = i+1; j < quizState.length; j++) quizState[j] = null;
        qh.innerHTML = quizHtml(quizState);
        return;
      }
      if(e.target.id === 'qreset'){
        quizState = [null,null,null];
        qh.innerHTML = quizHtml(quizState);
      }
    });
  }

  if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    Array.prototype.forEach.call(MAIN.querySelectorAll('.bfl'), function(el){
      var w = el.style.getPropertyValue('--w');
      el.style.setProperty('--w','0%');
      requestAnimationFrame(function(){
        requestAnimationFrame(function(){ el.style.setProperty('--w', w); });
      });
    });
  }
}

var burger = document.getElementById('burger');
var navEl = document.getElementById('nav');
burger.addEventListener('click', function(){
  var open = navEl.classList.toggle('open');
  burger.setAttribute('aria-expanded', open ? 'true' : 'false');
});
navEl.addEventListener('click', function(e){
  if(e.target.tagName === 'A'){
    navEl.classList.remove('open');
    burger.setAttribute('aria-expanded','false');
  }
});

render();
})();

