import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import InventoryState from "./context/inventory/inventoryState";
import {BrowserRouter} from "react-router-dom";

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <InventoryState>
      <App />
    </InventoryState>
  </BrowserRouter>
)
