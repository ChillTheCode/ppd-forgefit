import  { useState} from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { FilterMatchMode } from "primereact/api";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

const mockData: Product[] = [
  { id: 1, name: "Laptop", category: "Electronics", price: 1200, quantity: 10 },
  { id: 2, name: "Phone", category: "Electronics", price: 800, quantity: 15 },
  { id: 3, name: "Shirt", category: "Clothing", price: 30, quantity: 50 },
  { id: 4, name: "Shoes", category: "Clothing", price: 80, quantity: 25 },
  { id: 5, name: "Watch", category: "Accessories", price: 200, quantity: 5 },
];

const data = [
  { name: "Jan", uv: 4000, pv: 2400, amt: 2400 },
  { name: "Feb", uv: 3000, pv: 1398, amt: 2210 },
  { name: "Mar", uv: 2000, pv: 9800, amt: 2290 },
  { name: "Apr", uv: 2780, pv: 3908, amt: 2000 },
  { name: "May", uv: 1890, pv: 4800, amt: 2181 },
  { name: "Jun", uv: 2390, pv: 3800, amt: 2500 },
  { name: "Jul", uv: 3490, pv: 4300, amt: 2100 },
];


const Help = () => {
  const [products] = useState(mockData);
  const [filters, setFilters] = useState({
    global: { value: "", matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    category: { value: null, matchMode: FilterMatchMode.EQUALS },
    price: { value: null, matchMode: FilterMatchMode.CONTAINS },
    quantity: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(5);


  const renderHeader = () => {
    return (
      <div className="flex justify-between p-4 bg-gray-100 rounded-lg">
        <span className="p-input-icon-left">
       
          <InputText
            placeholder="Global Search"
            className="p-inputtext-sm"
            value={globalFilter}
            onChange={(e) => {
              setGlobalFilter(e.target.value);
              setFilters((prevFilters) => ({
                ...prevFilters,
                global: { value: e.target.value, matchMode: FilterMatchMode.CONTAINS },
              }));
            }}
          />
        </span>
        
      </div>
    );
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <DataTable
        value={products}
        selectionMode="single"
        selection={selectedProduct}
        onSelectionChange={(e) => setSelectedProduct(e.value as Product)}
        paginator
        rows={rows}
        first={first}
        onPage={(e) => {
          setFirst(e.first);
          setRows(e.rows);
        }}
        header={renderHeader()}
        filters={filters}
        globalFilterFields={["name", "category", "price", "quantity"]}
        filterDisplay="menu"
        stripedRows
        responsiveLayout="scroll"
        sortField="name"
        sortOrder={1}
        className="border border-gray-300 rounded-lg overflow-hidden"
      >
        <Column selectionMode="single" headerStyle={{ width: "3rem" }}></Column>
        <Column field="id" header="ID" sortable className="p-2" />
        <Column
          field="name"
          header="Name"
          sortable
          
          filter
          filterField="name"
          filterPlaceholder="Search by name"
          filterMatchMode={FilterMatchMode.CONTAINS}
          className="p-2"
        />
        <Column
          field="category"
          header="Category"
          sortable
          filter
          filterElement={(options) => (
            <Dropdown
              value={options.value}
              options={["Electronics", "Clothing", "Accessories"]}
              onChange={(e) => options.filterApplyCallback(e.value)}
              placeholder="Select Category"
              showClear
              className="w-full p-2"
            />
          )}
          className="p-2"
        />
        <Column
          field="price"
          header="Price"
          filter
          filterField="price"
          filterPlaceholder="Search by price"
          filterMatchMode={FilterMatchMode.CONTAINS}
          sortable
          className="p-2"
        />
        <Column
          filter
          filterField="quantity"
          filterPlaceholder="Search by quantity"
          filterMatchMode={FilterMatchMode.CONTAINS}
          field="quantity"
          header="Quantity"
          sortable
          className="p-2"
        />
      </DataTable>
      <div className="w-full h-[400px] bg-white rounded-lg shadow-md p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="pv"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
    </div>
  );
}

export default Help;