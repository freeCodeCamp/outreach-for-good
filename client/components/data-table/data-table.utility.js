/*
  * Add summary rows to data and indexMap based on the values set in FixedColumn
  *  @input: data - full data set
  *  @input: indexMap - sorted and filtered
  *  @output: _data - data set with "summary rows" appended to the end
  *  @output: _indexMap - collapsed/hidden indexes removed
  */
export var insertSummaryRows = (data, table) => {
  var _data = data;
  var _indexMap = table.get('indexMap');
  var groupCol = table.get('groupColumn');
  if(table.getFixedColumn(table) && data.size) {
    const displayColumn = groupCol.get('displayColumn');
    const summaryRows = groupCol.get('summaryRows');
    const groupIndices = groupCol.get('groupIndices');
    let count = -1;
    // console.log('indexMap: ', _indexMap && _indexMap.toJS());
    // console.log('displayColumn: ', displayColumn);
    // console.log('summaryRows: ', summaryRows && summaryRows.toJS());
    // console.log('groupIndices: ', groupIndices && groupIndices.toJS());
    // console.log('rowDefinition: ', rowDefinition && rowDefinition.toJS());
    groupIndices.forEach(i => {
      count += 1;
      _data = _data.push(_data.get(0).map((v, k) => {
        if(k === displayColumn) {
          return `${summaryRows.getIn([i + count, 'groupColumn', 'group'])}
            (${summaryRows.getIn([i + count, 'groupColumn', 'count'])})`;
        } else if(summaryRows.getIn([i + count, k]) !== null) {
          return summaryRows.getIn([i + count, k]);
        }
        return '';
      }));
    });
    _indexMap = table.removeCollapsedDataFromIndexMap(table, _data.size);
  }

  return { _data, _indexMap };
};
