import{r as t,u as p,j as s}from"./index-B9wrcDWQ.js";import{P as x}from"./Container-Dk9VdPk9.js";import{P as g}from"./PageHeader-BHYpsllP.js";import{s as v}from"./scheduledBus.service-ImcWo4LN.js";import{N}from"./NormalTable-Dl69B-GF.js";import{c as T}from"./convertToIST-C7FokF_m.js";import"./ButtonList-DgGakKsg.js";import"./ToggleSwitch-0XDEILB1.js";const L=()=>{const[c,r]=t.useState(!1),[i,u]=t.useState(null),[d,n]=t.useState([]),a=p(),m=[{id:"create-schedule",label:"Create Schedule",icon:"gridicons:create"}],f=[{label:"Bus No",field:"bus.busNumber"},{label:"Driver",field:"driver.firstName"},{label:"Route",field:"route.routeName"},{label:"Schedule Time",field:"scheduleTime"},{label:"Status",field:"status"}],h=[{label:"View",icon:"mdi:eye",callback:e=>a(e._id)},{label:"Edit",icon:"mdi:pencil",callback:e=>a(`${e._id}`)}],b=e=>{e==="create-schedule"&&a("new")};return t.useEffect(()=>{let e=!0;return(async()=>{try{r(!0);const l=await v.getAllScheduledBuses({});if(e){const S=l.map(o=>({...o,scheduleTime:T(o.scheduleTime)}));n(S)}}catch(l){u(l.message)}finally{e&&r(!1)}})(),()=>{e=!1}},[]),s.jsxs(x,{children:[s.jsx(g,{title:"Schedules",buttons:m,onButtonClick:b}),s.jsx("div",{className:"w-screen md:w-auto overflow-x-auto",children:s.jsx(N,{headers:f,data:d,actions:h,isLoading:c,error:i})})]})};export{L as default};
