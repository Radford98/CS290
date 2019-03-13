

$(document).ready(function () {
    // Add button's function to add an entry
    $('#addWorkout').click(function (event) {
        event.preventDefault();
        addRow();
    });
    $('#required').hide();  // Hide message about required value
    // Get the table from the DB
    getTable();
});


/* Submits a post request to add a row to the DB then calls the function to
receive and print the table */
function addRow() {
    if ($('name').val() == '') {    // Make sure there is a name value before submitting
        $('#required').show();
    } else {
        $('#required').hide();
        $('#results').hide();   // After an element is added, the message "Table reset" goes away
        $.ajax({
            url: '/',
            type: 'POST',
            data: $('#workout').serialize(),
            success: function (result) {
                getTable();
            }
        });
    }
};

/* Function to get and display the table */
function getTable() {
    console.log("getTable called");
    $.ajax({
        url: '/get-table',
        type: 'GET',
        success: function (result) {
            $('#wBody').empty();     // Remove the current table

            // Process each element of the array, adding a row to the table
            result.forEach(element => {
                if (element.lbs == 1) { element.lbs = 'lbs'; }  // Convert bool to readable values
                else { element.lbs = 'kg'; }

                for (var p in element) {
                    if (element[p] == null) { element[p] = '' };    // Convert nulls to empty strings
                }

                $('#wBody').append('<tr>');
                $('#wBody tr:last-child')
                    .append('<td hidden>' + element.id + '</td>')
                    .append('<td>' + element.name + '</td>')
                    .append('<td>' + element.reps + '</td>')
                    .append('<td>' + element.weight + '</td>')
                    .append('<td>' + element.date + '</td>')
                    .append('<td>' + element.lbs + '</td>')
                    .append('<td> <button id="update' + element.id + '">Update</button> </td>')
                    .append('<td> <button onclick="deleteRow(' + element.id + ')">Delete</button> </td>');
                
                $('#update' + element.id).click(event=> {
                    window.location.href = "/" + element.id;
                });
            });
        }
    });
}

function deleteRow(id) {
    $.ajax({
        url: '/' + id,
        type: 'DELETE',
        success: function (result) {
            getTable();
        }
    });
}

function updateRow(id) {
    $.ajax({
        url: '/' + id,
        type: 'PUT',
        data: $('#wUpdate').serialize(),
        success: function (result) {
            windows.location.replace('./');
        }
    });
}