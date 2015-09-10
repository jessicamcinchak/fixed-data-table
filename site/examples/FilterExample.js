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
      rows : new FakeObjectDataListStore().getAll(),
      filteredRows: null,
      filterBy: null
    };
  },

  componentWillMount() {
    this._filterFirstNamesBy(this.state.filterBy);
    this._filterZipDigitsBy(this.state.filterBy);
  },

  _filterFirstNamesBy(filterBy) {

    var rows = this.state.rows.slice();        
    var filteredRows = filterBy ? rows.filter(function(row) {
      return row['firstName'].toLowerCase().indexOf(filterBy.toLowerCase()) >= 0;
    }) : rows;

    this.setState({
      filteredRows, //filteredRows is an array of objects
      filterBy //filterBy is text input
    })
  },

  _filterZipDigitsBy() {

    var rows = this.state.rows.slice();
    var filteredRows = rows.filter(function(row) {
      return row['zipCode'].length < 6; //filters 5-digit zips, TODO attach to checkbox click event
    });

    this.setState({
      filteredRows
    })
  },

  _rowGetter(rowIndex) {
    return this.state.filteredRows[rowIndex];
  },

  _onFirstNameFilterChange(e) {
    this._filterFirstNamesBy(e.target.value);
  },

  _onZipDigitFilterChange(e) {
    this._filterZipDigitsBy();
  },
  
  render() {
    return (
      <div>
        <input type='text' onChange={this._onFirstNameFilterChange} placeholder='Filter by First Name' />
        <input type='checkbox' onChange={this._onZipDigitChange} value='Show only 5-digit Zip Codes' />
        @todo select box dropdown filter: show A-M or N-Z last names
        
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
            width={50}
          />
          <Column
            dataKey='firstName'
            fixed={true}
            label='First Name'
            width={100}
          />
          <Column
            dataKey='lastName'
            fixed={true}
            label='Last Name'
            width={100}
          />
          <Column
            dataKey='city'
            label='City'
            width={100}
          />
          <Column
            label='Street'
            width={200}
            dataKey='street'
          />
          <Column
            label='Zip Code'
            width={200}
            dataKey='zipCode'
          />
        </Table>
      </div>
    )
  },
})

module.exports = FilterExample;