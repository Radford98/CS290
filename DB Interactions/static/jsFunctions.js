

$(document).ready(function () {
    $('#addWorkout').click(function (event) {
        event.preventDefault();
        addRow();
    });

    getTable();
});


/* Submits a post request to add a row to the DB then calls the function to
receive and print the table */
function addRow() {
    console.log("addRow called");
    $.ajax({
        url: '/',
        type: 'POST',
        data: $('#workout').serialize(),
        success: function (result) {
            getTable();
        }
    });
};

/* Function to get and display the table */
function getTable() {
    console.log("getTable called");
    $.ajax({
        url: '/get-table',
        type: 'GET',
        success: function (result) {
            $('wBody').empty();     // Remove the current table

            // Process each element of the array, adding a row to the table
            result.forEach(element => {
                if (element.unit == '1') { element.unit = 'lbs'; }  // Convert bool to readable values
                else { element.unit = 'kg'; }

                $('#wBody')
                    .append('<tr>')
                    .append('<td hidden>' + '</td>')
                    .append('<td>' + element.name + '</td>')
                    .append('<td>' + element.reps + '</td>')
                    .append('<td>' + element.weight + '</td>')
                    .append('<td>' + element.date + '</td>')
                    .append('<td>' + element.unit + '</td>');
            });
        }
    });
}