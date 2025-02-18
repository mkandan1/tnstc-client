const O=(c,i,e=[])=>{const r=(s,l)=>Object.keys(s).filter(t=>!l.includes(t)).reduce((t,n)=>(t[n]=s[n],t),{}),u=r(c,e),f=r(i,e);return JSON.stringify(u)===JSON.stringify(f)};export{O as a};
