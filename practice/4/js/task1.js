

function filterTable(tableId, filter) {
    let rows = document.querySelectorAll('#'+tableId+' tr');
    let fieldsSelector = Object.keys(filter)
        .map(key => 'td[data-field-name='+key+']')
        .reduce((selector, piece) => selector+','+piece, '')
        .substr(1);  // remove leading comma
    let hasAnyFilter = Object.keys(filter).length > 0;


    function matchesFilter(row) {
        if (!hasAnyFilter) return true;
        let fields = row.querySelectorAll(fieldsSelector);
        for(let field_td of fields) {
            let filterValue = filter[field_td.getAttribute('data-field-name')];
            if (!field_td.innerText.includes(filterValue)) {
                return false;
            }
        }
        return true;
    }

    rows.forEach(row => {
        if (matchesFilter(row)) {
            row.classList.remove('hidden');
        } else {
            row.classList.add('hidden');
        }
    })

}
