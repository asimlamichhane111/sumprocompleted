// import React,{useEffect,useState} from "react";
// const LowStockAlert=()=>{
//     const[lowStock,SetLowStock]=useState([]);
//     useEffect(()=>{
//         fetch("http://127.0.0.1:8000/low-stock/")
//         .then(response => response.json())
//         .then(data => setLowStock(data))
//         .catch(error => console.error("Error fetching low-stock items:", error));
//     },[]);
//     if (lowStock.length===0)
//         return null;
//     return(
//         <div>
//             <h3>Low Stock Alert!</h3>
//             <ul>
//                 {lowStock.map(product=>(
//                     <li key={product.id}>
//                         {product.name}-Only {product.stock} left!
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// }
// export default LowStockAlert;