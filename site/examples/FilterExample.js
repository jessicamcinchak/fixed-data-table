"use strict";

var ExampleImage = require('./ExampleImage');
var FakeObjectDataListStore = require('./FakeObjectDataListStore');
var FixedDataTable = require('fixed-data-table');
var React = require('react');

var Column = FixedDataTable.Column;
var PropTypes = React.PropTypes;
var Table = FixedDataTable.Table;

function renderImage(/*string*/ cellData) {
  return <ExampleImage src={cellData} />;
}

var FilterExample = React.createClass({
  getInitialState() {
    return {
      rows: new FakeObjectDataListStore().getAll(),
      filteredRows: null,
      filterBy: null
    };
  },

  componentWillMount() {
    this._filterFirstNamesBy(this.state.filterBy);
    this._filterLastNamesBy(this.state);
    this._filterZipDigitsBy(this.state.filterBy);
  },

  _filterFirstNamesBy(filterBy) {

    var rows = this.state.rows.slice();        
    var filteredRows = filterBy ? rows.filter(function(row) {
      return row['firstName'].toLowerCase().indexOf(filterBy.toLowerCase()) > -1;
    }) : rows;

    this.setState({
      filteredRows, //filteredRows is {array} - array of objects, objects are each row
      filterBy //filterBy is {string} - text input
    })
  },

  _filterLastNamesBy() {
    
    // var e = document.getElementById('lastNameSelect'); //undefined??
    // var optionAM = e.options[1].value; //should return string 'abc...'
    // var optionNZ = e.options[2].value; //should return string 'nop...'
    // console.log(e, optionAM, optionNZ);

    var rows = this.state.rows.slice();
    var filteredRows = rows.filter(function(row) {
      // if (/* select = a-m */) {
      //   return row['lastName'].toLowerCase().charAt(0).indexOf(optionAM) > -1;
      // } else if (/* select = n-z */) {
      //   return row['lastName'].toLowerCase().charAt(0).indexOf(optionNZ) > -1;
      // } else {
      //   return rows; //if dropdown is on default e.options[0], don't filter table rows
      // }
      return rows;
    });

    this.setState({
      filteredRows
    })
  },

  _filterZipDigitsBy(filterBy) {

    var rows = this.state.rows.slice();
    var filteredRows = filterBy ? rows.filter(function(row) {
      return row['zipCode'].length < 6;
    }) : rows;

    this.setState({
      filteredRows,
      filterBy
    })
  },

  _rowGetter(rowIndex) {
    // rowGetter is a function which decides which rows are displayed, so use intersection here
    // TODO add lodash to use: _.intersection([], [], []);
    return this.state.filteredRows[rowIndex];
  },

  _onFirstNameFilterChange(e) {
    this._filterFirstNamesBy(e.target.value);
  },

  _onLastNameFilterChange() {
    this._filterLastNamesBy();
  },

  _onZipDigitFilterChange(c) {
    var c = document.getElementById('zipCheckbox');

    if (c.checked) {
      this._filterZipDigitsBy(c.checked);
      // console.log(this); // this is {object} - constructor.
    }
  },
  
  render() {
    return (
      <div>
        <input type='text' onChange={this._onFirstNameFilterChange} placeholder='Filter by First Name' />
        <select id='lastNameSelect' onChange={this._onLastNameFilterChange}>
          <option value=''>Filter by Last Name</option>
          <option value='abcdefghijklm'>A to M</option>
          <option value='nopqrstuvwxyz'>N to Z</option>
        </select>
        <input type='checkbox' id='zipCheckbox' onChange={this._onZipDigitFilterChange}>Show only five digit Zip Codes</input>      
        <br />
        <Table 
          rowHeight={50}
          rowGetter={this._rowGetter}
          rowsCount={this.state.filteredRows.length}
          width={this.props.tableWidth}
          height={this.props.tableHeight}
          scrollTop={this.props.top}
          scrollLeft={this.props.left}
          headerHeight={50}>
          <Column
            cellRenderer={renderImage}
            dataKey='avartar'
            fixed={true}
            label=''
            width={50} />

          <Column
            dataKey='firstName'
            fixed={true}
            label='First Name'
            width={100} />
          
          <Column
            dataKey='lastName'
            fixed={true}
            label='Last Name'
            width={100} />
          
          <Column
            dataKey='city'
            label='City'
            width={100} />
          
          <Column
            label='Street'
            width={200}
            dataKey='street' />
          
          <Column
            label='Zip Code'
            width={200}
            dataKey='zipCode' />
        </Table>
      </div>
    )
  },
})

module.exports = FilterExample;