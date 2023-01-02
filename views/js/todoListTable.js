// Front-end
// appends the results to the table
const drawTable = () => {
    $("#list").empty();
    $.getJSONuncached = function (url) {
        return $.ajax(
            {
                url: url,
                type: 'GET',
                cache: false,
                success: function (html) {
                    $("#list").append(html);
                    selectRow();
                }
            });
    };
    $.getJSONuncached("/get/html")
};

const selectRow = () => {
    $("#todoList tbody tr[id]").click(function () {
        $(".selected").removeClass("selected");
        $(this).addClass("selected");
        const section = $(this).prevAll("tr").children("td[colspan='2']").length - 1;
        console.log(section)
        const task = $(this).attr("id") - 1;
        deleteRow(section, task);
    })
}

const deleteRow = (sec, task) => {
    $("#delete").click(function () {
        $.ajax({
            url: "/post/delete",
            type: "POST",
            data: {
                section: sec,
                task: task
            },
            cache: false,
            success: setTimeout(drawTable, 1000)
        });
    });
};

// once is ready, call drawTable's function
$(document).ready(function () {
    drawTable();
})