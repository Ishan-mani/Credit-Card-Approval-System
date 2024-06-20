function createSelectCheckbox() {
    var selectCheckbox = document.createElement("input");
    selectCheckbox.type = "checkbox";
    selectCheckbox.addEventListener("change", function() {
        // row selection logic 
        var selectedRows = document.querySelectorAll('table tbody tr.selected');
        for (var i = 0; i < selectedRows.length; i++) {
            selectedRows[i].classList.remove('selected');
            var checkboxes = selectedRows[i].querySelectorAll('input[type="checkbox"]');
            for (var j = 0; j < checkboxes.length; j++) {
                checkboxes[j].checked = false;
            }
        }

        var row = this.parentNode.parentNode; //  parent row
        if (this.checked) {
            row.classList.add('selected'); // Select  row
        } else {
            row.classList.remove('selected'); // Unselect row
        }
    });
    return selectCheckbox;
}

// Load data from XLSX to table
var xlsxFilePath = 'cleaned_dataset_cs.xlsx';
var req = new XMLHttpRequest();
req.open('GET', xlsxFilePath, true);
req.responseType = 'arraybuffer';

req.onload = function (e) {
    var data = new Uint8Array(req.response);
    var workbook = XLSX.read(data, { type: 'array' });
    var firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    var jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

    var table = document.querySelector('table');
    var tbody = table.querySelector('tbody');

    for (var i = 1; i < jsonData.length && i <= 50; i++) { // Start from the second row 
        var row = tbody.insertRow();

        // Create a cell for the Select checkbox
        var selectCell = row.insertCell();
        var selectCheckbox = createSelectCheckbox();
        selectCell.appendChild(selectCheckbox);

        // Create a cell for the ID
        var idCell = row.insertCell();
        idCell.textContent = jsonData[i][0]; // Assuming "ID" is in the first column

        // Create cells for other data
        for (var j = 1; j < jsonData[i].length; j++) { // Start from the second column
            var cell = row.insertCell();
            cell.textContent = jsonData[i][j];
        }
    }
};

req.send();
function searchAndHighlight() {
    var searchInput = document.getElementById('searchInput').value.trim();
    var table = document.querySelector('table');
    var rows = table.getElementsByTagName('tr');

    for (var i = 1; i < rows.length; i++) { // Start from the second row to skip the header
        var cell = rows[i].getElementsByTagName('td')[1]; // Select the first column (ID column)

        var cellText = cell.textContent.trim();

        if (cellText.trim() === searchInput) {
            rows[i].classList.add('highlight');
        } else {
            rows[i].classList.remove('highlight');
        }
    }
}

