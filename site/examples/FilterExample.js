"use strict";

var ExampleImage = require('./ExampleImage');
var FakeObjectDataListStore = require('./FakeObjectDataListStore');
var FixedDataTable = require('fixed-data-table');
var React = require('react');
var _ = require('lodash');

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
      filteredRows: null, //intersection of all filtered rows, or all rows if no column filters
      firstNameRows: null,
      lastNameRows: null,
      zipRows: null,
      filterBy: null, //first name search input
      checkbox: null, //boolean status of zip filter
    };
  },

  componentWillMount() {
    this._filterFirstNamesBy(this.state.filterBy);
    this._filterLastNamesBy(this.state);
    this._filterZipsBy(this.state.checkbox);
    this._findIntersection(this.state); //draws all table rows first time
  },

  /** 
   * @param {string} filterBy - text input
   * @returns {array} firstNameRows - filtered column rows
   */
  _filterFirstNamesBy(filterBy) {

    var rows = this.state.rows.slice();      
    var firstNameRows = filterBy ? rows.filter(function(row) {
      return row['firstName'].toLowerCase().indexOf(filterBy.toLowerCase()) > -1;
    }) : rows;

    this.setState({
      firstNameRows,
      filterBy
    })

    // console.log(firstNameRows, filterBy);
  },

  /** 
   * @todo
   */
  _filterLastNamesBy() {

    var rows = this.state.rows.slice();
    var lastNameRows = rows.filter(function(row) {
      return rows;
    });

    this.setState({
      lastNameRows
    })
  },

  /**
   * @param {boolean} checkbox - true if checked
   * @returns {array} zipRows - filtered column rows
   */
  _filterZipsBy(checkbox) {

    var rows = this.state.rows.slice();
    var zipRows = checkbox ? rows.filter(function(row) {
      return row['zipCode'].length < 6;
    }) : rows;

    this.setState({
      zipRows,
      checkbox
    })

    // console.log(zipRows, checkbox);
  },

  /** 
   * @todo - trigger this event again after any of the above filters have changed
   * read about lifecycles https://facebook.github.io/react/docs/working-with-the-browser.html 
   */
  _findIntersection() {
    
    var rows = this.state.rows,
        firstNameRows = this.state.firstNameRows,
        lastNameRows = this.state.lastNameRows,
        zipRows = this.state.zipRows;

    var filteredRows = (firstNameRows || lastNameRows || zipRows) ? rows.filter(function(row) {
      return _.intersection(firstNameRows, lastNameRows, zipRows);
    }) : rows;

    this.setState({
      filteredRows
    })
  },

  /** Gets rows to be displayed */
  _rowGetter(rowIndex) {
    return this.state.filteredRows[rowIndex];
  },

  _onFirstNameFilterChange(e) {
    this._filterFirstNamesBy(e.target.value);
  },

  _onLastNameFilterChange() {
    var e = document.getElementById('lastNameSelect');
    
    var optionAM = e.options[1].value; //returns string 'abc...'. later, check 'row['lastName'].toLowerCase().charAt(0).indexOf(optionAM) > -1'
    var optionNZ = e.options[2].value;

    this._filterLastNamesBy();
  },

  _onZipDigitFilterChange(c) {
    var c = document.getElementById('zipCheckbox');

    if (c.checked) {
      this._filterZipsBy(c.checked);
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