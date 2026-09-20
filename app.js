const KEY="owerplay-creditos-v1",RESERVE="owerplay-reserve-v1";
const seed=[
{id:"p1",type:"purchase",date:"2026-09-02",server:"Uniplay",qty:20,amount:160,note:""},
{id:"p2",type:"purchase",date:"2026-09-02",server:"GOAT",qty:10,amount:70,note:""},
{id:"p3",type:"purchase",date:"2026-09-05",server:"Uniplay",qty:20,amount:160,note:""},
{id:"p4",type:"purchase",date:"2026-09-07",server:"Uniplay",qty:20,amount:160,note:""},
{id:"p5",type:"purchase",date:"2026-09-08",server:"Uniplay",qty:20,amount:160,note:""},
{id:"p6",type:"purchase",date:"2026-09-08",server:"GOAT",qty:10,amount:70,note:""},
{id:"p7",type:"purchase",date:"2026-09-14",server:"GOAT",qty:10,amount:70,note:""},
{id:"p8",type:"purchase",date:"2026-09-14",server:"Uniplay",qty:20,amount:160,note:""},
{id:"r1",type:"reseller",date:"2026-09-01",server:"Uniplay",reseller:"Dayana",qty:20,amount:180,note:"Data exata não informada"},
{id:"r2",type:"reseller",date:"2026-09-01",server:"Uniplay",reseller:"Ranon",qty:10,amount:100,note:"Data exata não informada"},
{id:"p9",type:"purchase",date:"2026-09-19",server:"Uniplay",qty:20,amount:160,note:""},
{id:"r3",type:"reseller",date:"2026-09-19",server:"Uniplay",reseller:"Ranon",qty:10,amount:100,note:""}
];
let data=JSON.parse(localStorage.getItem(KEY)||"null")||seed;
let reserve=Number(localStorage.getItem(RESERVE)||0);
const $=id=>document.getElementById(id),money=n=>n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}),fmt=d=>d.split("-").reverse().slice(0,2).join("/");
function persist(){localStorage.setItem(KEY,JSON.stringify(data))}
function render(){
 const purchases=data.filter(x=>x.type==="purchase"),resales=data.filter(x=>x.type==="reseller"),sales=data.filter(x=>x.type==="sale");
 const invested=purchases.reduce((a,x)=>a+x.amount,0),bought=purchases.reduce((a,x)=>a+x.qty,0);
 const uni=purchases.filter(x=>x.server==="Uniplay"),goat=purchases.filter(x=>x.server==="GOAT");
 const uq=uni.reduce((a,x)=>a+x.qty,0),gq=goat.reduce((a,x)=>a+x.qty,0),us=uni.reduce((a,x)=>a+x.amount,0),gs=goat.reduce((a,x)=>a+x.amount,0);
 const uniOut=resales.reduce((a,x)=>a+x.qty,0)+sales.filter(x=>x.server==="Uniplay").reduce((a,x)=>a+x.qty,0),goatOut=sales.filter(x=>x.server==="GOAT").reduce((a,x)=>a+x.qty,0); const uniStock=uq-uniOut,goatStock=gq-goatOut,stock=uniStock+goatStock;
 const rr=resales.reduce((a,x)=>a+x.amount,0),rq=resales.reduce((a,x)=>a+x.qty,0);
 $("invested").textContent=money(invested);$("periodSummary").textContent=bought+" créditos · "+purchases.length+" compras";
 $("stock").textContent=stock;$("stockServers").textContent=uniStock+" Uniplay · "+goatStock+" GOAT";$("creditsBought").textContent=bought;$("servers").textContent=uq+" Uniplay · "+gq+" GOAT";
 $("resellerRevenue").textContent=money(rr);$("resellerCredits").textContent=rq+" créditos repassados";
 const optimizedUniCost=Math.floor(uq/100)*750+(uq%100>=50?375:Math.floor((uq%100)/20)*160+((uq%100)%20>=10?85:0)); const saving=Math.max(0,us-optimizedUniCost);$("saving").textContent=money(saving);$("savingText").textContent="com lotes de 50–100"; $("avgUni").textContent=money(uq?us/uq:0);$("buyPace").textContent=purchases.length?(bought/purchases.length).toLocaleString("pt-BR",{maximumFractionDigits:1}):"0";$("buyPaceText").textContent=purchases.length+" compras no mês";
 $("reserveValue").textContent=money(reserve);let pct=Math.min(100,reserve/375*100);$("reserveBar").style.width=pct+"%";$("reservePercent").textContent=Math.round(pct)+"% da meta";$("reserveCredits").textContent=Math.floor(reserve/10)+" de 38 créditos";$("reserveText").textContent=reserve>=375?"Meta atingida · lote de 50 disponível":"Faltam "+money(375-reserve)+" para 50 créditos";
 $("uniBought").textContent=uq;$("goatBought").textContent=gq;$("uniSpent").textContent=money(us);$("goatSpent").textContent=money(gs);
 const total=Math.max(1,bought);$("uniLine").style.width=(uq/total*100)+"%";$("goatLine").style.width=(gq/total*100)+"%";
 const list=[...data].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,8);
 $("transactions").innerHTML=list.map(x=>{let title=x.type==="purchase"?"Compra "+x.server:x.type==="reseller"?"Revenda · "+x.reseller:"Saída · "+x.server;let cls=x.type==="reseller"?"reseller":x.server==="GOAT"?"goat":"";let sign=x.type==="purchase"?"−":"+";return '<div class="tx" data-id="'+x.id+'"><div class="txIcon '+cls+'">'+(x.type==="purchase"?"↓":x.type==="reseller"?"⇄":"↗")+'</div><div><b>'+title+'</b><small>'+fmt(x.date)+' · '+x.qty+' créditos</small></div><div class="txAmount"><b>'+sign+" "+money(x.amount)+'</b><small>'+x.server+'</small></div></div>'}).join("");
 document.querySelectorAll(".tx").forEach(el=>el.onclick=()=>edit(el.dataset.id));
}
function openForm(type,item){
 $("sheetWrap").classList.add("show");$("type").value=type;$("editId").value=item?.id||"";$("date").value=item?.date||new Date().toLocaleDateString("en-CA");$("qty").value=item?.qty||"";$("amount").value=item?.amount||"";$("note").value=item?.note||"";$("server").value=item?.server||"Uniplay";$("reseller").value=item?.reseller||"Ranon";
 $("resellerLabel").classList.toggle("hidden",type!=="reseller");$("serverLabel").classList.toggle("hidden",type==="reseller");$("deleteBtn").classList.toggle("hidden",!item);
 $("formTitle").textContent=item?"Editar movimentação":type==="purchase"?"Nova compra":type==="reseller"?"Nova revenda":"Nova saída";
}
function closeForm(){$("sheetWrap").classList.remove("show")}
function edit(id){let item=data.find(x=>x.id===id);if(item)openForm(item.type,item)}
document.querySelectorAll("[data-open]").forEach(b=>b.onclick=()=>openForm(b.dataset.open));
$("close").onclick=$("backdrop").onclick=closeForm;
$("form").onsubmit=e=>{e.preventDefault();let type=$("type").value,id=$("editId").value||("m"+Date.now());let obj={id,type,date:$("date").value,server:type==="reseller"?"Uniplay":$("server").value,reseller:type==="reseller"?$("reseller").value:undefined,qty:Number($("qty").value),amount:Number($("amount").value),note:$("note").value};let i=data.findIndex(x=>x.id===id);if(i>=0)data[i]=obj;else data.push(obj);if(type==="sale"&&i<0){reserve+=obj.qty*10;localStorage.setItem(RESERVE,reserve)}persist();closeForm();render()};
$("deleteBtn").onclick=()=>{let id=$("editId").value;if(confirm("Excluir esta movimentação?")){data=data.filter(x=>x.id!==id);persist();closeForm();render()}};
$("adjustReserve").onclick=()=>{$("reserveInput").value=reserve;$("reserveSheet").classList.add("show")};
document.querySelector(".reserveClose").onclick=document.querySelector(".reserveBackdrop").onclick=()=>$("reserveSheet").classList.remove("show");
$("reserveForm").onsubmit=e=>{e.preventDefault();reserve=Number($("reserveInput").value||0);localStorage.setItem(RESERVE,reserve);$("reserveSheet").classList.remove("show");render()};
$("seeAll").onclick=()=>{document.querySelectorAll(".tx").forEach(x=>x.style.display="grid");alert("As movimentações mais recentes aparecem aqui. Uma tela completa de histórico entra na próxima evolução.")};
render();