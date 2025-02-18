import{g as t,d as o,p as a,e as c}from"./index-B9wrcDWQ.js";const u={getAllBuses:async()=>{try{return await t("/buses/")}catch(r){throw console.error("Error fetching buses:",r.message),r}},getBusById:async r=>{try{return await t(`/buses/${r}`)}catch(e){throw console.error(`Error fetching bus with ID ${r}:`,e.message),e}},createBus:async r=>{try{return await c("/buses",r)}catch(e){throw console.error("Error creating bus:",e.message),e}},updateBus:async(r,e)=>{try{return await a(`/buses/${r}`,e)}catch(s){throw console.error(`Error updating bus with ID ${r}:`,s.message),s}},deleteBus:async r=>{try{return await o(`/buses/${r}`)}catch(e){throw console.error(`Error deleting bus with ID ${r}:`,e.message),e}}};export{u as b};
