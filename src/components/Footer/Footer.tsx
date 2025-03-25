import React, {useState} from "react";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {InputSwitch} from "primereact/inputswitch";


function Footer() {
  const products = [
    { code: 'P1001', name: 'Wireless Mouse', category: 'Electronics', quantity: 25 },
    { code: 'P1002', name: 'Keyboard', category: 'Electronics', quantity: 40 },
    { code: 'P1003', name: 'Office Chair', category: 'Furniture', quantity: 10 },
    { code: 'P1004', name: 'Notebook', category: 'Stationery', quantity: 100 },
    { code: 'P1005', name: 'Water Bottle', category: 'Accessories', quantity: 60 },
    { code: 'P1006', name: 'LED Monitor', category: 'Electronics', quantity: 15 },
    { code: 'P1007', name: 'Desk Lamp', category: 'Furniture', quantity: 30 },
    { code: 'P1008', name: 'Backpack', category: 'Accessories', quantity: 20 },
    { code: 'P1009', name: 'Pen Set', category: 'Stationery', quantity: 200 },
    { code: 'P1010', name: 'USB Drive', category: 'Electronics', quantity: 75 }
  ];
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [rowClick, setRowClick] = useState(true);  const rowClassName = (rowData) => {

  }
  return (
    <div className="card">
      <div className="flex justify-content-center align-items-center mb-4 gap-2">
        <InputSwitch inputId="input-rowclick" checked={rowClick} onChange={(e) => setRowClick(e.value)} />
        <label htmlFor="input-rowclick">Row Click</label>
      </div>
      <DataTable value={products} selectionMode={rowClick ? null : 'checkbox'} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)} dataKey="id" tableStyle={{ minWidth: '50rem' }}>
        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
        <Column field="code" header="Code"></Column>
        <Column field="name" header="Name"></Column>
        <Column field="category" header="Category"></Column>
        <Column field="quantity" header="Quantity"></Column>
      </DataTable>
    </div>
  );
}

export default Footer;