import Axios from "axios";
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import React, { Component, useState } from "react";
import ReactDataGrid from 'react-data-grid';
import Pagination from "react-js-pagination";
import { Toolbar,Data, Filters } from "react-data-grid-addons";

let rows ='';
let PerPage=5;
var InitialRows;
var log='';
let CountItems = null;
const {
  NumericFilter,
  MultiSelectFilter
} = Filters;
const defaultColumnProperties = {
  filterable: true,
  sortable: true,
  width: 120
  };
  const columns = [
    { key: 'id', name: 'ID' , sortDescendingFirst: true, 
    filterRenderer: NumericFilter}, 
    { key: 'Name', name: 'Name', filterRenderer: MultiSelectFilter }, 
    { key: 'DateOfBird', name: 'DateOfBird',filterRenderer: MultiSelectFilter}, 
    { key: 'Gender', name: 'Gender', filterRenderer: MultiSelectFilter , 
    formatter: value => FromatGender(value)}, 
    { key: 'Task', name: 'Task', filterRenderer: NumericFilter }
  ].map(c => ({ ...c, ...defaultColumnProperties }));
const selectors = Data.Selectors;

function FromatGender(value){
var pol='';
if(value.value==false) {pol = 'F'}
else{pol = 'M'}
return pol;
}



class App extends React.Component {
    constructor(props) {
          super(props);
          this.state = {
            rows:[],
            activePage:1,
            CountRows:this.getCountRow()
            
          };
        } 
        getRows(rows, filters) {
          return selectors.getRows({ rows, filters });
        }
        
        
        
        getFilters(rows, filters) {
          var param='';
          if(filters.filterTerm.length==0){param='Сброшен фильтр';}
          else{param='Установлен фильтр со значением - '+filters.filterTerm[0].value+' для столбца - '+filters.column.key;}
          Axios.post('api/Users/?act='+param).then(function(response){
            log= response.data;
            
          }.bind(this));
          const newFilters = { ...filters };
          if(filters.filterTerm==null){
           return rows;
          }
          else{
            if (filters.filterTerm) {
              newFilters[filters.column.key] = filters;
              if(newFilters.filterTerm.length>0){
                if(newFilters.filterTerm[0].value=='M'){
                  newFilters.filterTerm[0].value=true;
                }
                else{
                  newFilters.filterTerm[0].value = false;
                }
              }
              
            } else {
              delete newFilters[filters.column.key];
            }
            return this.getRows(rows,newFilters);
          }
         
        };
        getValidFilterValues(rows, columnId) {
          if(rows.length>0){
            if(columnId=="Gender"){
                return ['F','M'].map(c =>c).filter((item, i, a) => {
                  return i === a.indexOf(item); 
                });
            }else{
              return rows
              .map(r => r[columnId])
              .filter((item, i, a) => {
                return i === a.indexOf(item); 
              });
            }
           
          }
          else {
            return rows;
          }
        }
    
        sortRows(setrows, sortColumn, sortDirection){
          var param='';
          if( sortDirection === "NONE") {
            param='Отключена сортировка данных';
          } else if(sortDirection === "DESC") {
            param='Включена сортировка данных по убыванию по столбцу - '+sortColumn;
          }else if(sortDirection === "ASC"){
            param='Включена сортировка данных по увеличению по столбцу - '+sortColumn;
          }
          Axios.post('api/Users/?act='+param).then(function(response){
          log= response.data;
          
        }.bind(this));
        const comparer = (a, b) => {
          if (sortDirection === "ASC") {
            return a[sortColumn] > b[sortColumn] ? 1 : -1;
          } else if (sortDirection === "DESC") {
            return a[sortColumn] < b[sortColumn] ? 1 : -1;
          }
        };
        if( sortDirection === "NONE") {
          return rows;
          }  
          
        else {
             return [...setrows].sort(comparer);
          }  
            
          
        };
        getCountRow(){
          Axios.get('api/Users/').then(function(response){
            this.setState({CountRows: response.data});
            
            }.bind(this));
        }
        componentDidMount(){
              Axios.get('api/Users/?page=1&pageSize=5').then(function(response){
              this.setState({rows: response.data});
            rows = this.state.rows;}.bind(this));
        }
        changePage(e){
          this.setState({ activePage: e})
          Axios.get('api/Users/?page='+e+'&pageSize='+PerPage).then(function(response){
            rows = response.data;
            this.setState({rows: response.data});}.bind(this));
        }
        render() {
          if(this.state.rows!=undefined )
          {
          CountItems = this.state.rows.length
          InitialRows = this.state.rows
          return(
            <div>
               <ReactDataGrid
               columns={columns}
               rowGetter=
               {
                 i => {
                   return InitialRows[i];
                 }
               }
               rowsCount={InitialRows.length}
               minHeight={500} 
               toolbar={<Toolbar enableFilter={true} />} 
               onGridSort={
               (sortColumn, sortDirection) => this.sortRows(this.state.rows,sortColumn,sortDirection)}
            //   this.setState({rows: this.sortRows(this.state.rows,sortColumn,sortDirection)})} 
               onAddFilter={filter => this.setState({rows: this.getFilters(rows,filter)})}
               onClearFilters={() => this.setState({rows: rows})}
               getValidFilterValues={
                 columnKey => this.getValidFilterValues(rows, columnKey)}
           />
           <Pagination
                   onChange={e => this.changePage(e)}
                   activePage={this.state.activePage}
                   itemsCountPerPage={PerPage}
                   totalItemsCount = {this.state.CountRows}
                   pageRangeDisplayed={5}
                  
                 />
                 </div>
           )}
           return null;
            }
            
      }
ReactDOM.render(<App />, document.getElementById('root'));

